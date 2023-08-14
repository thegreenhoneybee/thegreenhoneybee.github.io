const flashlight = document.getElementById('flashlight') as HTMLDivElement
const projects = document.getElementById('projects') as HTMLElement
const projectTemplate = document.getElementById('projectTemplate') as HTMLTemplateElement

const batchProjectCentering = document.getElementById('batchProjectCentering') as HTMLStyleElement
const batchProjectAlignment = document.getElementById('batchProjectAlignment') as HTMLStyleElement

const state = {
    cursor: {x: 0, y: 0},
    hexagonColumns: 0
}

// Triggers everytime an observed element enters or exists the viewport
const windowIntersectionObserver = new IntersectionObserver((entires) => {
    entires.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.remove('hidden')
        } else if (entry.boundingClientRect.top > 0) {
            entry.target.classList.add('hidden')
        }
    })
}, {threshold: 0.5})

// Update the position and scroll of the cursor background
function updateFlashlight(e: Event): void {
    if (e instanceof MouseEvent) {
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

// Loads projects from json, creates html from template element
async function loadProjects(): Promise<void> {
    const projectsData = await fetch('resources/projects.json', {cache: 'no-cache'}).then(response => response.json()) as {[key: string]: {[key: string]: string}}

    let counter = 0
    for (let [title, description] of Object.entries(projectsData.complete)) {
        const projectWrapper = projectTemplate.content.querySelector('.projectWrapper')!.cloneNode(true) as Element
        const projectObserver = projectWrapper.querySelector('.projectObserver')!
        const project = projectWrapper.querySelector('.project')!
        const projectTitle = projectWrapper.querySelector('h4.centered')!
        const projectDescription = projectWrapper.querySelector('p.centered')!

        windowIntersectionObserver.observe(projectObserver)
        project.setAttribute('href', `/${title.toLowerCase().replace(/\s/g, '_')}`)

        projectTitle.textContent = title
        projectTitle.setAttribute('name', `ct${counter++}`)

        projectDescription.textContent = description
        projectDescription.setAttribute('name', `ct${counter++}`)

        projects.append(projectWrapper)
    }

    centerHexagonContent(4)
    updateHexagons()
}

// Centers text within elements with the class 'centered' recursively 
function centerHexagonContent(n=0) {
    batchProjectCentering.innerHTML = Array.from(projects.querySelectorAll('.centered')).map((e, i) => {
        const paddingSize = (contentHeight(e.parentElement!) - contentHeight(e)) / 2
        return `.centered[name=ct${i}] { padding-top: ${paddingSize}px; }`
    }).join('\n')

    if (n > 1) {
        requestAnimationFrame(centerHexagonContent.bind(null, n - 1))
    }
}

// Return the height of an element without padding
function contentHeight(element: Element) {
    const cs = getComputedStyle(element)
    const padding = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
    return element.clientHeight - padding
}

// Updates the css to reflect the number of columns of hexagons
function updateHexagons() {
    const style = getComputedStyle(projects)
    const columns = style.getPropertyValue('grid-template-columns').split(' ').filter(p => p != '0px')
    const hexagonColumns = (columns.length - 1) / 2

    if (hexagonColumns == state.hexagonColumns) {return}

    state.hexagonColumns = hexagonColumns
    const offset = Math.ceil(hexagonColumns / 2)

    projects.querySelectorAll('projectObserver').forEach((p) => {
        p.classList.add('hidden')
    })

    if (hexagonColumns > 1) {
        batchProjectAlignment.innerHTML = `.projectWrapper:nth-of-type(${hexagonColumns}n + 1) { grid-column-end: span 3 !important; }\n` +
                                          `.projectWrapper:nth-of-type(${hexagonColumns}n + ${offset + 1}) { grid-column-end: span 5 !important; }`
    } else {
        batchProjectAlignment.innerHTML = `.projectWrapper { grid-column-end: span 3 !important; grid-row-end: span 2 !important; }\n` +
                                          `#projects { padding-bottom: 0 !important; }`
    }
}


window.addEventListener('mousemove', updateFlashlight)
window.addEventListener('scroll', updateFlashlight)
window.addEventListener('resize', updateHexagons)
loadProjects()