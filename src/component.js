/**
 * Component options properties:
 * name: String
 * data: Object -> this.$d
 * props: Array
 * methods: Object
 * mixins: Array -> Object.assign
 * render: Function
 */

const proxyTemplate = {
    set(target, key, value) {
        const bindedMethods = target.__eventMap.get(key)
        if (bindedMethods) {
            for (const method of bindedMethods) {
                method(value)
            }
            Reflect.set(target, key, value)
            return true
        } else {
            throw new Error(`[MVVM] Error: component property "${key}" is not defined.`)
        }
    },
    get(target, key) {
        return Reflect.get(target, key)
    }
}

/**
 * ------------------------------------
 */

class Component extends DocumentFragment {
    #$d = { // $data
        __eventMap: new Map()
    }
    #$p = { // $props
        __eventMap: new Map()
    }
    $m = {}

    constructor(options) {
        super()

        this.$data = new Proxy(this.#$d, proxyTemplate)
        this.$d = this.$data
        this.$props = new Proxy(this.#$p, proxyTemplate)
        this.$p = this.$props

        Object.assign(this.#$d, options.data)
        this.propsKeys = options.props
        this.#methodsLoad(options.methods)

        // Load render function
        const renderEl = options.render.bind(this)()
        // Set component name attribute
        if (options.name) {
            renderEl.setAttribute("name", options.name)
        }
        this.appendChild(renderEl)

        return this
    }

    /**
     * Resource load methods start 
     */
    #methodsLoad(methods) {
        for (let name in methods) {
            this.$m[name] = methods[name].bind(this)
        }
    }
    #mixinsLoad(mixins) {
        // 
    }
    /**
     * Resource load methods end 
     */

    /**
     * Bind methods start
     */
    #bind(from, key, bindCallback) {
        const eventMap = this[from].__eventMap
        const target = eventMap.get(key)
        if (!target) {
            eventMap.set(key, [])
        }
        eventMap.get(key).push(bindCallback)
    }

    propBind(el, from, componentKey, elProp) {
        // Before bind property, update the value
        // of property of the element
        // el[elProp] = this[from][componentKey]
        this.#bind(from, componentKey, (newVal) => {
            el[elProp] = newVal
        })
    }

    attrBind(el, from, componentKey, elAttr) {
        // Before bind attribute, update the value
        // of attribute of the element
        el.setAttribute(elAttr, this[from][componentKey])
        this.#bind(from, componentKey, (newVal) => {
            el.setAttribute(elAttr, newVal)
        })
    }

    classBind(el, from, key, className) {
        this.#bind(from, key, (newVal) => {
            el.classList.toggle(className, Boolean(newVal))
        })
    }

    formBind(el, from, componentKey) {
        const selfData = this[from]
        el.addEventListener("change", () => {
            const newVal = el.value
            Reflect.set(selfData, componentKey, newVal)
        })
    }
    /**
     * Bind methods end
     */

    setReactProps(child, selfKey, childKey) {
        this.#bind("$d", selfKey, (newVal) => {
            console.log(child)
            child.$p[childKey] = newVal
        })
    }

    receiveProps(props) {
        for (const key of this.propsKeys) {
            if (key in props) {
                Reflect.set(this.#$p, key, props[key])
            }
        }
    }
}

export default Component