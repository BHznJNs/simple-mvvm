class ValueDetail {
    __is_ref__ = true

    keyFrom = null
    keyName = null
    value   = null

    constructor(from, name, value) {
        this.keyFrom = from
        this.keyName = name
        this.value   = value
    }

    valueOf() {
        return value
    }
}

export default function proxyTemplateFactory(name, eventMap) {
    let setter = null
    if (name === "$d") {
        setter = function(target, key, value) {
            const bindedMethods = eventMap.get(name + key)
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
        }
    } else {
        setter = function(target, key) {
            console.warn(`[MVVM] Warning: component property "${key}" from ${name} should not be modified.`)
        }
    }
    return {
        set: setter,
        get(target, key) {
            const currentVal = Reflect.get(target, key)
            return new ValueDetail(name, key, currentVal)
        }
    }
}