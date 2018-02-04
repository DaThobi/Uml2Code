test("ShapeKlasse Test", function() {

    $$(".shapes ul li").each(function (entry) {
        entry.fireEvent("click");
    });

    var cl = uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key;
    ok(cl != null, "Get Class");

    var lengthCode = $$("#code")[0].innerHTML.length;

    cl.addMember("Testname", 0, "type", 0, "0");
    ok(cl.members[0].Name == "Testname", "AddMember");
    ok(cl.members[cl.members.length -1].Name == "Testname", "addMember ShowCode");

    lengthCode = $$("#code")[0].innerHTML.length;

    cl.addMethod("Testname", 0, 0, "type", "String name", "String");
    ok(cl.methods[0].Name == "Testname", "addMethod");
    ok(cl.methods[cl.methods.length -1].Name == "Testname", "addMethod ShowCode");

    cl.showProperties(cl);
    ok($$(".left .properties")[0].getChildren("ul")[0].innerHTML.length > 0, "showProperties");

    $$(".classname")[0].set({ value: 'NeuerKlName' });
    $$(".classname")[0].fireEvent("keyup");
    ok(cl.name == "NeuerKlName", "keyUp Name Klasse");

    $$(".classstereotype")[0].selectedIndex = 2;
    $$(".classstereotype")[0].fireEvent("change");
    ok(cl.stereoTypeIndex == 2, "keyUp Stereotype Klasse");

    $$(".selectvisibilityClass")[0].selectedIndex = 1;
    $$(".selectvisibilityClass")[0].fireEvent("change");
    ok(cl.visibilityClassIndex == 1, "change visibilityClassIndex Member");

    $$(".selectvisibilityMember")[0].selectedIndex = 1;
    $$(".selectvisibilityMember")[0].fireEvent("change");
    ok(cl.members[0].VisibilityIndex == 1, "change VisibilityIndex Member");

    $$(".membername")[0].set({ value: 'NeuerName' });
    $$(".membername")[0].fireEvent("keyup");
    ok(cl.members[0].Name == "NeuerName", "keyUp Name Member");

    $$(".selectPropertiesMember")[0].selectedIndex = 1;
    $$(".selectPropertiesMember")[0].fireEvent("change");
    ok(cl.members[0].AdditionalPropertiesIndex == 1, "change additionalPropertiesIndex Member");

    $$(".membertype")[0].set({ value: 'String' });
    $$(".membertype")[0].fireEvent("keyup");
    ok(cl.members[0].Type == "String", "keyUp Type Member");

    $$(".memberdefaultvalue")[0].set({ value: '"Hallo"' });
    $$(".memberdefaultvalue")[0].fireEvent("keyup");
    ok(cl.members[0].Default == '"Hallo"', "keyUp Default Member");

    $$(".methodname")[0].set({ value: 'NeueMethod' });
    $$(".methodname")[0].fireEvent("keyup");
    ok(cl.methods[0].Name == 'NeueMethod', "keyUp Name Method");

    $$(".selectvisibilityMethod")[0].selectedIndex = 1;
    $$(".selectvisibilityMethod")[0].fireEvent("change");
    ok(cl.methods[0].VisibilityIndex == 1, "change VisibilityIndex Method");
    
    $$(".selectPropertiesMethod")[0].selectedIndex = 1;
    $$(".selectPropertiesMethod")[0].fireEvent("change");
    ok(cl.methods[0].AdditionalPropertiesIndex == 1, "change VisibilityIndex Method");
    
    $$(".methodparameter")[0].set({ value: 'int count, String val' });
    $$(".methodparameter")[0].fireEvent("keyup");
    ok(cl.methods[0].Parameter == 'int count, String val', "keyUp Parameter Method");
    
    $$(".methodreturn")[0].set({ value: 'int' });
    $$(".methodreturn")[0].fireEvent("keyup");
    ok(cl.methods[0].Return == 'int', "keyUp Return Method");

    $$(".optionsmember")[0].getChildren()[0].fireEvent("click");
    $$(".selectmember")[0].selectedIndex = 1;
    $$(".membername")[0].set({ value: 'SecondMember' });
    $$(".membername")[0].fireEvent("keyup");
    $$(".selectmember")[0].fireEvent("change");
    ok($$(".membername")[0].value == "SecondMember", "change Member");

    

    $$(".optionsmember")[0].getChildren()[1].fireEvent("click");
    ok(cl.members.length == 1, "remove Member GUI");
    
    $$(".optionsmethod")[0].getChildren()[0].fireEvent("click");
    $$(".selectmethod")[0].selectedIndex = 1;
    $$(".methodname")[0].set({ value: 'SecondMethod' });
    $$(".methodname")[0].fireEvent("keyup");
    $$(".selectmethod")[0].fireEvent("change");
    ok($$(".methodname")[0].value == "SecondMethod", "change Method");

    $$(".optionsmethod")[0].getChildren()[1].fireEvent("click");
    ok(cl.members.length == 1, "remove Method GUI");

    cl.removeMember();
    ok(cl.members.length == 0, "remove Member");
    
    cl.removeMethod();
    ok(cl.methods.length == 0, "remove Method");

    var oldShadow = cl.showShadow;
    $$(".optionsclass")[0].getChildren()[0].fireEvent("click");
    ok(cl.showShadow != oldShadow, "showShadow");
    
    var parentClassCount = cl.parent.classes.length;
    $$(".optionsclass")[0].getChildren()[1].fireEvent("click");
    ok($$(".left .properties")[0].getChildren("ul")[0].innerHTML.length == 0, "remove Properties");
    ok(parentClassCount > cl.parent.classes.length, "remove Class");
    
    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key);
    $$(".optionsassoziation")[0].getChildren()[1].fireEvent("click");
});