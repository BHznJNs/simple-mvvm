export default function updateTemplateFactory(name, self, eventMap) {
    return function(key, value) {
        const bindedMethods = eventMap.get(name + key)
        if (bindedMethods) {
            for (const method of bindedMethods) {
                const newVal = value
                const oldVal = Reflect.get(self, key)
                method(newVal, oldVal)
            }
            Reflect.set(self, key, value)
            return true
        } else if (key in self) {
            // This branch is used when key is not binded but
            // the user want to modify it.
            Reflect.set(self, key, value)
            return true
        }  else {
            throw new Error(`[MVVM] Error: component property "${key}" is not defined.`)
        }
    }    
}