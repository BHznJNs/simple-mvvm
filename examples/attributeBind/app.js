import { Component, el } from "../../src/index.js"

const app = new Component({
    data: {
        message: "Hello World"
    },
    render() {
        const presentation = el("h1", {
            textContent: "Attribute example: click to change title of this element.",
            onclick: () => {
                this.$d.message = "Happy new year!"
            }
        })
        this.attrBind(presentation, "$d", "message", "title")

        return presentation
    }
})

export default app