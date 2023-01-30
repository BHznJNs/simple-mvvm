import { Component, el } from "../../src/index.js"

const app = new Component({
    data: {
        msg: "some text"
    },
    watch: {
        $data: {
            msg(newVal, oldVal) {
                console.log(newVal, oldVal)
            }
        }
    },
    render() {
        const self = this
        const presentation = el("p", {
            textContent: self.$data.msg,
            onclick() {
                self.$data.msg = "changed"
            }
        })
        this.propBind(presentation, "$d", "msg", "textContent")
        return presentation
    }
})

export default app