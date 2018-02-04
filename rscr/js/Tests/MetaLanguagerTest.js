test("MetaLanguager Test", function () {

    var metaLanguager = uml2code.metaLanguager;
    ok(metaLanguager != null, "Instanz");
    
    

    ok(uml2code.metaLanguager.listener.length > 0, "Listener Appended");
   
    //uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key);
    //$$(".optionsclass")[0].getChildren()[1].fireEvent("click");
    //uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key);
    //$$(".optionsassoziation")[0].getChildren()[1].fireEvent("click");
});