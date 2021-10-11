var filter

window.onload = requestIdeas

// Gets ideas.json via an XMLHttpRequest
function requestIdeas() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && (this.status == 200 || this.status == 0)) {
      createProjectArea(parseYAMLLike(this.response))
    }
  }
  xhttp.open("GET", "../ideas.YAML", true)
  xhttp.send()
}


// A dirty partial YAML-Like parser specifically for ideas.YAML.
// This is definitely a waste of time and effort, but hey, I wanted to make E V E R Y T H I N G from scratch.
// Why not just format the ideas file as a JSON?
// Because mere hours of coding can save entire minutes of writing new ideas in JSON rather than YAML.
function parseYAMLLike(input) {
  var validLine = /( *)- ((?:[^:]|:.)*)(:?)/

  // Cleaning up YAML input into an array of lines
  input = input.split(/\r?\n/).filter(x=>x.match(validLine)).map(x=>{
    x = x.match(validLine)
    return {indent: x[1].length, content: x[2], isKey: Boolean(x[3])}
  })

  // Helper function to recursively create Objects
  function helper(input, output = {}) {
    var index = 0
    for (var i = 0; i < input.length;) {
      if (input[i].isKey) {
        output[input[i].content] = {}
        // Gather every record where the level of indentation differs to that of the key
        for (var j = i + 1; j < input.length && input[j].indent != input[i].indent; j++) {}
        helper(input.slice(i + 1, j), output[input[i].content])
        i = j
      } else {
        output[index++] = input[i++].content
      }
    }
    return output
  }

  return helper(input)
}

function createProjectArea(ideas) {
  var tabsHTML = ''
  var projectsHTML = ''

  var tab, projectArea, project
  Object.keys(ideas).reverse().forEach(type=>{
    tabsHTML += `<label class="interactable" onchange="displayTab()"><input name="tabs" type="radio" ${type == 'Games' ? 'checked' : ''}><div>${type}</div></label>`

    projectsHTML += `<div class="${type == 'Games' ? '' : 'hidden'}" name="${type}">`
    Object.keys(ideas[type]).forEach(name=> {
      let uri = urlify(name)
      projectsHTML += `<a href="../${uri}" class="project">
  			<img src="../${uri}/pic.png" alt="">
  			<h3>${name}</h3>
  			<p>${ideas[type][name][0]}</p>
  		</a>`
    })
    projectsHTML += `</div>`
  })

  tabs.innerHTML = tabsHTML
  projectsDiv.innerHTML = projectsHTML
  document.querySelectorAll('.project').forEach((node) => {
    node.addEventListener('mouseenter', function(){this.children[2].style.height = this.children[2].scrollHeight + 'px'})
    node.addEventListener('mouseleave', function(){this.children[2].style.height = 0})
  })

}

function urlify(n) {
  return n.toLowerCase().replace(/ /g, '_')
}

function displayTab() {
  document.querySelector('#projectsDiv > div:not(.hidden)').classList.add('hidden')
  document.querySelector(
    `#projectsDiv > div[name="${document.querySelector('#tabs > label > input:checked ~ div').innerText}"]`
  ).classList.remove('hidden')
}
