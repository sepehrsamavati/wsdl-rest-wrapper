// @ts-check
/**
 * @typedef {import("../types/genericType").SimpleTypeProperties} SimpleTypeProperties
 * @typedef {import("../types/genericType").ComplexTypeProperties} ComplexTypeProperties
*/
export class SimpleType {
    constructor(/** @type {SimpleTypeProperties} */ props) {
        this.props = props;
    }
    get name(){
        return this.props.name;
    }
    setValue(/** @type {unknown} */ value) {
        this.type = typeof value;
        this.value = value;
        return this;
    }
    validateRestriction() {
        if (this.props.required && this.value === undefined) return false;
        return true;
    };
}
export class ComplexType {
    constructor(/** @type {ComplexTypeProperties} */ props) {
        this.props = props;
    }
    get name(){
        return this.props.name;
    }
    validateRestriction() {
        for (const value of Object.values(this.props.value)) {
            if (!value.validateRestriction()) return false;
        }
        return true;
    };
}