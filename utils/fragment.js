export default function fragment(children) {
    const root = new DocumentFragment()
    if (children instanceof Array) {
        for (const el of children) {
            root.appendChild(el)
        }
    } else {
        root.appendChild(children)
    }
    return root
}