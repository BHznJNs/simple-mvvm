import { Component } from "../../src/index.js"
import parent from "./components/parent.js"

const app = new Component({
    render() {
        return parent
    }
})

export default app