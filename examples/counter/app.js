import { Component } from "../../src/index.js"
import counter from "./components/counter.js"

const app = new Component({
    render() {
        return counter
    }
})

export default app