import { Component, el } from "../../../src/index.js"
import child from "./child.js"

function parent({ parent }) {
    return new Component({
        parent,
        name: "parent",
        render(self) {
            return el(
                "div", null,
                child({
                    parent: self
                })
            )
        }
    })
}

export default parent