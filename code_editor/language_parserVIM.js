highlightWithin(tokenList) {
  for (var i = 0; i < this.language.patterns.length; i++) {
    var pattern = this.language.patterns[i]

    if (pattern.match) {

      pattern.match.lastIndex = 0
      var match = pattern.match.exec(tokenList.text)
      var targetToken = tokenList.first

      while (match) {
        while (targetToken.lastIndex < match.index) {targetToken = targetToken.next}
        //First index of match is in targetToken
        if (targetToken.name == null && match.index + match[0].length < targetToken.lastIndex) {
          targetToken.insertBefore(new Token(match[0], match.index, pattern.name))
        }

        match = pattern.match.exec(tokenList.text)
      }

    }
    continue
  }
  return tokenList
}
}

class TokenList {
constructor(text) {
  this.text = text

  var token = new Token(text)
  this.first = token
}
}

class Token {
constructor(text, index = 0, name = null) {
  this.text = text
  this.name = name

  this.index = index
  this.lastIndex = index + text.length//not inclusive

  this.next
}

insertBefore(token) {
  token.next = new Token(this.text.slice(token.lastIndex - this.index), token.lastIndex)
  token.next.next = this.next

  this.text = this.text.slice(0, token.index - this.index)
  this.lastIndex = token.index
  this.next = token
}
}
