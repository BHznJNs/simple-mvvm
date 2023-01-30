import { Component, el } from "../../../src/index.js"

function child({ parent }) {
    return new Component({
        parent,
        name: "child",
        inject: ["text"],
        render() {
            return el("p", {
                textContent: this.$i.text
            })
        }
    })
}

export default child