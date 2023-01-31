const proxyTemplate = {
    set(target, key, value) {
        const bindedMethods = target.__eventMap.get(key)
        if (bindedMethods) {
            for (const method of bindedMethods) {
                const newVal = value
                const oldVal = Reflect.get(target, key)
                method(newVal, oldVal)
            }
            Reflect.set(target, key, value)
            return true
        } else if (key in target) {
            // This branch is used when key is not binded but
            // the user want to modify it.
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

/**
 * Component options properties:
 * name    : String
 * parent  : Component
 * data    : Object -> this.$d
 * props   : Array
 * methods : Object
 * mixins  : Array -> Object.assign
 * provide : Function
 * inject  : Array
 * render  : Function
 */

/**
 * ------------------------------------
 */

class Component extends DocumentFragment {
    // data object
    #$data = null
    $data  = null
    $d     = null
    
    // properties object
    #$props   = null
    $props    = null
    $p        = null
    propsKeys = null

    // methods  |  alias
    $methods = {}; $m = this.$methods
    // inject   |  alias
    $inject  = {}; $i = this.$inject

    // --- --- ---

    $parent    = null
    $propsKeys = null

    #eventMap = new Map()
    __provide = null

    constructor(options) {
        super()

        this.parent = options.parent

        this.#data_propsLoad(options)
        this.#methodsLoad(options.methods)
        this.#watcherLoad(options.watch)
        this.#provideLoad(options.provide)
        this.#injectsLoad(options.inject)

        // Load render function
        const renderEl = options.render.call(this, this)
        // Set component name attribute
        if (options.name && renderEl instanceof HTMLElement) {
            renderEl.setAttribute("name", options.name)
        }
        this.appendChild(renderEl)

        return this
    }

    /**
     * Resource load methods start
     */
    #data_propsLoad({ data, props }) {
        if (data) {
            this.#$data = { __eventMap: new Map() }
            this.$data  = new Proxy(this.#$data, proxyTemplate)
            this.$d     = this.$data // alias

            Object.assign(this.#$data, data)
        }
        if (props) {
            this.#$props = { __eventMap: new Map() }
            this.$props  = new Proxy(this.#$props, proxyTemplate)
            this.$p      = this.$props // alias

            this.propsKeys = props
        }
    }
    #methodsLoad(methods) {
        for (let name in methods) {
            this.$m[name] = methods[name].bind(this)
        }
    }
    #watcherLoad(watchers) {
        if (watchers) {
            const keys = Object.keys(watchers)

            // Default to watch data under the $data
            if (watchers[keys[0]] instanceof Function) {
                for (const key of keys) {
                    this.#bind("$d", key, (newVal, oldVal) => {
                       watchers[key](newVal, oldVal)
                    })
                }
            } else {
                for (const key of keys) {
                    this.#watcherLoad(watchers[key])
                }
            }
        }
    }
    #provideLoad(providers) {
        if (providers) {
            this.__provide = providers()
        }
    }
    #injectsLoad(injects) {
        const self = this
        function provideFinder(ctx, key) {
            // Start with this.parent
            if (ctx.__provide && key in ctx.__provide) {
                self.$i[key] = ctx.__provide[key]
            } else if (!ctx.__provide && ctx.parent) {
                provideFinder(ctx.parent, key)
            } else {
                console.warn(`[MVVM] Warning: injected value "${key}" is not provided.`)
            }
        }

        if (injects) {
            for (const item of injects) {
                provideFinder(self.parent, item)
            }
        }
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
        this.#bind(from, componentKey, (newVal) => {
            el[elProp] = newVal
        })
    }

    attrBind(el, from, componentKey, elAttr) {
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

    /**
     * Props processing methods start
     */
    setReactProps(child, selfKey, childKey) {
        this.#bind("$d", selfKey, (newVal) => {
            child.$p[childKey] = newVal
        })
    }

    receiveProps(props) {
        for (const key of this.propsKeys) {
            if (key in props) {
                Reflect.set(this.#$props, key, props[key])
            }
        }
    }
    /**
     * Props processing methods end
     */

    /**
     * Component event handles start
     */
    __trigger(eventName, dataArr) {
        const eventMap = this.#eventMap
        const targetEvent = eventMap.get(eventName)

        if (targetEvent) {
            dataArr.push(this)

            for (const handler of targetEvent) {
                handler(this, dataArr)
            }
        } else {
            throw new Error(`[MVVM] Error: component event "${eventName}" is not defined.`)
        }
    }
    setEvent(eventName, eventHandler) {
        const eventMap = this.#eventMap
        const target = eventMap.get(eventName)
        if (!target) {
            eventMap.set(eventName, [])
        }
        eventMap.get(eventName).push(eventHandler)
    }
    emit(eventName, ...data) {
        this.parent.__trigger(eventName, data)
    }
    /**
     * Component event handles end
     */
}

export default Component