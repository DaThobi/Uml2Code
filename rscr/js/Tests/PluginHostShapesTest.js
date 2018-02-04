test("PluginHostShapes Test", function() {

    var pluginhostshape = uml2code.pluginHostShape;

    ok(pluginhostshape != null, "Konstruktor PluginHostShape");

    ok(pluginhostshape.plugin.length > 0, "addPlugin");

    var shapesdiv = $$(".shapes")[0].getChildren();

    ok(shapesdiv[0].innerHTML == "Klassendiagramm", "GUIMenu addShape Kategorie");
    ok(shapesdiv[1].getChildren()[0].innerHTML == "Klasse" && shapesdiv[1].getChildren()[1].innerHTML == "Assoziation", "GUIMenu addShape Shapes");
    ok(shapesdiv.length == 2, "GUIMenu Anzahl Kategorien");



});