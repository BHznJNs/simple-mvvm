import { Component, el, fragment } from "../../src/index.js"

const app = new Component({
    data: {
        text: ""
    },
    render() {
        const input = el("input", {
            placeholder: "please enter something"
        })
        const span = el("span")

        this.formBind(input, "$d", "text")
        this.propBind(span, "$d", "text", "textContent")

        return fragment([
            input, span
        ])
    }
})

export default app