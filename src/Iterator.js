class Iterator extends DocumentFragment {
    #head = null
    #peak = null
    #baseNode = null
    #dataArrReference = null

    willChangeProps   = null
    defaultRenderFunc = null

    constructor({dataArray, willChange, render}) {
        super()

        this.willChangeProps   = willChange
        this.defaultRenderFunc = render.bind(this)
        this.#dataArrReference = dataArray
        this.#render()

        return this
    }
    #render() {
        function createBaseNode() {
            return document.createComment("[MVVM] Iterator Base Node")
        }
        let index = 0
        const dataArray = this.#dataArrReference
        const peakIndex = dataArray.length - 1

        const baseNode = createBaseNode()
        this.#baseNode = baseNode
        this.appendChild(baseNode)

        for (const item of dataArray) {
            const child = this.appendChild(this.defaultRenderFunc(item, index))

            if (!index) {
                this.#head = child
            }
            if (index === peakIndex) {
                this.#peak = child
            }
            index += 1
        }
    }

    // Add an element at the peak of the Iterator with
    // the given data.
    push(data) {
        const targetindex = this.#dataArrReference.length
        const addedNode = this.defaultRenderFunc(data, targetindex)
        const peak   = this.#peak || this.#baseNode
        const parent = this.#baseNode.parentNode

        parent.insertBefore(addedNode, peak.nextSibling)

        this.#peak = addedNode
        if (!this.#head) {
            this.#head = addedNode
        }

        return this.#dataArrReference.push(data)
    }
    // Remove an element at the peak of the Iterator.
    pop() {
        if (this.#peak) {
            const targetNode = this.#peak
            const parent = this.#baseNode.parentNode

            if (this.#head === this.#peak) {
                this.#head = null
                this.#peak = null
            } else {
                this.#peak = targetNode.previousSibling
            }

            parent.removeChild(targetNode)
        }
        return this.#dataArrReference.pop()
    }
    // Append an element at the head of the Iterator
    // with the given data.
    unshift(data) {
        const addedNode = this.defaultRenderFunc(data, 0)
        const head   = this.#head || this.#baseNode.nextSibling
        const parent = this.#baseNode.parentNode

        parent.insertBefore(addedNode, head)
        this.#head = addedNode
        if (!this.#peak) {
            this.#peak = addedNode
        }

        return this.#dataArrReference.unshift(data)
    }
    // Remove an element at the head of the Iterator.
    shift() {
        if (this.#head) {
            const targetNode = this.#head
            const parent = this.#baseNode.parentNode

            if (this.#head === this.#peak) {
                this.#head = null
                this.#peak = null
            } else {
                this.#head = targetNode.nextSibling
            }

            parent.removeChild(targetNode)
        }
        return this.#dataArrReference.shift()
    }
    // Update an element at the given index
    // with the given data.
    update(index, data) {
        if (index >= this.#dataArrReference.length || index < 0) {
            throw new Error(`[MVVM] Error: invalid insert index: \`${index}\`.`)
        }

        const willChange = this.willChangeProps
        function diff(newNode, targetNode) {
            if (newNode.tagName !== targetNode.tagName) {
                this.remove(index)
                this.insert(index, data)
            } else {
                for (const key of willChange) {
                    if (key in newNode) {
                        if (targetNode[key] !== newNode[key]) {
                            targetNode[key]  =  newNode[key]
                        }
                    } else {
                        const targetNodeAttr = targetNode.getAttribute(key)
                        const newNodeAttr    = newNode.getAttribute(key)
                        if (targetNodeAttr !== newNodeAttr) {
                            targetNodeAttr.setAttribute(key, newNodeAttr)
                        }
                    }
                }
            }
        }

        if (willChange) {
            let targetNode = this.#head
            for (let i=0; i<index; i++) {
                targetNode = targetNode.nextSibling
            }

            const newNode = this.defaultRenderFunc(data, index)
            diff.call(this, newNode, targetNode)
            this.#dataArrReference[index] = data
        }
    }
    // Insert an element with the given data
    // at the given place.
    insert(index, data) {
        if (index > this.#dataArrReference.length || index < 0) {
            throw new Error(`[MVVM] Error: invalid insert index: \`${index}\`.`)
        }

        if (index == 0) {
            // Insert the first item equals to `unshift()`.
            return this.unshift(data)
        } else if (index == this.#dataArrReference.length) {
            // Insert the last item equals to `push()`.
            return this.push(data)
        } else {
            // Insert the item into the middle need to
            // through its parent.
            const parent = this.#baseNode.parentNode
            const addedNode = this.defaultRenderFunc(data, index)

            let targetNode = this.#head
            for (let i=0; i<index; i++) {
                targetNode = targetNode.nextSibling
            }
            
            parent.insertBefore(addedNode, targetNode)
            return this.#dataArrReference.splice(index, 0, data)
        }
    }
    // Insert an element at the given place.
    remove(index) {
        if (index >= this.#dataArrReference.length || index < 0) {
            if (!index && !this.#dataArrReference.length) {
                return
            }
            throw new Error(`[MVVM] Error: invalid insert index: \`${index}\`.`)
        }
        if (index == 0) {
            // Remove the first item equals to `shift()`.
            return this.shift()
        } else if (index == this.#dataArrReference.length - 1) {
            // Remove the last item equals to `pop()`.
            return this.pop()
        } else {
            // Remove one of the middle item
            // need to through its parent.
            const parent = this.#baseNode.parentNode
            
            let targetNode = this.#head
            if (index === 0) {
                this.#head = this.#head.nextSibling
            } else {
                for (let i=0; i<index; i++) {
                    targetNode = targetNode.nextSibling
                }
            }
            
            parent.removeChild(targetNode)
            return this.#dataArrReference.splice(index, 1)
        }
    }
    // Update data with a new given dataArray.
    resetWith(newDataArray) {
        function pushWith(fragment) {
            if (fragment) {
                const peak   = this.#peak || this.#baseNode
                const parent = this.#baseNode.parentNode

                parent.insertBefore(fragment, peak.nextSibling)

                this.#peak = addedNode.lastChild
                if (!this.#head) {
                    this.#head = addedNode.firstChild
                }
            }
        }

        const oldDataArray = this.#dataArrReference
        let tempFragment   = null
        for (let index in newDataArray) {
            if (oldDataArray[index]) {
                this.update(index, newDataArray[index])
            } else {
                // If newDataArray.length > oldDataArray.length
                // this.push(newDataArray[index])
                if (!tempFragment) {
                    tempFragment = new DocumentFragment()
                }
                const renderData = newDataArray[index]
                tempFragment.appendChild(this.defaultRenderFunc(renderData))
            }
        }
        pushWith.call(this, tempFragment)

        const lenDiff = newDataArray.length - this.#dataArrReference.length
        if (lenDiff < 0) {
            for (let i=0; i< -lenDiff; i++) {
                this.pop()
            }
        }

        this.#dataArrReference = newDataArray
        return this
    }
}

export default Iterator