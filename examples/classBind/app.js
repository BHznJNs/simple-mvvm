import { Component, el } from "../../src/index.js"

const app = new Component({
    data: {
        isContentRed: false
    },
    render() {
        const root = el("p", {
            textContent: "Click to change color!",
            onclick: () => {
                this.$d.isContentRed = !this.$d.isContentRed
            }
        })
        this.classBind(root, "$d", "isContentRed", "red")
        return root
    }
})

export default app