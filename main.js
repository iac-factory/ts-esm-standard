// ESM syntax is supported.

const Test = async () => {
    const duration = 5000;
    const $ = async () => await new Promise(async (resolve) => {
        process.stdout.write("Awaiting ..." + "\n");
        await setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](duration);

        resolve(true);
    });

    await $();
    
    process.stdout.write("Complete :D" + "\n");
};

export default (async () => await Test())();
