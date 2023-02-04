import { Component, fragment, text } from "../../../src/index.js"
import child from "./child.js"

const parent = new Component({
    render(self) {
        return fragment([
            text("Parent text"),
            child({
                parent: self
            })
        ])
    }
})
parent.setEvent("test-event", (data1, data2, self) => {
    console.log("\"test-event\" is emited with following data:")
    console.log(data1, data2)
    console.log("self === parent: ", self === parent)
})

export default parent