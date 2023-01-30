import { Component, el } from "../../src/index.js"

const component1 = new Component({
    render() {
        return el("div", {
            textContent: "Component 1"
        })
    }
})
const component2 = new Component({
    render() {
        return el("div", {
            textContent: "Component 2"
        })
    }
})


const app = new Component({
    data: {
        showing: false
    },
    render() {
        if (this.$d.showing) {
            return component1
        } else {
            return component2
        }
    }
})

export default app