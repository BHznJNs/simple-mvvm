import { Component, el } from "../../../src/index.js"
import child from "./child.js"

const parent = new Component({
    name: "parent",
    data: {
        childContent: "Click to reverse"
    },
    methods: {
        contentReverse() {
            const reversedText =
                this.$d.childContent
                    .split("")
                    .reverse()
                    .join("")
            this.$d.childContent =
                reversedText
        }
    },
    render() {
        const self = this
        const childComponent = child({props: {
            content: self.$d.childContent
        }})
        this.setReactProps(childComponent, "childContent", "content")

        return el("div", {
                onclick: this.$m.contentReverse
            }, childComponent
        )
    }
})

export default parent