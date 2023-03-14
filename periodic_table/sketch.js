getElements()
var elementData
async function getElements() {
    elementData = await fetch('element_data.json', {cache: 'no-cache'}).then(response => response.json())
    console.log(elementData)
    for (let data of elementData.elements) {
        let element = elementTemplate.content.querySelector('.element').cloneNode(true)
        element.innerHTML = data.Name
        if (data.AtomicNumber >= 57 && data.AtomicNumber <= 71) {
            // element.style.left = `${((data.AtomicNumber - 55) / 18) * 100}%`
            // element.style.top = `${90}%`
        } else if (data.AtomicNumber >= 89 && data.AtomicNumber <= 103) {
            // element.style.left = `${((data.AtomicNumber - 87) / 18) * 100}%`
            // element.style.top = `${100}%`
        } else {
            element.style.left = `${(data.Group - 1) * 5.5 + 0.75}%`
            element.style.top = `${(data.Period - 1) * 11}%`
        }
        
        container.appendChild(element)
    }
}