import { Component, staticEl } from "../../../src/index.js"
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
                    .value
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
            content: self.$d.childContent.value
        }})
        this.setReactProps(childComponent, "childContent", "content")

        return staticEl("div", {
            onclick: this.$m.contentReverse
        }, childComponent)
    }
})

export default parent