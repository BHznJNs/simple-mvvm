const fragment = MvvmModule.fragment

describe("Fragment", () => {
    it("should be a function", () => {
        expect(fragment)
        .to.be.an("function")
    })

    it("should receive `null` and `undefined`", () => {
        const fNull = fragment(null)
        const fUndefined = fragment(undefined)

        expect(fNull instanceof DocumentFragment)
        .to.equal(true)
        expect(fUndefined instanceof DocumentFragment)
        .to.equal(true)
    })
})