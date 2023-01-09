/**
 * Component options properties:
 * data: Object -> this.$
 * props: Array
 * mixins: Array -> Object.assign
 * render: Function
 */

/**
 * ------------------------------------
 */

class Component extends DocumentFragment {
    $ = {}
    target = null

    constructor(options) {
        super()

        Object.assign(this.$, options.data)

        // Load render function
        const renderEl = options.render(this)
        this.target = renderEl

        return this
    }

    bind(el, componentKey, elKey) {
        // Check is key exists
        if (!(componentKey in this.$)) {
            throw new Error(`Key ${componentKey} is not defined in this component.`)
        }
        if (!(elKey in el)) {
            throw new Error(`Attribute ${elKey} is not found in this element.`)
        }

        // Define inside key start with `__`
        const insideComponentKey = "__" + componentKey

        // Sync value to the target element
        el[elKey] = this.$[componentKey]
        this.$[insideComponentKey] = this.$[componentKey]

        Object.defineProperty(this.$, componentKey, {
            set(newVal) {
                this[insideComponentKey] = newVal
                el[elKey] = newVal
            },
            get() {
                return this[insideComponentKey]
            }
        })
    }
}

export default Component