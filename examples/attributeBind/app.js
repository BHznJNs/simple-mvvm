import { Component } from "../../src/index.js"

const app = new Component({
    data: {
        message: "Hello World"
    },
    render() {
        const presentation = this.el("h1", {
            textContent: "Attribute example: click to change title of this element.",
            onclick: () => {
                this.$d.message = "Happy new year!"
            },
            attr: {
                title: this.$d.message
            }
        })

        return presentation
    }
})

export default app