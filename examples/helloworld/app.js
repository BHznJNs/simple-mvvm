import { Component, el } from "../../src/index.js"

const app = new Component({
    render() {
        const root = el("h1", {
            textContent: "Hello World!"
        })
        return root
    }
})

export default app