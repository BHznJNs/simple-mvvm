import { Component, Iterator, staticEl } from "../../src/index.js"

const app = new Component({
    data: {
        presentData: ["aaa", "bbb", "ccc"],
        index: 0,
        content: "test content"
    },
    render(self) {
        const presentation = new Iterator({
            dataArray : this.$d.presentData.value,
            willChange: [ "textContent" ],
            render: (value) => {
                return staticEl("p", {
                    textContent: value
                })
            }
        })

        const contentInput = staticEl("input", {
            type: "text",
            value: "test content",
            onchange() {
                self.$d.content = this.value
            }
        })

        const numberInput = staticEl("input", {
            type: "number",
            value: 0,
            onchange() {
                self.$d.index = this.value
            }
        })

        const btnBlock = new Iterator({
            dataArray: [
                {
                    name: "Push",
                    callback: () => {
                        presentation.push(self.$d.content.value)
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
                        presentation.unshift(self.$d.content.value)
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
                        presentation.update(self.$d.index.value, self.$d.content.value)
                    }
                },
                {
                    name: "Insert",
                    callback: () => {
                        presentation.insert(self.$d.index.value, self.$d.content.value)
                    }
                },
                {
                    name: "Remove",
                    callback: () => {
                        presentation.remove(self.$d.index.value)
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
                return staticEl("button", {
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
                return staticEl(tagName, {
                    textContent: "Test content",
                    onclick: () => {
                        this.update(index, "h" + (index + 2))
                    }
                })
            }
        })

        const root = staticEl("div", null, [
            presentation, contentInput, numberInput,
            staticEl("div", null, btnBlock), tagNameTestIterator
        ])

        return root
    }
})

export default app