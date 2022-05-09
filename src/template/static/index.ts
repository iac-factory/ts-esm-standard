const Generate = async () => {
    const { Template } = await import("..");

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

export { Generate };

export default Generate;
