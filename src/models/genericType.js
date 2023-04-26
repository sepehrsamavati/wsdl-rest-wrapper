// @ts-check
/**
 * @typedef {import("../types/genericType").TypeNameSimple} TypeNameSimple
 * @typedef {import("../types/genericType").TypeNameComplex} TypeNameComplex
 * @typedef {import("../types/genericType").SimpleTypeProperties} SimpleTypeProperties
 * @typedef {import("../types/genericType").ComplexTypeProperties} ComplexTypeProperties
*/
export class SimpleType {
    /**
     * @param {TypeNameSimple} value
     * @param {SimpleTypeProperties} props
    */
    constructor(value, props) {
        this.type = typeof value;
        this.value = value;
        this.props = props;
    }
    validateRestriction() {
        if (this.props.restriction.required && this.props.value === undefined) return false;
        return true;
    };
}
export class ComplexType {
    /**
     * @param {TypeNameComplex} type
     * @param {ComplexTypeProperties} props
    */
    constructor(type, props) {
        this.type = type;
        this.props = props;
    }
    validateRestriction() {
        for (const value of Object.values(this.props.value)) {
            if (!value.validateRestriction()) return false;
        }
        return true;
    };
}