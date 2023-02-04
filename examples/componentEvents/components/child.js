import { Component, staticEl } from "../../../src/index.js"

function child({ parent }) {
    const self = new Component({
        parent,
        render(self) {
            return staticEl("p", {
                textContent: "Child text, click me to emit",
                onclick() {
                    self.emit("test-event", "test data1", "test data2")
                }
            })
        }
    })
    return self
}

export default child