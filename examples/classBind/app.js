import { Component } from "../../src/index.js"

const app = new Component({
    data: {
        isContentRed: false
    },
    render() {
        const root = this.el("p", {
            textContent: "Click to change color!",
            onclick: () => {
                this.$d.isContentRed = !this.$d.isContentRed.value
            },
            class: {
                red: this.$d.isContentRed
            }
        })
        return root
    }
})

export default app