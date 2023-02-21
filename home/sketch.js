let state = {
    cursor: {x: 0, y: 0},
    hexagonColumns: null
}

window.addEventListener('load', () => {
    window.addEventListener('mousemove', updateCursor)
    window.addEventListener('scroll', updateCursor)
    window.addEventListener('resize', updateHexagons)
    loadProjects()
})

function updateCursor(e) {
    if (e.type == 'mousemove') {
        state.cursor.x = e.clientX
        state.cursor.y = e.clientY
    }
    Object.assign(flashlight.style, {
        left: `${state.cursor.x}px`,
        top: `${state.cursor.y}px`,
        '-webkit-mask-position-x': `-${state.cursor.x + window.scrollX / 4}px`,
        '-webkit-mask-position-y': `-${state.cursor.y + window.scrollY / 4}px`,
        'mask-position-x': `-${state.cursor.x + window.scrollX / 4}px`,
        'mask-position-y': `-${state.cursor.y + window.scrollY / 4}px`,
    })
}

async function loadProjects() {
    const projectsData = await fetch('projects.json', {cache: 'no-cache'}).then(response => response.json())

    let counter = 0
    for (let [title, description] of Object.entries(projectsData.complete)) {
        let project = projectTemplate.content.cloneNode(true)
        let content = project.querySelectorAll('.centered')

        content[0].textContent = title
        content[0].setAttribute('name', `ct${counter++}`)

        content[1].textContent = description
        content[1].setAttribute('name', `ct${counter++}`)
        
        project.querySelector('.project').setAttribute('href', `/${title.toLowerCase().replace(/\s/g, '_')}`)
        
        if (Math.random() < 0.1) {
            
            document.getElementById('projects').append()
        }
        document.getElementById('projects').append(project)
    }

    centerHexagonContent(3)
    updateHexagons()
}

function centerHexagonContent(n=0) {
    batchProjectCentering.innerHTML = Array.from(projects.querySelectorAll('.centered')).map((e, i) => {
        return `.centered[name=ct${i}] { padding-top: ${(contentHeight(e.parentElement) - contentHeight(e)) / 2}px; }`
    }).join('\n')

    if (n > 1) {
        requestAnimationFrame(centerHexagonContent.bind(null, n - 1))
    }
}

function contentHeight(element) {
    let cs = getComputedStyle(element)
    let padding = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
    return element.clientHeight - padding
}

function updateHexagons() {
    let style = getComputedStyle(projects)
    let sideLength = style.getPropertyValue('--s')
    let columns = style.getPropertyValue('grid-template-columns')
    let hexagonColumns = columns.match(new RegExp(sideLength, 'g')).length
    if (hexagonColumns == state.hexagonColumns) {return}

    state.hexagonColumns = hexagonColumns
    let offset = Math.ceil(hexagonColumns / 2)

    if (hexagonColumns > 1) {
        batchProjectAlignment.innerHTML = `.projectWrapper:nth-of-type(${hexagonColumns}n + 1), .projectWrapper:first-of-type { grid-column-end: span 3 !important; }\n` +
                                          `.projectWrapper:nth-of-type(${hexagonColumns}n + ${offset + 1}) { grid-column-end: span 5 !important; }`
    } else {
        batchProjectAlignment.innerHTML = `.projectWrapper { grid-column-end: span 3 !important; grid-row-end: span 2 !important; }\n` +
                                          `#projects { padding-bottom: 0 !important; }`
    }
}

