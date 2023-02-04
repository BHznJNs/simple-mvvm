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
    #data = null
    $data = null
    $d    = null
    
    // properties object
    #props    = null
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

    #proxyTemplateFactory(name) {
        const self = this

        return {
            set(target, key, value) {
                const bindedMethods = self.#eventMap.get(name + key)
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
                return {
                    key, from: name,
                    __is_ref__: true,
                    value: Reflect.get(target, key)
                }
            }
        }
    }

    /**
     * Resource load methods start
     */
    #data_propsLoad({ data, props }) {
        if (data) {
            this.#data = {}
            this.$data = new Proxy(this.#data, this.#proxyTemplateFactory("$d"))
            this.$d    = this.$data // alias

            Object.assign(this.#data, data)
        }
        if (props) {
            this.#props = {}
            this.$props = new Proxy(this.#props, this.#proxyTemplateFactory("$p"))
            this.$p     = this.$props // alias

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
        const eventKey = from + key
        const eventMap = this.#eventMap
        const target = eventMap.get(eventKey)
        if (!target) {
            eventMap.set(eventKey, [])
        }
        eventMap.get(eventKey).push(bindCallback)
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
                Reflect.set(this.#props, key, props[key])
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

    el(tagName, options, children) {
        function assignProperties(el, options) {
            for (let key in options) {
                const current = options[key]

                let value

                if (current.__is_ref__) {
                    value = current.value

                    // this.propBind(el, current.from, current.key, key)
                    this.#bind(current.from, current.key, (newVal) => {
                        el[key] = newVal
                    })
                } else {
                    value = current
                }

                el[key] = value
            }
        }

        const el = document.createElement(tagName)

        if (options) {
            const attr = options.attr
            if (attr) {
                for (let key in attr) {
                    el.setAttribute(key, attr[key])
                }
                Reflect.deleteProperty(options, "attr")
            }

            assignProperties.call(this, el, options)
            // Object.assign(el, options)
        }
    
        if (children) {
            // Check is `children` an Array or single Element
            if (children instanceof Array) {
                for (const childEl of children) {
                    el.appendChild(childEl)
                }
            } else {
                el.appendChild(children)
            }
        }

        return el
    }
}

export default Component