import { Component, fragment, staticEl } from "../../src/index.js"

const app = new Component({
    data: {
        index: 0
    },
    computed(self) {
        return {
            text: {
                depends: [self.$d.index],
                callback({ index }) {
                    const now = Date.now()
                    return `${index}--${now}`
                }
            }
        }
    },
    render(self) {
        const presentation = this.el("h1", {
            textContent: this.$c.text
        })
        const input = staticEl("input", {
            type: "number",
            value: 0,
            onchange() {
                self.$d.index = this.value
            }
        })
        return fragment([
            presentation, input
        ])
    }
})

export default app