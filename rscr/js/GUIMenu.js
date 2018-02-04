
/**
* Klasse zur Verwaltung der Menues.
* @author Thobias Michel
*/
var GUIMenu = new Class({

    /**
    * Konstruktor des GUIMenu.
    */
    initialize: function () {
        this.bindEvents();
        this.listener = new Array();
    },

    /**
    * Hinzufuegen von Listenern der Events von der Oberflaeche.
    * @param {listener} Plug-In welches Events der Oberflaeche empfangen moechte.
    */
    addListener: function(listener) {
        this.listener.push(listener);
    },

    /**
    * Events an das Menue binden
    */
    bindEvents: function () {
        var obj = this;
        $$(".top-navigation .flyout").each(function (flyout) {
            flyout.getChildren("li").each(function (item) {
                item.removeEvents();
                
                item.addEvent('click', function () {
                    for (var i = 0; i < obj.listener.length; i++) {
                        obj.listener[i].guiMenuListener(item.getAttribute("value"));
                    }
                });
            });
        });

        $$(".theme")[0].getChildren()[0].set({
            events: {
                change: function(event) {
                    var bodyTag = $$("body")[0];
                    bodyTag.removeProperty("class");
                    bodyTag.addClass(this.value);
                }
            }
        });

        $$(".closedialog").addEvent("click", function(event) {
            this.parentElement.set({
                styles: {
                    display: "none"
                }
            });
        });
    },

    /**
    * Hinzufuegen eines Shapes zur Sidebar
    * @param {shape} Ein Shape welches zur Oberflaeche hinzugefuegt werden soll.
    * @return {Boolean} Shape erfolgreich hinzugefuegt zur Sidebar.
    */
    addShape: function (shape) {
        var exists = false;

        $$(".left .shapes span").each(function (kategorie) {
            if (shape.Kategorie == kategorie.innerHTML) {
                var ul = kategorie.getNext("ul");
                if (shape.Shape != null) {
                    var li = new Element("li");
                    li.addEvent('click', function (event) { shape.Shape.clickEvent(shape.Name); });
                    li.appendText(shape.Name);
                    ul.grab(li);
                }
                else {
                    ul.grab(new Element("li").appendText(shape.Name));
                }
                exists = true;
            }

        });

        if (!exists) {
            $$(".left .shapes").grab(new Element("span.headline").appendText(shape.Kategorie));
            var ul;
            if (shape.Shape != null) {
                var li = new Element("li");
                li.addEvent('click', function (event) {
                    shape.Shape.clickEvent(shape.Name);

                });
                li.appendText(shape.Name);

                ul = new Element("ul").grab(li);
            }
            else {
                ul = new Element("ul").grab(new Element("li").appendText(shape.Name));
            }
            $$(".left .shapes").grab(ul);

        }
        return true;


    },

    /**
    * Erzeugen eines LI-Containers.
    * @param {displayheight} Die Hoehe des Containers.
    */
    createLi: function (displayheight) {
        return new Element("li", {
            styles: {
                height: displayheight + 'px'
            }
        });
    },

    /**
    * Erzeugen der Optionen eines Shapes
    * @param {options} Liste von enthaltenen Optionen.
    * @param {classname} Benutzerdefinierte Klassenname des Containers.
    * @return {DOM-Objekt} Options-Container.
    */
    createOptions: function (options, classname) {
        var divoptions = new Element("div", {
            'class': 'option-list ' + classname,
            styles: {
                float: "right",
                'margin-right': '10px',
                'margin-top': '6px'
            }
        });

        for (var i = 0; i < options.length; i++) {

            var option = new Element("img", {
                src: "./" + options[i].Icon,
                height: 15,
                events: {
                    click: options[i].Event,
                    mouseover: function () { this.style.cursor = "pointer"; }
                }
            });
            divoptions.grab(option);
        }
        return divoptions;
    },

    /**
    * Erzeugen eines Labels
    * @param {displaytext} Der Text des Labels.
    */
    createLabel: function (displaytext) {
        return new Element("span", {
            'class': 'label',
            text: displaytext,
            styles: {
                display: 'inline-block',
                width: '100px'
            }
        });
    },

    /**
    * Erzeugen eines Eingabefeldes.
    * @param {displayvalue} Wert des Eingabefeldes.
    * @param {keyupevent} KeyUp-Event des Eingabefeldes.
    * @param {identifier} Wert des Eingabefeldes.
    */
    createInput: function (displayvalue, keyupevent, identifier) {
        return new Element("input", {
            type: "text",
            value: displayvalue,
            'class': identifier,
            styles: {
                padding: '3px',
                width: '152px'
            },
            events:
            {
                keyup: keyupevent
            }
        });
    },

    /**
    * Erzeugt ein Auswahlfeld
    * @param {changeevent} OnChange-Event
    * @param {identifier} Css-Klasse zur Indentifizierung des Auswahlfeldes.
    */
    createSelect: function (changeevent, identifier) {
        return new Element("select", {
            'class': identifier,
            styles: {
                padding: '3px',
                width: '160px'
            },
            events: {
                change: changeevent
            }
        });
    },

    /**
    * Erzeugt ein kleineres Auswahlfeld
    * @param {changeevent} OnChange-Event
    * @param {identifier} Css-Klasse zur Indentifizierung des Auswahlfeldes.
    */
    createSelectSmall: function (changeevent, identifier) {
        return new Element("select", {
            'class': identifier,
            styles: {
                padding: '3px',
                width: '125px'
            },
            events: {
                change: changeevent
            }
        });
    },

    /**
    * Entfernen der Eigenschaften aus der Sidebar.
    * @return {DOM-Object} Eigenschaftenleiste aus dem DOM.
    */
    removeProperties: function () {
        var properties = $$(".left .properties");
        properties[0].getChildren("ul")[0].empty();
        return properties;
    },


});
