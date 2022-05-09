const Main = async () => {
    const { Template } = await import("./template");

    const instance = new Template( "package.template.tpl", "package.test.json" );

    return instance.inject( [
        {
            pattern: "Name",
            replacement: "Test"
        }, {
            pattern: "Self",
            replacement: "..."
        }, {
            pattern: "Version",
            replacement: "..."
        }
    ] );
};

export { Main };

export default Main;