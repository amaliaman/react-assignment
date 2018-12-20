class JsUtils {
    /** Sort alphabetically */
    sortStrings = (x, y) => {
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    };
}

const jsUtils = new JsUtils();
export default jsUtils;