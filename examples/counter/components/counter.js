import { Component, el, fragment } from "../../../src/index.js"

const counter = new Component({
    name: "counter",
    data: {
        count: 0,
    },
    render(self) {
        const countNum = this.el("span", {
            textContent: this.$d.count
        })

        const presentation = el(
            "h1", null,
            [
                el("span", {
                    textContent: "Current count: "
                }),
                countNum
            ]
        )
        const button = el(
            "button",
            {
                textContent: "Add",
                onclick() {
                    self.$d.count += 1
                }
            }
        )

        return fragment([
            presentation, button
        ])
    }
})

export default counter