
/**
* Verwaltet die Plug-Ins der Zielsprache.
* @author Thobias Michel
*/
var PluginHostCode = new Class({
    Interface: IPluginHost,

    /**
    * Konstruktor zur Erzeugung des Plug-In Host 
    * @param {gui} Die GUI als Schnittstelle zur Oberflaeche.
    * @param {metalanguager} Der MetaLanguager als Schnittstelle zur Quellcodegenerierung.
    */
    initialize: function(gui, metalanguager) {
        this.plugin = new Array();
        this.metaLanguager = metalanguager;
        this.gui = gui;
    },

    /** 
    * Hinzufuegen eines Plug-Ins zum Host.
    * @param {plugin} Hinzufuegendes Plug-In zum Host.
    */
    addPlugin: function (plugin) {
        this.plugin.push(plugin);
        this.metaLanguager.addListener(plugin);
    }

});