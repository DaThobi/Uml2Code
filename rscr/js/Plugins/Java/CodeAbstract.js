
/**
* Abstrakte Klasse fuer Plug-In Code.
* @author Thobias Michel
*/
var CodeAbstract = new Class({
    Interfaces: [IListener],

    initialize: function(host) {
        this.host = host;
    }

}); 
