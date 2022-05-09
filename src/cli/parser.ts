import type FS from "fs";

type Base = Partial<NodeJS.Process["argv"] & Array<string>>;

interface Class extends Object {
    /*** The Full System Path to `node` Executable */
    node: string;
    /*** The Full System Path to the Distribution's Callable File-Descriptor */
    distribution: string;
    /*** The Full System Path to the Process's Current-Working-Directory (`CWD` := `PWD`) */
    cwd: string;

    /*** CLI Argument: Interactive Mode */
    interactive: boolean;
    /*** CLI Argument: Display Author */
    author: boolean;
    /*** CLI Argument: Enable Debug Mode */
    debug: boolean;
}

type Parser <Generic = Class & Base> = {
    [$ in keyof Generic]: Generic[$];
}

interface Implementation extends Parser {}

/*** {@link https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-01#section-7.3 A Vocabulary for Structural Validation} */
class Exception extends TypeError {
    constructor(message: string) {
        super(message);
    }
}

const Parser = (): Implementation => {
    const Input = Array.from(process.argv);
    const Arguments = process.argv.splice( 2 ).map( (argument) => argument.toLowerCase() );

    const interactive = (Arguments.includes( "-i" ) || Arguments.includes( "--interactive" ));
    const author = (Arguments.includes( "-a" ) || Arguments.includes( "--author" ));
    const debug = (Arguments.includes( "-d" ) || Arguments.includes( "--debug" ));

    return new class extends Array {
        node: string | FS.PathLike | FS.PathOrFileDescriptor = Input[ 0 ] as string;
        distribution: string | FS.PathLike | FS.PathOrFileDescriptor = Input[ 1 ] as string;

        cwd?: string | FS.PathLike | FS.PathOrFileDescriptor = process.cwd() || process.env["INIT_CWD"];

        public interactive: boolean = interactive;
        public author: boolean = author;
        public debug: boolean = debug;

        constructor(properties = Input) {
            super( properties.length );

            if (!this.cwd) throw new Exception( "Please Upgrade NPM Version to Latest" );
        }
    }() as Implementation;
};

export default () => Parser();

export { Parser };
