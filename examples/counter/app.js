import { Component, el } from "../../src/index.js"
import counter from "./components/counter.js"

const app = new Component({
    render() {
        const root = el(
            "div", null,
            counter.target
        )
        return root
    }
})

export default app