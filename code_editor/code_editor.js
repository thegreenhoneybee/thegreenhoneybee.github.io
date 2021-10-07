/*
TODO:
Resolve external includes within class language
*/


export class CodeEditor {

  static setup(codeArea) {
    return new CodeEditor(codeArea, codeArea.textContent)
  }

  constructor(parent, defaultContent) {
    parent.innerHTML = `<div class="lineCount"></div><div class="textWrapper"><textarea class="text"></textarea><div class="display"></div></div><div class="errors"></div>`

    //HTML objects
    this.parent = parent
    this.lineNumbers = parent.children[0]
    this.text = parent.children[1].children[0]
    this.display = parent.children[1].children[1]
    this.errors = parent.children[2]

    this.text.value = defaultContent

    this.syntaxParser = new SyntaxParser()
    this.syntaxParser.onchange = this.updateText.bind(this)
    this.syntaxParser.getLanguage(this.parent.getAttribute('href'))
    this.syntaxParser.setPrimaryLanguage(this.parent.getAttribute('language'))


    this.text.onkeydown = function(evt) {
      if (evt.keyCode == 9) {
        evt.preventDefault()
        document.execCommand("insertText", false, "\t");
      }
    }
    this.text.oninput = this.updateText.bind(this)
    this.text.onscroll = this.handleScroll.bind(this)

    this.updateText()
  }

  setHighlightColours(colours) {
    this.syntaxParser.setHighlightColours(colours)
  }

  handleScroll() {

  }

  updateText() {
    this.display.innerHTML = this.syntaxParser.highlightText(this.text.value)
    this.updateLineCount()
  }

  updateLineCount() {

  }
}

class SyntaxParser {
  constructor() {
    this.languages = {}
    this.primaryLanguage
    this.colours
    this.onchange
  }

  setPrimaryLanguage(name) {
    this.primaryLanguage = name
  }

  getLanguage(filePath) {
    fetch(filePath)
    .then(response => {if (response.ok) {return response.text()}})
    .then(data => {
      if (data) {
        this.addLanguage(Language.readTMLanguageFile(data))
      }
    })
  }

  addLanguage(lang) {
    this.languages[lang.scopeName] = new Language(lang.name, lang.patterns, lang.repository, this)

    if (this.onchange) {this.onchange()}
  }

  setHighlightColours(colours) {

  }

  highlightText(text) {
    if (!this.languages[this.primaryLanguage]) {
      return text
    }
    return this.tokenize(text)
  }

  tokenize(text) {
    console.log(this.languages[this.primaryLanguage])
    var lines = text.split('\n')
    var scope = this.languages[this.primaryLanguage]
  }
}

class LanguageToken {

}

class Language {
  static readTMLanguageFile(xml) {
    var parser = new DOMParser()
    var doc = parser.parseFromString(xml,"text/xml");
    var node = doc
    while (!/dict|array|string/.test(node?.tagName)) {
      node = node.firstElementChild
    }
    var lang = this.convert(node)
    this.stringToRegex(lang.patterns)
    this.stringToRegex(lang.repository)
    return lang
  }

  static convert(node) {
    var t
    switch (node.tagName) {
      case 'dict':
      t = {}
      for (var i = 0; i < node.children.length; i += 2) {
        t[node.children[i].textContent] = this.convert(node.children[i + 1])
      }
      break
      case 'array':
      t = []
      for (var i = 0; i < node.children.length; i++) {
        t.push(this.convert(node.children[i]))
      }
      break
      case 'string':
      t = node.textContent
      break
    }
    return t
  }

  static stringToRegex(patterns) {
    var keys = Object.keys(patterns)
    for (var i = 0; i < keys.length; i++) {
      if (patterns[keys[i]].match) {
        patterns[keys[i]].match = new RegexParser(patterns[keys[i]].match)
      }
      if (patterns[keys[i]].begin) {
        patterns[keys[i]].begin = new RegexParser(patterns[keys[i]].begin)
      }
      if (patterns[keys[i]].end) {
        patterns[keys[i]].end = new RegexParser(patterns[keys[i]].end)
      }
      if (patterns[keys[i]].patterns) {
        this.stringToRegex(patterns[keys[i]].patterns)
      }
    }
  }

  constructor(name, patterns, repository, parser) {
    this.name = name
    this.patterns = patterns
    this.repository = repository
    this.tokens = this.getTokens(patterns).concat(this.getTokens(repository)).sort()

    this.parser = parser
  }

  getTokens(patterns, out = []) {
    patterns = Object.values(patterns)
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i].name) {
        out.push(patterns[i].name)
      }
      if (patterns[i].beginCaptures) {
        this.getTokens(patterns[i].beginCaptures, out)
      }
      if (patterns[i].endCaptures) {
        this.getTokens(patterns[i].endCaptures, out)
      }
      if (patterns[i].patterns) {
        this.getTokens(patterns[i].patterns, out)
      }
    }
    return out
  }
}

//Attempts to compile to javascript regex to minimise overhead on execution
class RegexParser {

  constructor(pattern) {
    this.groups = {count: 0, added: []}
    this.regex = new RegExp(RegexParser.flat(RegexParser.handleGroup(pattern, {groups: this.groups})), 'g')
  }

  static flat(o) {
    return typeof(o) != 'object' ? o : o.reduce((a, c)=> {return a + RegexParser.flat(c)}, '')
  }

  //Regex language atoms
  /*
   - All functions return in the format {atoms: [...], length ...}
   - Length tells RegexParser.handleGroup how much of the input to skip forward
   - Atoms are arrays of distinct atoms (individual characters or character sets)
   - Groups are sub arrays within Atoms
  */
  static atoms = [
    //Mode modifiers
    function(localArgs, globalArgs) {
      var m
      if (m = /^\(\?x\)/.exec(localArgs.input)) {
        localArgs.freeSpacing = true
        return {atoms: [], length: m[0].length}
      }
      return false
    },

    //Character classes
    function(localArgs, globalArgs) {
      var m
      if (m = /^\[\^?(?=(\])?)\1([^\]\\]|\\\])*\]/.exec(localArgs.input)) {
        return {atoms: [m[0].replace(/\[(\^)?\]/, '[$1\\]')], length: m[0].length}
      }
      return false
    },

    //Free spacing
    function(localArgs, globalArgs) {
      var m
      if (localArgs.freeSpacing && (m = /^(\s+|#.*)/.exec(localArgs.input))) {
        return {atoms: [], length: m[0].length}
      }
      return false
    },

    //Groups
    /*
     - Get start of group
     - Get contents of group
     - Pass contents back to RegexParser.handleGroup
     - Resolve atomic groups
    */
    function(localArgs, globalArgs) {
      var m
      if (m = /^\((\?(?:[:>]|<?[!=]|'[a-zA-Z][a-zA-Z0-9]*'|<[a-zA-Z][a-zA-Z0-9]*>))?/.exec(localArgs.input)) {
        var inner = ''
        var depth = 1
        for (var i = m[0].length; i < localArgs.input.length; i++) {
          if (localArgs.input[i] == '(') {
            depth += 1
          } else if (localArgs.input[i] == ')') {
            depth -= 1
            if (depth == 0) {break}
          } else if (localArgs.input[i] == '\\') {
            inner += localArgs.input[i++]
          }
          inner += localArgs.input[i]
        }

        if (i == localArgs.input.length) {
          throw `SyntaxError: Invalid regular expression: ${globalArgs.pattern}: Invalid group`
        }

        var length = m[0].length + inner.length + 1
        var out

        inner = RegexParser.handleGroup(inner, globalArgs, localArgs)

        if (!/\?(?:[:>]|<?[!=])/.exec(m[1])) {
          ++globalArgs.groups.count
        }
        if (m[1] == '?>') {
          globalArgs.groups.added.push(++globalArgs.groups.count)
          out = [['(?=', '(', ...inner, ')', ')'], `\\${globalArgs.groups.count}`]
        } else {
          out = [[m[0], ...inner, ')']]
        }

        return {atoms: out, length: length}
      }
      return false
    },

    //Possesive Quantifiers
    function (localArgs, globalArgs) {
      var m
      if (m = /^([+*?])\+/.exec(localArgs.input)) {
        globalArgs.groups.added.push(++globalArgs.groups.count)
        return {atoms: [['(?=', '(', localArgs.output.pop(), m[1], ')', ')'], `\\${globalArgs.groups.count}`], length: m[0].length}
      }
      return false
    },

    //Default
    function(localArgs, globalArgs) {
      var m
      if (m = /^([^\\]|\\[^])/.exec(localArgs.input)) {
        return {atoms: [m[0]], length: m[0].length}
      }
      return false
    }
  ]

  static handleGroup(pattern, globalArgs, inheritedArgs={}) {
    var result
    var localArgs = {pattern: pattern, input: pattern, output: [], freeSpacing: inheritedArgs.freeSpacing || false}

    for (var i = 0; i < localArgs.pattern.length;) {
      localArgs.input = localArgs.pattern.slice(i)
      for (var j = 0; j < RegexParser.atoms.length; j++) {
        result = RegexParser.atoms[j](localArgs, globalArgs)
        if (result) {break}
      }
      if (result.atoms.length) {localArgs.output.push(...result.atoms)}
      i += result.length
    }
    return localArgs.output
  }
}
