import { Component } from "../../../src/index.js"

function child({ props }) {
    const self = new Component({
        name: "child",
        props: ["content"],
        render() {
            this.receiveProps(props)
            const root = this.el("p", {
                textContent: this.$p.content
            })
            return root
        }
    })
    return self
}

export default child