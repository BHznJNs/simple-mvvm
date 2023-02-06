import updateTemplateFactory from "../utils/updateTemplateFactory.js"
import proxyTemplateFactory from "../utils/proxyTemplateFactory.js"

/**
 * --- --- --- --- --- ---
 */

class Component {
    // data object
    #data = null
    $data = null
    $d    = null
    
    // properties object
    #props   = null
    $props   = null
    $p       = null
    propKeys = null

    // computeds functions
    #computed = null
    $computed = null
    $c        = null

    // methods  |  alias
    $methods = {}; $m = this.$methods
    // inject   |  alias
    $inject  = {}; $i = this.$inject

    // --- --- ---

    $parent   = null
    $propKeys = null

    #eventMap = new Map()
    __provide = null

    constructor({
        data, props,
        methods, computed, watch,
        provide, inject,
        name, parent, render
    }) {
        this.$parent = parent

        this.#dataLoad(data)
        this.#propsLoad(props)
        this.#methodsLoad(methods)
        this.#computedsLoad(computed)
        this.#watchersLoad(watch)
        this.#provideLoad(provide)
        this.#injectsLoad(inject)

        // Load render function
        const renderEl = render.call(this, this)
        // Set component name attribute
        if (name && renderEl instanceof HTMLElement) {
            renderEl.setAttribute("name", name)
        }

        return renderEl
    }

    /**
     * Options load methods start
     */
    #dataLoad(data) {
        if (data) {
            this.#data = {}
            this.$data = new Proxy(this.#data, proxyTemplateFactory("$d", this.#eventMap))
            this.$d    = this.$data // alias

            Object.assign(this.#data, data)
        }
    }
    #propsLoad(props) {
        if (props) {
            const propsObj = this.#props = {}
            propsObj.__update =
                updateTemplateFactory("$p", propsObj, this.#eventMap)

            this.$props = new Proxy(this.#props, proxyTemplateFactory("$p", this.#eventMap))
            this.$p     = this.$props // alias

            this.propKeys = props
        }
    }
    #methodsLoad(methods) {
        for (let name in methods) {
            this.$m[name] = methods[name].bind(this)
        }
    }
    #computedsLoad(computed) {
        if (computed) {
            const computedMap = computed.call(this, this)
            const computedObj = this.#computed = {}
            computedObj.__update =
                updateTemplateFactory("$c", computedObj, this.#eventMap)

            for (let key in computedMap) {
                const { depends, callback } = computedMap[key]

                if (!(callback instanceof Function)) {
                    throw new Error(`[MVVM] Error: computed property "${key}" is not a function.`)
                }

                const values = {}
                const currentValFunc = callback.bind(this) // () => callback.apply(this, values)
                for (const dependency of depends) {
                    const { keyFrom, keyName, value } = dependency
                    const updateFunc = this.#computed.__update
                    values[keyName] = value
                    this.#bind(keyFrom, keyName, (newVal) => {
                        values[keyName] = newVal
                        updateFunc(key, currentValFunc(values))
                    })
                }
                Reflect.set(this.#computed, key, currentValFunc(values))
            }

            this.$computed = new Proxy(this.#computed, proxyTemplateFactory("$c", this.#eventMap))
            this.$c        = this.$computed // alias
        }
    }
    #watchersLoad(watchers, from) {
        if (watchers) {
            from = from || "$d"
            const keys = Object.keys(watchers)

            // If first item is a Function,
            // default to watch data under the $data
            if (watchers[keys[0]] instanceof Function) {
                for (const key of keys) {
                    this.#bind(from, key, (newVal, oldVal) => {
                       watchers[key](newVal, oldVal)
                    })
                }
            } else {
                // else to watch data under the $data or $props
                for (const key of keys) {
                    this.#watchersLoad(watchers[key])
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
     * Options load methods end
     */


    // Create element
    el(tagName, options, children) {
        function assignProperties(el, options) {
            for (let key in options) {
                const current = options[key]
                let value

                if (current.__is_ref__) {
                    value = current.value
                    this.#bind(current.keyFrom, current.keyName, (newVal) => {
                        el[key] = newVal
                    })
                } else {
                    value = current
                }
                el[key] = value
            }
        }
        function assignAttributes(el, attrs) {
            if (attrs) {
                for (let key in attrs) {
                    const current = attrs[key]

                    if (current.__is_ref__) {
                        this.#bind(current.keyFrom, current.keyName, (newVal) => {
                            el.setAttribute(key, newVal)
                        })
                        el.setAttribute(key, current.value)
                    } else {
                        el.setAttribute(key, current)
                    }
                }
            }
        }
        function assignClasses(el, classes) {
            if (classes) {
                for (let key in classes) {
                    const current = classes[key]

                    if (current.__is_ref__) {
                        this.#bind(current.keyFrom, current.keyName, (newVal) => {
                            el.classList.toggle(key, newVal)
                        })
                        el.classList.toggle(key, current.value)
                    } else {
                        el.classList.toggle(key, current)
                    }
                }
            }
        }

        const el = document.createElement(tagName)
        if (options) {
            const { attr, class: __class } = options
            assignAttributes.call(this, el, attr)
            assignClasses.call(this, el, __class)
            Reflect.deleteProperty(options, "attr")
            Reflect.deleteProperty(options, "class")
            assignProperties.call(this, el, options)
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

    /**
     * Push bindCallbacks into the eventMap
     * to bind data with the view.
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

    /**
     * Props processing methods start
     */
    setReactProps(child, selfKey, childKey) {
        const updateFunc = child.$p.__update.value
        this.#bind("$d", selfKey, (newVal) => {
            updateFunc(childKey, newVal)
        })
    }

    receiveProps(props) {
        for (const key of this.propKeys) {
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
                handler.apply(null, dataArr)
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
        this.$parent.__trigger(eventName, data)
    }
    /**
     * Component event handles end
     */
}

export default Component