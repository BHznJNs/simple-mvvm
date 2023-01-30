import { Component } from "../../src/index.js"
import parent from "./components/parent.js"

const app = new Component({
    name: "app",
    provide() {
        return {
            text: "test content"
        }
    },
    render(self) {
        return parent({
            parent: self
        })
    }
})

export default app