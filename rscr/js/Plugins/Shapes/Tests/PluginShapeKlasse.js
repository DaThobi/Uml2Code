test("PluginShapeKlasse Test", function() {
    var plugin = uml2code.pluginHostShape.plugin[0].Plugin;

    ok(Joint.dia.click != null, "Joint.dia.click append");
    ok(Joint.clickEvent != null, "Joint.clickEvent append");

    $$(".shapes ul li").each(function (entry) {
        entry.fireEvent("click");
    });
    var cl = uml2code.pluginHostShape.plugin[0].Plugin.classes[0].Key;
    cl.showProperties(cl);


    var generatedContent = plugin.guiMenuListener("saveDiagramm");
    ok(generatedContent.length > 10, "Generate Downloadable Content");
    $$(".saveFileDialog .closedialog")[0].fireEvent("click");

    plugin.guiMenuListener("showShadow");
    ok(plugin.showShadow == false, "Hide shadow");
    
    
    plugin.guiMenuListener("alreset");

    var generatedContent = plugin.guiMenuListener("saveCode");
    ok(generatedContent.length > 0, "Generate Downloadable Content for direct download");
    $$(".saveFileDialog .closedialog")[0].fireEvent("click");

    ok(plugin.clickEvent("wrong") == null, "ClickEvent null Check");

    ok(plugin.transformToMetaClass(cl) != null, "TransformToMetaClass");

    plugin.guiMenuListener("newDiagramm");
    $$(".newFileDialog button[action='yes']")[0].fireEvent("click");

    var classFromFile = plugin.createClassesFromFile('{"classes":[{"id":1,"name":"Empty","showShadow":true,"shadow":{"height":80,"width":120,"y":17.5,"x":17.5},"stereoTypeIndex":0,"visibilityClassIndex":0,"members":[],"methods":[],"bbox":{"height":80,"width":120,"y":10.5,"x":10.5}},{"id":2,"name":"Empty","showShadow":true,"shadow":{"height":80,"width":120,"y":114.5,"x":373.5},"stereoTypeIndex":0,"visibilityClassIndex":0,"members":[],"methods":[],"bbox":{"height":80,"width":120,"y":107.5,"x":366.5}}]}');
    ok(classFromFile.length == 2, "createClassFromFile");

    var assoziationFromFile = plugin.createAssoziationenFromFile('{"assoziationen":[{"id":1,"name":"Assoziation","classA":1,"classB":2,"type":1,"label":"","multiplyA":"","multiplyB":""}]}');
    ok(assoziationFromFile.length == 1, "createAssoziationFromFile");

    

    plugin.guiMenuListener("newDiagramm");
    $$(".newFileDialog button[action='yes']")[0].fireEvent("click");
    ok(plugin.classes.length == 0, "newDiagramm");
    
    
    
   
});