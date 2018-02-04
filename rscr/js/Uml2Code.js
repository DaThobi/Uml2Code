
/**
* Start-Up Klasse der Anwendung.
* @author Thobias Michel
*/
var Uml2Code = new Class( {
  
    
    /**
    * Konstruktor der Webanwendung mit Initalisierung aller benoetigten Komponenten.
    * @param {width} Breite des Zeichenbretts.
    * @param {height} Hoehe des Zeichenbretts.
    */
    initialize: function (width, height) {
        if(width != null && height != null)
            this.gui = new GUI(width, height);
        else {
            this.gui = null;
        }
        this.metaLanguager = new MetaLanguager();

        this.pluginHostShape = new PluginHostDiagramm(this.gui, this.metaLanguager);
        this.pluginHostCode = new PluginHostCode(this.gui, this.metaLanguager);
        
        var pluginKlassendiagramm = new PluginKlassenDiagramm(this.gui);
        pluginKlassendiagramm.setDefaults();
        this.pluginHostShape.addPlugin({ Plugin: pluginKlassendiagramm });

        var pluginJava = new CodeJava(this.pluginHostCode);
        this.pluginHostCode.addPlugin(pluginJava);

    },
    
    /** 
    * Ruft Dialaog zum Speichern von Quellcode auf.
    * @param {files} Zu speicerende Dateien in einem Zip.
    */
    saveCode: function(files) {
        var obj = this;

        this.gui.showSaveDialog('Quellcode speichern');

        var zip = new JSZip();

        for (var i = 0; i < files.length; i++) {
            zip.file(files[i].Name, files[i].Content);
        }
        var downloadAbleContent = zip.generate();

        var saveDialogAnchor = this.gui.getSaveDialogAnchor();
        saveDialogAnchor.addEvent("click", function () {
            saveDialogAnchor.set({
                'download': $$(".saveFileDialog input")[0].value + ".zip",
                'data-downloadurl': "data:application/zip;base64," + downloadAbleContent,
                'data-disabled': "true",
                'href': "data:application/zip;base64," + downloadAbleContent
            });

            obj.gui.hideSaveDialog();
        });
    },
    
    /**
    * Ruft Dialog zum Speichern von Diagrammen auf.
    * @param {files} Zu speicerende Dateien in einem Zip.
    */
    saveDiagramm: function(files) {
        var obj = this;
        this.gui.showSaveDialog('Diagramm speichern');

        var zip = new JSZip();
        
        for (var i = 0; i < files.length; i++) {
            zip.file(files[i].Name, files[i].Content);
        }
        var downloadAbleContent = zip.generate(); // Zip-Rohdaten

        var saveDialogAnchor = this.gui.getSaveDialogAnchor();
        saveDialogAnchor.addEvent("click", function () {
            saveDialogAnchor.set({
                'download': $$(".saveFileDialog input")[0].value + ".zip",
                'data-downloadurl': "data:application/zip;base64," + downloadAbleContent,
                'data-disabled': "true",
                'href': "data:application/zip;base64," + downloadAbleContent
            });

            obj.gui.hideSaveDialog();
        });

        return downloadAbleContent;
    },
    
    /**
    * Ruft Dialog zum oeffnen von Diagrammen auf.
    * @param {openInPluginMethod} Entfernte Methode zum interpretieren des Inhaltes.
    */
    openDiagramm: function(openInPluginMethod) {
        var obj = this;
        this.gui.showOpenFileDialog();

        this.gui.getOpenFileDialog().addEvent("click", function () {

            var file = obj.gui.getOpenFileDialogInput().files[0];
            var reader = new FileReader();


            reader.onload = (function (theFile) {
                return function (e) {
                    openInPluginMethod(new JSZip(this.result));

                    obj.gui.hideOpenFileDialog();
                };
            })(file);
            reader.readAsArrayBuffer(file);

        });
    },

});



