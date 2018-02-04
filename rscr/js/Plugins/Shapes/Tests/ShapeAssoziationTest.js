test("ShapeAssoziation Test", function() {

    $$(".shapes ul li")[1].fireEvent("click");
    

    var as = uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key;
    ok(as != null, "Get Assoziation");


    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key);
    
        
    as.showProperties(as);
    ok($$(".left .properties")[0].getChildren("ul")[0].innerHTML.length > 0, "showProperties");

    $$(".assoziationname")[0].set({ value: 'NeuerASName' });
    $$(".assoziationname")[0].fireEvent("keyup");
    ok(as.name == "NeuerASName", "keyUp Name Klasse");

    $$(".selecttype")[0].selectedIndex = 2;
    $$(".selecttype")[0].fireEvent("change");
    ok(as.selectedtype == 2, "change Type");

    $$(".labelinput")[0].set({ value: 'NeuerLabel' });
    $$(".labelinput")[0].fireEvent("keyup");
    ok(as.label == "NeuerLabel", "keyUp Label");
    
    $$(".multiplyainput")[0].set({ value: 'NeuerMPA' });
    $$(".multiplyainput")[0].fireEvent("keyup");
    ok(as.multiplya == "NeuerMPA", "keyUp Multiply A");
    
    $$(".multiplybinput")[0].set({ value: 'NeuerMPB' });
    $$(".multiplybinput")[0].fireEvent("keyup");
    ok(as.multiplyb == "NeuerMPB", "keyUp MultiplyB");

    $$(".shapes ul li")[0].fireEvent("click");
    $$(".shapes ul li")[0].fireEvent("click");

    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.classA = uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key;
    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.classB = uml2code.pluginHostShape.plugin[0].Plugin.classes[1].Key;
    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.reDraw(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key);

    ok(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.classA != null, "Set classA");
    ok(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.classB != null, "Set classB");

    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key);
    $$(".optionsassoziation")[0].getChildren()[1].fireEvent("click");
    ok(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen.length == 0, "Removed Last Assoziationen");

    uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key);
    $$(".optionsclass")[0].getChildren()[1].fireEvent("click");
    uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key);
    $$(".optionsclass")[0].getChildren()[1].fireEvent("click");
    ok(uml2code.pluginHostShape.plugin[0].Plugin.classes.length == 0, "Removed Two generated Classes");

    
});