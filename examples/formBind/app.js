import { Component, staticEl, fragment } from "../../src/index.js"

const app = new Component({
    data: {
        text: ""
    },
    render(self) {
        const input = staticEl("input", {
            placeholder: "please enter something",
            onchange() {
                self.$d.text = this.value
            }
        })
        const span = this.el("span", {
            textContent: this.$d.text
        })

        return fragment([
            input, span
        ])
    }
})

export default app