
/**
* MetaLanguager ist das Mittelstueck zwischen dem Diagramm und der Zielsprache.
* @author Thobias Michel
*/
var MetaLanguager = new Class({

    /**
    * Konstruktor zur Erzeugung des MetaLanguager  
    */
    initialize: function() {
        this.classes = new Array();
        this.assoziationen = new Array();
        this.listener = new Array();
    },

    /**
    * Hinzufuegen eines Plug-Ins zur Erzeugung von Quellcode
    * @param {plugin} Das hinzuzufuegende Plug-In
    */
    addListener: function(plugin) {
        this.listener.push(plugin);
    },

    /**
    * Anzeigen des Quellcodes durch die hinzufuegten Listener.
    * @param {metaClass} Nach Konvention enthaltene Meta-Klasse zur Anzeige vom Quellcode.
    */
    showCode: function(metaClass) {
        for (var i = 0; i < this.listener.length; i++) {
           this.listener[i].showCode(metaClass);
        }
    },
    
    /**
    * Speichern von generierten Quellcode in einer Zip.
    * @param {metaClasses} Liste von Meta-Klassen welcher als generierten Quellcode in einer Zip gespeichert werden sollen.
    * @return {String} Rohdaten des Zips.
    */
    saveCodeToZip: function(metaClasses) {
        for (var i = 0; i < this.listener.length; i++) {
            return this.listener[i].saveCodeToZip(metaClasses);
        }
    },
});