/**
* Verwaltet die Plug-Ins der UML-Diagramme.
* @author Thobias Michel
*/
var PluginHostDiagramm = new Class({
    Interface: IPluginHost,

    /**
    * Konstruktor zur Erzeugung des Plug-In Host 
    * @param {gui} Die GUI als Schnittstelle zur Oberflaeche.
    * @param {metalanguager} Der MetaLanguager als Schnittstelle zur Quellcodegenerierung.
    */
    initialize: function(gui, metalanguager) {
        this.gui = gui;
        this.metaLanguager = metalanguager;
        this.plugin = new Array();
    },
    
    /** 
    * Hinzufuegen eines Plug-Ins zum Host.
    * @param {plugin} Hinzufuegendes Plug-In zum Host.
    */
    addPlugin: function (plugin) {
        this.plugin.push(plugin);
        plugin.Plugin.setMetaLanguager(this.metaLanguager);
        plugin.Plugin.addShape();
    },

});
