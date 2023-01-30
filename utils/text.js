import fragment from "./fragment.js"

const errMsg = "[MVVM] Error: irrelevant type of argument."

export default function text(content) {
    if (typeof content === "string") {
        return new Text(content)
    } else if (content instanceof Array) {
        return fragment(
            content.map(t => {
                return new Text(t)
            })
        )
    } else {
        throw new Error(errMsg)
    }
}