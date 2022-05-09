const Main = async (duration: number = 5000) => {
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
