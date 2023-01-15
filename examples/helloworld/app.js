import { Component, el } from "../../src/index.js"

const app = new Component({
    render() {
        return el("h1", {
            textContent: "Hello World!"
        })
    }
})

export default app