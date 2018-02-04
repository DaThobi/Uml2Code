
/**
* Datenhaltung fuer Assoziation eines Klassendiagramms.
* @author Thobias Michel
*/
var ShapeAssoziation = new Class({
    Extends: AbstractPluginShape,

    /**
    * Standard Shape zeichnen.
    */
    drawEmpty: function () {
        this.setDefaults();

        this.uml = Joint.dia.uml;
        this.setConnectionPointsFallback();
        this.reDraw(this);
        this.bindConnectionEvents();
        this.updateRegistrations(this.parent.classes);
    },

    /**
    * Fallback fuer ungekoppelte Endpunkte.
    */
    setConnectionPointsFallback: function () {
        this.defaulta = this.gui.stage.rect(100, 100, 1, 1).attr({ stroke: 0 });
        this.defaultb = this.gui.stage.rect(200, 150, 1, 1).attr({ stroke: 0 });
    },

    /**
    * Events binden beim Koppeln von Endpunkten an Klassen.
    */
    bindConnectionEvents: function () {

        var obj = this;

        this.jointItem.registerCallback("justConnected", function (side) {
            var foundcl = null;
            if (side == "start") {
                foundcl = obj.parent.findShapeOverlaying(obj.jointItem._start.shape.getBBox());
                if (foundcl != null) {
                    obj.classA = foundcl.Key;
                }
            } else {
                foundcl = obj.parent.findShapeOverlaying(obj.jointItem._end.shape.getBBox());
                if (foundcl != null) {
                    obj.classB = foundcl.Key;
                }
            }
        });

        this.jointItem.registerCallback("disconnected", function (side) {
            var foundcl = null;
            if (side == "start") {
                obj.classA = null;
            } else {
                obj.classB = null;
            }
        });

    },

    /**
    * Aktualisieren des gezeichneten Shapes auf dem Zeichenbrett.
    */
    reDraw: function () {
        if (this.jointItem != null) {

            this.jointItem._opt.handle.timeout = Infinity;

            this.jointItem.freeJoint(this.jointItem.startObject());
            this.jointItem.freeJoint(this.jointItem.endObject());
            this.jointItem.clean(["connection", "startCap", "endCap", "handleStart", "handleEnd", "label"]);
            Joint.dia.unregisterJoint(this.jointItem);

            this.defaulta.remove();
            this.defaultb.remove();
            this.jointItem = null;
        }

        this.setConnectionPointsFallback();

        if (this.classA != null && this.classB != null)
            this.jointItem = this.classA.classItem.joint(this.classB.classItem, this.types[this.selectedtype].Arrow);
        else if (this.classA != null)
            this.jointItem = this.classA.classItem.joint(this.defaultb, this.types[this.selectedtype].Arrow);
        else if (this.classB != null)
            this.jointItem = this.defaulta.joint(this.classB.classItem, this.types[this.selectedtype].Arrow);
        else {
            this.jointItem = this.defaulta.joint(this.defaultb, this.types[this.selectedtype].Arrow);
        }

        this.jointItem._opt.handle.timeout = Infinity;
        this.jointItem._opt.handle.start.enabled = true;
        this.jointItem._opt.handle.start.attrs.fill = "white";

        if (this.types[this.selectedtype].Name == "Assoziation") {
            this.jointItem._opt.handle.end.enabled = true;
            this.jointItem._opt.handle.end.attrs.fill = "white";
        }
        if (this.label.length > 0) {
            this.jointItem._opt.labelAttrsDefault.fill = "white";
            this.jointItem._opt.labelBoxAttrsDefault.fill = "#1E1E1E";
            this.jointItem._opt.labelBoxAttrsDefault.stroke = 0;
            this.jointItem.label(this.label);
        }

        this.jointItem._opt.label = [this.multiplya, this.label, this.multiplyb];
        this.jointItem._opt.labelAttrs = [
            { position: 1 / 4, stroke: 0, offset: -10, fill: "#666" },
            { position: 1 / 2, stroke: 0, offset: -10, fill: "#666" },
            { position: 3 / 4, stroke: 0, offset: -10, fill: "#666" }
        ];

        this.jointItem._opt.labelBoxAttrs = [
            { stroke: 0 },
            { stroke: 0 },
            { stroke: 0 }
        ];

        this.jointItem.update();
        this.updateRegistrations(this.parent.classes);
    },

    /**
    * Setzen von Standardwerten.
    */
    setDefaults: function () {
        this.id = this.parent.assoziationen.length;
        this.kategorie = "";
        this.name = "";

        this.addArrows();

        this.name = "Assoziation";
        this.classA = null;
        this.classB = null;
        this.types = new Array(
            { Name: "Aggregation", Arrow: Joint.dia.uml.kompositionArrow },
            { Name: "Komposition", Arrow: Joint.dia.uml.aggregationArrow },
            { Name: "Assoziation", Arrow: Joint.dia.erd.arrow },
            { Name: "Vererbung", Arrow: Joint.dia.uml.generalizationArrow }
        );
        this.selectedtype = 1;
        this.label = "";
        this.multiplya = "";
        this.multiplyb = "";

    },

    /**
    * Eigene Assozationstypen / Pfeile hinzufuegen.
    */
    addArrows: function () {
        Joint.dia.uml.kompositionArrow = {
            endArrow: { type: "komposition" },
            startArrow: { type: "none" },
            attrs: { "stroke-dasharray": "none", fill: 'white' }
        };

        Joint.arrows.komposition = function (size) {
            return {
                path: ["M", "7", "0", "L", "0", "5", "L", "-7", "0", "L", "0", "-5", "z"],
                dx: 9,
                dy: 9,
                attrs: {
                    stroke: "black",
                    "stroke-width": 2.0,
                    fill: "white"
                }
            };
        };
    },

    /**
    * Klassen fuer das Koppeln der Assoziationsenden ermoeglichen
    * @param {classobjs} Aktuell vorhandene Klassen.
    */
    updateRegistrations: function (classobjs) {
        if (classobjs.length > 0) {
            var regs = new Array();
            for (var i = 0; i < classobjs.length; i++) {
                regs.push(classobjs[i].Key.classItem);
            }
            if (regs.length > 0 && this.jointItem != null)
                this.jointItem.register(regs);
        }
    },
    
    /**
    * Anzeigen von Eigenschaften einer Assoziation.
    * @param {classObject} Objekt einer Assoziation.
    */
    showProperties: function (classObject) {

        var properties = classObject.gui.guimenu.removeProperties();

        var targetul = properties[0].getChildren("ul");
        // Settingsname


        var lioptions = classObject.gui.guimenu.createLi(10);
        var lioptionlabel = classObject.gui.guimenu.createLabel("Options:");
        var options = new Array(
            {
                Name: "reload", Icon: "/rscr/img/reload.png", Event: function () {
                    classObject.reDraw();
                }
            },
            {
                Name: "remove",
                Icon: "/rscr/img/remove.png",
                Event: function () {
                    classObject.parent.removeAssoziation(classObject);

                }
            });
        var optionlist = classObject.gui.guimenu.createOptions(options, "optionsassoziation");

        var liassoziation = classObject.gui.guimenu.createLi(150);

        var labelname = classObject.gui.guimenu.createLabel("Name:");
        var keyupeventname = function (event) {
            classObject.name = this.value;
            classObject.reDraw();
        };
        var name = classObject.gui.guimenu.createInput(classObject.name, keyupeventname, "assoziationname");

        var labelclassa = classObject.gui.guimenu.createLabel("Klasse A:");
        var changeeventclassa = function (event) {
            if (parseInt(this.value) == -1) {
                classObject.classA = null;
            }
            else
                classObject.classA = classObject.classes[parseInt(this.value)];
            classObject.reDraw();
            classObject.classA.Key.pushAssoziation(classObject);
        };
        var selectclassa = classObject.gui.guimenu.createSelect(changeeventclassa, "selectclassA");
        selectclassa.grab(new Element("option", {
            value: -1,
            text: "keine"
        }));
        for (var i = 0; i < classObject.parent.classes.length; i++) {
            if (classObject.parent.classes[i] === classObject.classA) {
                selectclassa.grab(new Element("option", {
                    value: i,
                    text: classObject.classes[i].Key.name,
                    'selected': 'selected'
                }));
            } else {
                selectclassa.grab(new Element("option", {
                    value: i,
                    text: classObject.parent.classes[i].Key.name
                }));
            }

        }


        var labelclassb = classObject.gui.guimenu.createLabel("Klasse B:");
        var changeeventclassb = function (event) {
            if (parseInt(this.value) == -1) {
                classObject.classB = null;
            }
            else
                classObject.classB = classObject.classes[parseInt(this.value)];
            classObject.reDraw();
            classObject.classB.Key.pushAssoziation(classObject);
        };
        var selectclassb = classObject.gui.guimenu.createSelect(changeeventclassb, "selectclassB");
        selectclassb.grab(new Element("option", {
            value: -1,
            text: "keine"
        }));
        for (var i = 0; i < classObject.parent.classes.length; i++) {
            if (classObject.parent.classes[i] === classObject.classB) {
                selectclassb.grab(new Element("option", {
                    value: i,
                    text: classObject.parent.classes[i].Key.name,
                    'selected': 'selected'
                }));
            } else {
                selectclassb.grab(new Element("option", {
                    value: i,
                    text: classObject.parent.classes[i].Key.name
                }));
            }
        }

        var selecttypelabel = classObject.gui.guimenu.createLabel("Type:");
        var selecttype = classObject.gui.guimenu.createSelect(function () {
            var index = $$(".selecttype")[0].selectedIndex;
            classObject.selectedtype = index;
            classObject.reDraw();
        }, "selecttype");

        for (var i = 0; i < classObject.types.length; i++) {
            if (i == classObject.selectedtype) {
                selecttype.grab(new Element("option", {
                    value: i,
                    text: classObject.types[i].Name,
                    selected: 'selected'
                }));
            } else {
                selecttype.grab(new Element("option", {
                    value: i,
                    text: classObject.types[i].Name
                }));
            }

        }

        var labellabel = classObject.gui.guimenu.createLabel("Label:");
        var inputlabel = classObject.gui.guimenu.createInput(classObject.label, function () {
            classObject.label = this.value;
            classObject.reDraw();
        }, "labelinput");

        var labelmultiplya = classObject.gui.guimenu.createLabel("Multipy A:");
        var inputmultiplya = classObject.gui.guimenu.createInput(classObject.multiplya, function () {
            classObject.multiplya = this.value;
            classObject.reDraw();
        }, "multiplyainput");

        var labelmultiplyb = classObject.gui.guimenu.createLabel("Multipy B:");
        var inputmultiplyb = classObject.gui.guimenu.createInput(classObject.multiplyb, function () {
            classObject.multiplyb = this.value;
            classObject.reDraw();
        }, "multiplybinput");



        lioptions.grab(lioptionlabel);
        lioptions.grab(optionlist);

        liassoziation.grab(labelname);
        liassoziation.grab(name);
        liassoziation.grab(selecttypelabel);
        liassoziation.grab(selecttype);
        liassoziation.grab(labellabel);
        liassoziation.grab(inputlabel);
        liassoziation.grab(labelmultiplya);
        liassoziation.grab(inputmultiplya);
        liassoziation.grab(labelmultiplyb);
        liassoziation.grab(inputmultiplyb);

        targetul.grab(lioptions);
        targetul.grab(liassoziation);

    },

    /**
    * Konvertiert Objekt zu einem JSON-Objekt.
    * @return {JSON} Json-Objekt der Assoziation.
    */
    toJSON: function() {
        var json = {
            "id": this.id,
            "name": this.name,
            "classA": this.classA != null ? this.classA.id : 0,
            "classB": this.classB != null ? this.classB.id : 0,
            "type": this.selectedtype,
            "label": this.label,
            "multiplyA": this.multiplya,
            "multiplyB": this.multiplyb
        };
        return json;
    }



});