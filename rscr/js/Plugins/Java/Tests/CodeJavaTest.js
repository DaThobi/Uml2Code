test("CodeJava Test", function() {

    $$(".shapes ul li")[0].fireEvent("click");
    $$(".shapes ul li")[0].fireEvent("click");
    $$(".shapes ul li")[1].fireEvent("click");

    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.classA = uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key;
    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.classB = uml2code.pluginHostShape.plugin[0].Plugin.classes[1].Key;
    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.reDraw(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key);

    var as = uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key;
    ok(as != null, "Get Assoziation");

    as.showProperties(as);

    $$(".selecttype")[0].selectedIndex = 3;
    $$(".selecttype")[0].fireEvent("change");
    ok(as.selectedtype == 3, "change Type");

    as.reDraw();

    var lengthCode = $$("#code")[0].innerHTML.length;
    
    uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key.parent.showCode(uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key);
    ok(lengthCode < $$("#code")[0].innerHTML.length, "showCode");
    
    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key);
    $$(".optionsassoziation")[0].getChildren()[1].fireEvent("click");
    ok(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen.length == 0, "Removed Last Assoziationen");

    uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key);
    $$(".optionsclass")[0].getChildren()[1].fireEvent("click");
    uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key);
    $$(".optionsclass")[0].getChildren()[1].fireEvent("click");
    ok(uml2code.pluginHostShape.plugin[0].Plugin.classes.length == 0, "Removed Two generated Classes");
});