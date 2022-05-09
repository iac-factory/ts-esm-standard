import Utility from "util";

/***
 * Inspection Serialization for Standard-Output
 * ---
 *
 * @param {string} input - The Context or Handler response awaitable
 *
 * @constructor
 *
 */

const Inspect = async (input: string) => {
    try {
        return Utility.inspect( JSON.parse( input ), { showProxy: true, showHidden: true, colors: true } );
    } catch ( error ) {
        return Utility.inspect( input, { showProxy: true, showHidden: true, colors: true } );
    }
};

export { Inspect };
export default Inspect;