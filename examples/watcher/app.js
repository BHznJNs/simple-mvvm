import { Component } from "../../src/index.js"

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
    render(self) {
        const presentation = this.el("p", {
            textContent: this.$d.msg,
            onclick() {
                self.$d.msg = "changed"
            }
        })
        return presentation
    }
})

export default app