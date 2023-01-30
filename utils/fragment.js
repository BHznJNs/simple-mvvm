export default function fragment(children) {
    const root = new DocumentFragment()

    if (!children) {
        console.warn(`[MVVM] Warning: \`fragment()\` received \`${children}\` and expected HTMLElement.`)
        return root
    }

    if (children instanceof Array) {
        for (const el of children) {
            root.appendChild(el)
        }
    } else {
        root.appendChild(children)
    }
    return root
}