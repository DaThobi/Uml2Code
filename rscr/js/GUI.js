/**
* Klasse zur Verwaltung der GUI.
* @author Thobias Michel
*/
var GUI = new Class({
    
    /**
    * Konstruktor der GUI
    * @param {width} Breite des Zeichenbretts.
    * @param {height} Hoehe des Zeichenbretts.
    */
    initialize: function (width, height) {
        this.width = width;
        this.height = height;
        this.setUpDrawArea();
        this.guimenu = new GUIMenu();
    },
    
    /**
    * Initialisieren des Zeichenbretts.
    */
    setUpDrawArea: function () {
        this.stage = Joint.paper("stage", this.width, this.height);
    },
    
    /**
    * Leeren des Bereiches der Quellcode-Anzeige.
    */
    clearCodeArea: function() {
        var codediv = $$("#code");
        codediv[0].empty();
    },
    
    /**
    * Aktualisieren des ausgegeben Quellcodes.
    * @param {code} Der anzuzeigende Quellcode.
    * @param {brush} Auswahl der Hervorherbung fuer Javascript.
    */
    updateCodeArea: function(code, brush) {
        var codediv = this.getCodeArea();
        codediv[0].empty();

        var pre = new Element("pre", {
            'class': "brush: " + brush
        });

        pre.set({
            text: code
        });

        codediv.grab(pre);
        this.updateHighlitghting();
    },

    /**
    * Getter fuer den Bereich der Quellcode-Ausgabe.
    */
    getCodeArea: function() {
        return $$("#code");
    },
    
    /**
    * Aktualisieren der Hervorhebungen, notwendig beim Aktualisieren des Quellcodes.
    */
    updateHighlitghting: function() {
        SyntaxHighlighter.highlight();
    },
    
    /**
    * List den Link des Diagramm-Speicherns Dialog aus
    * @return {Object} Links des Dialogs.
    */
    getSaveDialogAnchor: function() {
        return $$(".saveFileDialog a[action=saveDiagramm]")[0];
    },
    
    /**
    * Ausblenden des Speichern-Dialogs.
    */
    hideSaveDialog: function() {
        $$(".saveFileDialog").set({
            styles: {
                display: "none"
            }
        });
    },

    /**
    * Anzeigen des Speichern-Dialogs.
    */
    showSaveDialog: function(text) {
        $$(".saveFileDialog .headline")[0].set({
            text: text
        });

        $$(".saveFileDialog").set({
            styles: {
                display: "block"
            }
        });
    },
    
    /**
    * Holen des OpenFileDialogs
    * @return {DOM-Object} Dialog-Container
    */
    getOpenFileDialog: function() {
        return $$(".openFileDialog button[action=openDiagramm]")[0];
    },
    
    /**
    * Holen des Eingabefeldes des Oeffnen-Dialogs.
    * @return {DOM-Object} Eingabefeld fuer Dateinamen.
    */
    getOpenFileDialogInput: function() {
        return $$(".openFileDialog input")[0];
    },

    /**
    * Anzeigen des Oeffnen-Dialogs.
    */
    showOpenFileDialog: function() {
        $$(".openFileDialog").set({
            styles: {
                display: "block"
            }
        });
    },
    
    /**
    * Ausblenden des Oeffnen-Dialogs.
    */
    hideOpenFileDialog: function() {
        $$(".openFileDialog").set({
            styles: {
                display: "none"
            }
        });
    }

});

