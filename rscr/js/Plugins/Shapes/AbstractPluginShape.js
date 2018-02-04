
/**
* Abstrakte Klasse fuer Shapes.
* @author Thobias Michel
*/
var AbstractPluginShape = new Class({
    
    initialize: function(gui, parent, id) {
        this.gui = gui;
        this.parent = parent;
        this.id = id;
    },
});
