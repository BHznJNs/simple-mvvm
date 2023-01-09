import Component from "./component.js"
import Mixin from "../utils/Mixin.js"
import el from "../utils/el.js"

class Mvvm {
    constructor(app) {
        this.app = app
    }
    mount(query) {
        const mountTarget = document.querySelector(query)
        mountTarget.appendChild(this.app)
    }
}

export { Component, Mixin, el }
export default Mvvm
