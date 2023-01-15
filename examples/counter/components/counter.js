import { Component, el } from "../../../src/index.js"

const counter = new Component({
    name: "counter",
    data: {
        count: 0,
    },
    render(self) {
        const countNum = el("span")
        self.propBind(countNum, "count", "textContent")

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

        const root = el(
            "div", null,
            [presentation, button]
        )
        return root
    }
})

export default counter