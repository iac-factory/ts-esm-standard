function * initialize(_: Iterable<number>, initial = 0) {
    let $;

    $ = initial;

    for ( const i of _ ) yield [ $++, i ];
}

const Enumeration = (array: Iterable<number>) => {
    const Mapping = {};

    for ( const [ i, idx ] of initialize( array ) ) {
        /// @ts-ignore
        Mapping[ i ] = idx;
    }

    return Mapping;
};

export { Enumeration };

export default {
    Enumeration
};
