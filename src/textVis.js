const wordMap = new Map()
let highestFrequency = 0
let scaler = 0
const hue = 230
const commonWords = ['the', 'of', 'and', 'in', 'a', 'an', 'is', 'was', 'to', 'were', 'have', 'has', 'by', 'as', 'with', 'when', 'which', 'more', 'than', 'that', 'for', 'be', 'it']
const isUnique = false;
const createdWordElements = []
const scaleTo = 100

export default () => {
    const nodes = document.querySelectorAll('[datavis]')
    for (const node of nodes) {
        const allText = node.textContent.toLowerCase()
        const words = allText.match(/\w+/g) || []

        words.forEach(word => {
            if (!commonWords.includes(word)) {
                if (wordMap.has(word)) {
                    wordMap.set(word, wordMap.get(word) + 1)
                } else {
                    wordMap.set(word, 1)
                }
            }
        })
        calcScaler()
        const newNode = processNode(node)
        node.innerHTML = newNode.innerHTML
        if (node instanceof Element) {
            node.style.backgroundColor = `hsl(${hue + 45}, 20%, 20%)`
        }
    }
}

const processNode = (node) => {
    if (node instanceof Element && !node.childNodes.length) {
        return node
    }
    const newNode = document.createElement(node.tagName)

    for (const child of node.childNodes) {
        if (child instanceof Text) {
            let text = child.textContent
            while (text) {
                const wordMatch = text.match(/\w/)
                const nonWordMatch = text.match(/\W/)
                let element;
                if (wordMatch && nonWordMatch && !wordMatch.index) {
                    element = createSpan(text.slice(0, nonWordMatch.index))
                    createdWordElements.push(element)
                    text = spliceSlice(text, 0, nonWordMatch.index)
                } else if (wordMatch && nonWordMatch) {
                    element = document.createTextNode(text.slice(0, wordMatch.index))
                    text = spliceSlice(text, 0, wordMatch.index)
                } else if (!wordMatch && nonWordMatch) {
                    element = document.createTextNode(text.slice(0, text.length))
                    text = spliceSlice(text, 0, text.length)
                } else if (wordMatch && !nonWordMatch) {
                    element = createSpan(text.slice(0, text.length))
                    createdWordElements.push(element)
                    text = spliceSlice(text, 0, text.length)
                }
                newNode.appendChild(element)
            }
        }
        else if (child instanceof Element) {
            newNode.appendChild(processNode(child))
        }
    }

    return newNode
}

const createSpan = (text) => {
    const span = document.createElement('span')
    span.innerHTML = text
    let frequency = wordMap.get(text.toLowerCase()) || 0
    frequency = isUnique ? highestFrequency - frequency : frequency
    const heatValue = Math.floor(frequency * scaler)
    span.style.color = `hsl(${hue}, ${30 + heatValue}%, ${30 + heatValue}%)`
    return span
}

const calcScaler = () => {
    highestFrequency = Math.max(...[...wordMap.values()])
    scaler = scaleTo / highestFrequency
}

const spliceSlice = (str, index, count) => {
    return str.slice(0, index) + str.slice(index + count);
}