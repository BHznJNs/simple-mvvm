import Component from "./Component.js"
import Iterator from "./Iterator.js"
import staticEl from "../utils/staticEl.js"
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
    staticEl, text,
    fragment,
}
export default Mvvm