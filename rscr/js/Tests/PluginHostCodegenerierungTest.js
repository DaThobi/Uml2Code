test("PluginHostCodegenerierung Test", function () {

    var pluginhostcodegenerierung = uml2code.pluginHostCode;

    ok(pluginhostcodegenerierung != null, "Instanz Test");

    ok(pluginhostcodegenerierung.plugin.length > 0, "addPlugin");

    

    //ok(pluginhostcodegenerierung != null, "Konstruktor PluginHostCodegenerierung");

    //pluginhostcodegenerierung.addPlugin({ Plugin: null });
    //ok(pluginhostcodegenerierung.plugin[0].Plugin == null, "AddPlugin");

});