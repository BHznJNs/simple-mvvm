import { Component, el } from "../../../src/index.js"

function child({parent}) {
    const self = new Component({
        parent,
        render(self) {
            return el("p", {
                textContent: "Child text",
                onclick() {
                    self.emit("test-event", "test data1", "test data2")
                }
            })
        }
    })
    return self
}

export default child