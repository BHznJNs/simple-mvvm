import { Component, Iterator, el } from "../../src/index.js"

const app = new Component({
    data: {
        presentData: ["aaa", "bbb", "ccc"],
        index: 0,
        content: "test content"
    },
    render(self) {
        const presentation = new Iterator({
            dataArray : this.$d.presentData,
            willChange: [ "textContent" ],
            render: (value) => {
                return el("p", {
                    textContent: value
                })
            }
        })

        const contentInput = el("input", {
            type: "text",
            value: "test content"
        })
        this.formBind(contentInput, "$d", "content")

        const numberInput = el("input", {
            type: "number",
            value: this.$d.index
        })
        this.formBind(numberInput, "$d", "index")

        const btnBlock = new Iterator({
            dataArray: [
                {
                    name: "Push",
                    callback: () => {
                        presentation.push(self.$d.content)
                    }
                },
                {
                    name: "Pop",
                    callback: () => {
                        presentation.pop()
                    }
                },
                {
                    name: "Unshift",
                    callback: () => {
                        presentation.unshift(self.$d.content)
                    }
                },
                {
                    name: "Shift",
                    callback: () => {
                        presentation.shift()
                    }
                },
                {
                    name: "Update",
                    callback: () => {
                        presentation.update(self.$d.index, self.$d.content)
                    }
                },
                {
                    name: "Insert",
                    callback: () => {
                        presentation.insert(self.$d.index, self.$d.content)
                    }
                },
                {
                    name: "Remove",
                    callback: () => {
                        presentation.remove(self.$d.index)
                    }
                },
                {
                    name: "ChangeList",
                    callback: () => {
                        const newDataArray = [
                            "new",
                            "data",
                            "new",
                            "data",
                            "new",
                            "data",
                        ]
                        presentation.resetWith(newDataArray)
                        self.$d.presentData = newDataArray
                    }
                },
            ],
            render({name, callback}) {
                return el("button", {
                    textContent: name,
                    onclick: callback
                })
            }
        })

        const tagNameTestArr = ["h1", "h2", "h3"]
        const tagNameTestIterator = new Iterator({
            dataArray: tagNameTestArr,
            willChange: "tagName",
            render(tagName, index) {
                return el(tagName, {
                    textContent: "Test content",
                    onclick: () => {
                        this.update(index, "h" + (index + 2))
                    }
                })
            }
        })

        const root = el("div", null, [
            presentation, contentInput, numberInput,
            el("div", null, btnBlock), tagNameTestIterator
        ])

        globalThis.app = self
        return root
    }
})

export default app