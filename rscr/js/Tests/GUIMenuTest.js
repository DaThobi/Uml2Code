
test("GUIMenu Test", function() {

    var guimenu = uml2code.gui.guimenu;

    $$(".top-navigation .flyout li")[0].fireEvent("click");
    ok($$(".newFileDialog")[0].style.display == "block", "New Diagramm Dialog Shown");
    $$(".newFileDialog")[0].getChildren()[0].fireEvent("click");
    ok($$(".newFileDialog")[0].style.display == "none", "New Diagramm Dialog Hide");

    $$(".top-navigation .flyout li")[1].fireEvent("click");
    ok($$(".openFileDialog")[0].style.display == "block", "Open Diagramm Dialog Shown");
    $$(".openFileDialog")[0].getChildren()[0].fireEvent("click");
    ok($$(".openFileDialog")[0].style.display == "none", "Open Diagramm Dialog Hide");
    
    $$(".top-navigation .flyout li")[2].fireEvent("click");
    ok($$(".saveFileDialog")[0].style.display == "block", "Save Diagramm Dialog Shown");
    $$(".saveFileDialog")[0].getChildren()[0].fireEvent("click");
    ok($$(".saveFileDialog")[0].style.display == "none", "Save Diagramm Dialog Hide");

    $$(".shapes ul li").each(function(entry) {
        var count = $$("#stage svg")[0].getChildren().length;
        var fireevent = entry.fireEvent("click");
        var countAfterEvent = $$("#stage svg")[0].getChildren().length;
        ok(count < countAfterEvent, fireevent.innerHTML + "hinzufügen - BindEvents");
    });

    var createdLi = guimenu.createLi(55);
    ok(createdLi.outerHTML == "<li style=\"height: 55px;\"></li>", "createLi");

    var createdLabel = guimenu.createLabel("Testname");
    ok(createdLabel.outerHTML == "<span class=\"label\" style=\"display: inline-block; width: 100px;\">Testname</span>", "createdLabel");

    var createdSelect = guimenu.createSelect(function() {
    }, "selectclass");
    ok(createdSelect.outerHTML == "<select class=\"selectclass\" style=\"padding: 3px; width: 160px;\"></select>", "createdSelect");

    var createdSelectSmall = guimenu.createSelectSmall(function() {
    }, "selectclasssmall");
    ok(createdSelectSmall.outerHTML == "<select class=\"selectclasssmall\" style=\"padding: 3px; width: 125px;\"></select>", "createdSelectSmall");

    var createdOption = guimenu.createOptions(new Array({
        Name: "shadow",
        Icon: "/rscr/pluginklasse/Images/shadow.png",
        Event: function() {
        }
    }),"testclass");
    ok(createdOption.outerHTML == "<div class=\"option-list testclass\" style=\"float: right; margin-right: 10px; margin-top: 6px;\"><img src=\".//rscr/pluginklasse/Images/shadow.png\" height=\"15\"></div>", "createOptions Wrap");

    var createdInput = guimenu.createInput("displayValue", function(event) {
    }, "inputtest");
    ok(createdInput.outerHTML == "<input type=\"text\" class=\"inputtest\" style=\"padding: 3px; width: 152px;\">", "createInput");

    var properties = guimenu.removeProperties();
    ok(properties[0].innerHTML.length == 87, "removeProperties");
    
    uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key);
    $$(".optionsclass")[0].getChildren()[1].fireEvent("click");
    
    uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key.showProperties(uml2code.pluginHostShape.plugin[0].Plugin.assoziationen[0].Key);
    $$(".optionsassoziation")[0].getChildren()[1].fireEvent("click");

    $$(".theme select")[0].selectedIndex = 1;
    $$(".theme select")[0].fireEvent("change");
    ok($$("body")[0].hasClass("dark"), "Change Theme to Black");
    $$(".theme select")[0].selectedIndex = 0;
    $$(".theme select")[0].fireEvent("change");

    

});


