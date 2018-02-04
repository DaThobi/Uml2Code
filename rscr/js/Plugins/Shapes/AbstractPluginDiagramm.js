
/**
* Abstrakte Klasse fuer Plug-In Diagramme.
* @author Thobias Michel
*/
var AbstractPluginDiagramm = new Class({
    Interfaces: [IPluginDiagramm],

    initialize: function(gui) {
        this.gui = gui;
    },
});
