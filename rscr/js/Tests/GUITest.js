
test("GUI Test", function () {

    var gui = uml2code.gui;

    ok(gui != null, "Konstruktor / Instance");
    ok(gui.stage != null, "Setup DrawArea");
    ok(gui.guimenu != null, "Initialize GUIMenu");

    $$("#code")[0].set({
        text: "test Inhalt"
    });

    var codeContentLength = $$("#code")[0].innerHTML.length;
    gui.clearCodeArea();
    ok(codeContentLength > $$("#code")[0].innerHTML.length, "clearCodeArea");

});