/**
 * @template ObjType
 * @param{ObjType} object
 * @param{keyof ObjType} key
 * @param{boolean} create
 */
export default (object, key, create = false) => {
    if(object[key] === undefined && create) {
        object[key] = [];
    }
    if(object[key] && !Array.isArray(object[key]))
        object[key] = [object[key]];
}