import { Component } from "../../src/index.js"
import parent from "./components/parent.js"

const app = new Component({
    name: "app",
    provide() {
        return {
            text: "test content provided from app"
        }
    },
    render(self) {
        return parent({
            parent: self
        })
    }
})

export default app