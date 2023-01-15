import { Component, el } from "../../../src/index.js"

function child(props) {
    const self = new Component({
        name: "child",
        props: ["content"],
        render() {
            const root = el("p", {
                textContent: props.content
            })
            this.propBind(root, "$p", "content", "textContent")
            return root
        }
    })
    self.receiveProps(props)
    return self
}

export default child