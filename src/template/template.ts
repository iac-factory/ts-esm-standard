import FS from "fs";
import Path from "path";
import Utility from "util";
import Process from "process";

import * as Colors from "ansi-colors";

interface Expression {
    pattern: string;
    replacement: string;
}

type Expressions = Expression[];

class Template {
    public source: string;
    public target: string;

    public readonly debug: boolean;

    public pattern?: string;
    public replacement?: string;

    private buffer?: string | null;
    private colorize?: string | null;
    private template?: string | null;

    private static readonly items = (content: string) => {
        const data: RegExpMatchArray[] = [];

        const expression = RegExp( "{{(.(" + "\\w+" + ").)}}", "gm" );

        const result = content.matchAll(expression);

        // Either interface `Symbol.iterator`, or create
        // a `Generator` function (`*` & `yield` syntax)
        for (const iteration of result[Symbol.iterator]()) {
            data.push(iteration);
        }

        if ( result && data ) return data;

        return null;
    };

    private static readonly keys = (match: string) => {
        return RegExp( "{{(.(" + match + ").)}}", "gm" );
    };

    /***
     * Read File Contents
     *
     * @param {string} file
     * @returns {Promise<string>}
     */
    private static read = async (file: string) => {
        const $ = Utility.promisify( FS.readFile );
        const buffer = await $( file );
        return String( buffer ).valueOf();
    };

    public constructor(source: string, target: string, debug?: boolean) {
        const initial = process.env[ "INIT_CWD" ];

        this.source = ( Path.isAbsolute( source ) ) ? source : Path.join( __dirname, "static", source );
        this.target = ( Path.isAbsolute( target ) ) ? target : Path.join( ( initial ) ? initial : process.cwd(), target );

        this.debug = ( debug ) ? debug : false;
    }

    /***
     * Inject User-Input Literals
     *
     * @param {Expressions} expressions
     * @returns {Promise<void>}
     */
    public async inject(expressions?: Expressions): Promise<string> {
        this.buffer = ( await Template.read( this.source ) );

        const total = ( expressions ) ? expressions.length : 0;
        const matches = Template.items( this.buffer );

        this.validate(total, expressions, matches);

        let counter = 0;
        for await ( const expression of expressions! ) {
            counter += 1;

            // Pattern := Key
            this.pattern = expression.pattern;
            // Replacement := Value
            this.replacement = expression.replacement;

            const contents = this.buffer as string;
            const match = Template.keys( this.pattern ).exec( contents ) as RegExpExecArray;

            const raw = match[ 0 ]!;

            if ( match && this.pattern && this.replacement ) {
                const leading = Colors.bold.yellow( raw.substring( 0, 2 ) );
                const trailing = Colors.bold.yellow( raw.substring( raw.length - 2, match[ 0 ]!.length ) );
                const variable = Colors.bold.yellow( raw.substring( 2, raw.length - ( 2 ) ).trim() );

                const preface = this.buffer.replaceAll( raw, leading + " " + variable + " " + trailing );

                /// Only for Debugging Purposes - complexity can be functionally disregarded
                ( this.debug ) && Process.stdout.write( Colors.bold( "  — " ) + "Pre-Hydration" + " " + "(" + ( counter ) + "/" + total + ")" + ":" + Colors.gray( preface.split( "\n" ).map( ($, index) => ( index ) !== 0 && "  " + $ || " " + $ ).join( "\n" ) + "\n" ) );

                this.colorize = contents.replaceAll( match[ 0 ]!, Colors.bold.underline( Colors.green( this.replacement ) ) );
                this.template = contents.replaceAll( match[ 0 ]!, this.replacement );

                /// Only for Debugging Purposes - complexity can be functionally disregarded
                ( this.debug ) && Process.stdout.write( Colors.bold( "  — " ) + "Hydration" + " " + "(" + ( counter ) + "/" + total + ")" + ":" + " " + Colors.gray( this.colorize.split( "\n" ).map( ($, index) => ( index ) !== 0 && "  " + $ || " " + $ ).join( "\n" ) ) + "\n" );

                this.buffer = Buffer.from( this.template! ).toString( "utf-8" );
            }
        }

        FS.writeFileSync( this.target, String( this.buffer ) );

        return this.buffer as string;
    }

    /***
     * Client Input Validation
     * ---
     *
     * @param {number} total
     * @param {Expressions} expressions
     * @param {RegExpMatchArray[] | null} matches
     *
     * @private
     */
    private validate (total: number, expressions?: Expressions, matches?: RegExpMatchArray[] | null) {
        if ( total !== ((matches) ? matches.length : null) ) {
            const content = {
                "message": "Invalid Number of Interfaced Expression(s)" + " " + "(" + total + "/" + matches!.length + ")",
                "user-input": (expressions) ? expressions.map(($) => $.pattern) : null,
                "expectation": (matches) ? matches.map(($) => $[2]): null
            };

            const exception = JSON.stringify(content, null, 4);

            throw new Error(exception);
        } else if (expressions && matches) {
            const client = expressions.map(($) => $.pattern);
            const template = matches.map(($) => $[2]);

            /**
             * Not the fastest in the world, but the following conditional is a good mix of both readability
             * and performance. It's also the absolute perfect use-case (finally) for a reducer.
             *
             * - Note that the first argument, `valid`, really isn't a conditional validating the callback;
             *   rather, it's an `accumulator`
             *
             * - Read {@link Array.prototype.reduce} for additional details
             */
            if (!client.reduce((valid, comparator) => valid && template.includes(comparator), true)) {
                const content = {
                    "message": "Invalid Expression Mapping",
                    "user-input": (expressions) ? expressions.map(($) => $.pattern) : null,
                    "expectation": (matches) ? matches.map(($) => $[2]): null
                };

                const exception = JSON.stringify(content, null, 4);

                throw new Error(exception);
            }
        }
    }
}

export { Template };

export default Template;