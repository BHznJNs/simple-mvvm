export default function (tagName, options, children) {
    const el = document.createElement(tagName)

    if (options) {
        Object.assign(el, options)
    }

    if (children) {
        // Check is `children` an Array or single Element
        if (children instanceof Array) {
            for (const childEl of children) {
                el.appendChild(childEl)
            }
        } else {
            el.appendChild(children)
        }
    }

    return el;
}
