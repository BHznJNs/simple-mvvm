import Component from "./Component.js"
import Iterator from "./Iterator.js"
import el from "../utils/el.js"
import fragment from "../utils/fragment.js"
import text from "../utils/text.js"

class Mvvm {
    constructor(app) {
        this.app = app
    }
    mount(query) {
        const mountTarget = document.querySelector(query)
        mountTarget.appendChild(this.app)
    }
}

export {
    Component, Iterator,
    el, fragment, text,
}
export default Mvvm