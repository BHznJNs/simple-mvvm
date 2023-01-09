export default class Mixin {
    constructor({
        data, methods
    }) {
        this.data = data
        this.methods = methods
        return this
    }
}
