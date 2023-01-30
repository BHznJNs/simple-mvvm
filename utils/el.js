export default function (tagName, options, children) {
    const el = document.createElement(tagName)

    if (options) {
        const attr = options.attr
        if (attr) {
            for (let key in attr) {
                el.setAttribute(key, attr[key])
            }
            Reflect.deleteProperty(options, "attr")
        }
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
