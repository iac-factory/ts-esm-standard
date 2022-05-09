import { Generate } from "./template";

/***
 * @work-in-progress
 *
 * {@link https://github.com/iac-factory/ts-esm-standard/tree/Template-Generator Template-Generator}
 */
const Main = async (duration: number = 5000) => {
    await Generate();

    const handler = async () => new Promise((resolve) => {
        process.stdout.write("Initializing ..." + "\n");

        setTimeout(() => resolve(true), duration);
    });

    void await handler();

    return true;
};

void (async () => Main() )();

export default Main;

export { Main };
