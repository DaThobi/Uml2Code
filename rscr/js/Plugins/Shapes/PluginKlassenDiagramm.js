
/**
* Plug-In Diagramm fuer Klassendiagramme.
* @author Thobias Michel
*/
var PluginKlassenDiagramm = new Class({
    Implements: AbstractPluginDiagramm,

    /**
    * Standardwerte setzen.
    */
    setDefaults: function () {
        this.classes = new Array();
        this.assoziationen = new Array();

        this.classesMaxId = 1;
        this.assoziationenMaxId = 1;

        this.setJointClickEvent();
        this.gui.guimenu.addListener(this);
        this.showShadow = true;
    },

    /**
    * Listener der GUI zur Verwaltung von Menue-Events.
    * @param {event} Der Event-Name des jeweiligen Menue-Eintrags.
    */
    guiMenuListener: function (event) {
        if (event == "showShadow") {
            this.showShadow = !this.showShadow;

            for (var i = 0; i < this.classes.length; i++) {
                this.classes[i].Key.showShadow = this.showShadow;
                this.classes[i].Key.reDraw();
            }
        } else if (event == "alreset") {
            for (var i = 0; i < this.assoziationen.length; i++) {
                this.assoziationen[i].Key.reDraw();
            }
        } else if (event == "saveCode") {
            return this.saveCodeToZip();
        } else if (event == "saveDiagramm") {
            return this.saveDiagramm();
        } else if (event == "openDiagramm") {
            this.openDiagramm();
        } else if (event == "newDiagramm") {
            this.newDiagramm();
        }
    },

    /**
    * Setzen des MetaLanguagers
    * @param {metalanguager} Referenz auf MetaLanguager.
    */
    setMetaLanguager: function (metalanguager) {
        this.metaLanguager = metalanguager;
    },

    /**
    * Setzen der Klick-Events im JointJS-Framework.
    */
    setJointClickEvent: function () {
        var obj = this;

        Joint.dia.click = function (wholeShape) {
            var foundClass = obj.findShape(wholeShape.wrapper.getBBox());
            if (foundClass != null) {
                foundClass.Key.showProperties(foundClass.Key);
                obj.showCode(foundClass.Key);
            }
        };

        Joint.clickEvent = function (jointItem) {
            var foundJoint = obj.findJoint(jointItem);
            if (foundJoint != null) {
                foundJoint.Key.showProperties(foundJoint.Key);
            }
        };
    },

    /**
    * Finden einer Klasse anhand der BBox
    * @param {bbox} Die BBox.
    * @return {ShapeKlasse} Klasse oder null.
    */
    findShape: function (bbox) {
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].Key.classItem.getBBox().x == bbox.x && this.classes[i].Key.classItem.getBBox().y == bbox.y) {
                return this.classes[i];
            }
        }
        return null;

    },

    /**
    * Finden der Klasse ueber eine Assoziation fuer den internen Datenbestand.
    * @param {bbox} Die BBox.
    * @return {ShapeKlasse} Klasse oder null.
    */
    findShapeOverlaying: function (bbox) {
        for (var i = 0; i < this.classes.length; i++) {
            var b = this.classes[i].Key.classItem.getBBox();
            if (b.x <= bbox.x && b.x + b.width >= bbox.x &&
                b.y <= bbox.y && b.y + b.height >= bbox.y) {
                return this.classes[i];
            }
        }
        return null;
    },

    /**
    * Finden einer Assoziation auf dem Zeichenbrett.
    * @param {joint} Ein Joint-Object.
    * @return {ShapeAssoziation} Assoziation oder null.
    */
    findJoint: function (joint) {
        for (var i = 0; i < this.assoziationen.length; i++) {
            if (joint === this.assoziationen[i].Key.jointItem)
                return this.assoziationen[i];
        }
        return null;
    },

    /**
    * Neue Shapes des Diagramms zur Sidebar hinzufuegen.
    */
    addShape: function () {
        this.gui.guimenu.addShape({
            Kategorie: "Klassendiagramm",
            Name: "Klasse",
            Shape: this
        });

        this.gui.guimenu.addShape({
            Kategorie: "Klassendiagramm",
            Name: "Assoziation",
            Shape: this
        });
    },

    /**
    * Hinzufuege-Event der Sidebar entgegen nehmen und auswerten.
    * @param {shapename} Namen des hinzuzufuegenden Shapes.
    * @return {Object} Erstelle Klasse oder Assoziation oder null.
    */
    clickEvent: function (shapename) {

        if (shapename == "Klasse") {
            var newclass = new ShapeKlasse(this.gui, this, this.classesMaxId);
            this.classesMaxId++;

            this.classes.push({
                Key: newclass
            });
            newclass.drawEmpty();
            newclass.showShadow = this.showShadow;
            newclass.reDraw();
            this.updateRegistrations();
            
            return newclass;
        }
        if (shapename == "Assoziation") {
            var newassoziation = new ShapeAssoziation(this.gui, this, this.assoziationenMaxId);
            this.assoziationenMaxId++;

            this.assoziationen.push({
                Key: newassoziation
            });

            newassoziation.drawEmpty();
            return newassoziation;
        }
        return null;
    },

    /**
    * Aktualisieren der moeglichen Endpunkten in den Assoziationen.
    */
    updateRegistrations: function () {
        for (var i = 0; i < this.assoziationen.length; i++) {
            this.assoziationen[i].Key.classes = this.classes;
            this.assoziationen[i].Key.updateRegistrations(this.classes);
        }
    },

    /**
    * Entfernen einer Klasse.
    */
    removeClass: function (removeclass) {
        removeclass.classItem.unregisterFromJoints();
        removeclass.classItem.remove();
        removeclass.classItem.shadow.remove();
        removeclass.classItem = null;

        removeclass.gui.guimenu.removeProperties();
        removeclass.gui.clearCodeArea();

        var tempclasses = new Array();
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].Key.id != removeclass.id)
                tempclasses.push(this.classes[i]);
        }
        this.classes = tempclasses;
        this.updateRegistrations(this.classes);
    },

    /**
    * Entfernen einer Assoziation.
    */
    removeAssoziation: function (removeassoziation) {
        removeassoziation.jointItem._opt.handle.timeout = Infinity;

        if (removeassoziation.classA != null)
            removeassoziation.classA.classItem.unregisterFromJoints();

        if (removeassoziation.classB != null)
            removeassoziation.classB.classItem.unregisterFromJoints();

        removeassoziation.jointItem.freeJoint(removeassoziation.jointItem.startObject());
        removeassoziation.jointItem.freeJoint(removeassoziation.jointItem.endObject());
        removeassoziation.jointItem.clean(["connection", "startCap", "endCap", "handleStart", "handleEnd", "label"]);
        Joint.dia.unregisterJoint(removeassoziation.jointItem);
        removeassoziation.jointItem = null;
        removeassoziation.defaulta.remove();
        removeassoziation.defaultb.remove();

        removeassoziation.gui.guimenu.removeProperties();
        removeassoziation.gui.clearCodeArea();

        var tempassoziationen = new Array();
        for (var i = 0; i < this.assoziationen.length; i++) {
            if (this.assoziationen[i].Key.id != removeassoziation.id)
                tempassoziationen.push(this.assoziationen[i]);
            else {
                this.assoziationen[i] = null;
            }
        }
        this.assoziationen = tempassoziationen;
    },

    /**
    * Erzeugen einer Meta-Klasse
    * @param {classObject} Ausgewaehlte Klasse in eine Meta-Klasse transformieren.
    * @return {List<MetaClass>} Liste von Meta-Klassen.
    */
    transformToMetaClass: function (classObject) {
        var metaClass = {
            Name: classObject.name,
            Visibility: classObject.visibilityClass[classObject.visibilityClassIndex].Name,
            Extends: new Array(),
            Implements: new Array(),
            Members: new Array(),
            Methods: new Array()
        };

        for (var i = 0; i < this.assoziationen.length; i++) {
            var assoziation = this.assoziationen[i].Key;

            if (assoziation.classA != null  && assoziation.classB != null && assoziation.classA.id == classObject.id) {
                if (assoziation.types[assoziation.selectedtype].Name == "Vererbung") {
                    if (assoziation.classB.stereoTypes[assoziation.classB.stereoTypeIndex].Name == "<<interface>>")
                        metaClass.Implements.push({ Name: assoziation.classB.name });
                    else
                        metaClass.Extends.push({ Name: assoziation.classB.name });
                }
                if (assoziation.types[assoziation.selectedtype].Name == "Assoziation") {

                    if (assoziation.multiplyb.contains("0..*")) {
                        metaClass.Members.push({ Name: assoziation.classB.name, Visibility: "private", Type: "{" + assoziation.classB.name + "}", AdditionalProperties: "", Default: ""});
                    }
                    else if (assoziation.multiplyb == "1") {
                        metaClass.Members.push({ Name: assoziation.classB.name, Visibility: "private", Type: assoziation.classB.name, AdditionalProperties: "", Default: "new " + assoziation.classB.name + "()" });
                    }
                    else if (assoziation.multiplyb.contains("0..")) {
                        metaClass.Members.push({ Name: assoziation.classB.name, Visibility: "private", Type: "[" + assoziation.classB.name + "]", AdditionalProperties: "", Default: assoziation.multiplyb.substr(3) });
                    } else {
                        metaClass.Members.push({ Name: assoziation.classB.name, Visibility: "private", Type: assoziation.classB.name, AdditionalProperties: "", Default: "new " + assoziation.classB.name + "()" });
                    }
                    
                }

                if(assoziation.types[assoziation.selectedtype].Name == "Aggregation" ||
                        assoziation.types[assoziation.selectedtype].Name == "Komposition") {
                    metaClass.Members.push({
                        Name: assoziation.classB.name,
                        Visibility: "public",
                        Type: assoziation.classB.name,
                        AdditionalProperties: "",
                        Default: ""
                    });

                    metaClass.Methods.push({
                        Visibility: "public",
                        AdditionalProperties: "",
                        Name: "get" + assoziation.classB.name,
                        Parameter: "",
                        Type: assoziation.types[assoziation.selectedtype].Name,
                        Return: assoziation.classB.name
                    });
                }
            }
            
            if (assoziation.classB != null && assoziation.classA != null && assoziation.classB.id == classObject.id) {
                if (assoziation.types[assoziation.selectedtype].Name == "Assoziation") {
                    if (assoziation.multiplya.contains("0..*")) {
                        metaClass.Members.push({ Name: assoziation.classA.name, Visibility: "private", Type: "{" + assoziation.classA.name + "}", AdditionalProperties: "", Default: "" });
                    }
                    else if (assoziation.multiplya == "1") {
                        metaClass.Members.push({ Name: assoziation.classA.name, Visibility: "private", Type: assoziation.classA.name, AdditionalProperties: "", Default: "new " + assoziation.classA.name + "()" });
                    }
                    else if (assoziation.multiplya.contains("0..")) {
                        metaClass.Members.push({ Name: assoziation.classA.name, Visibility: "private", Type: "[" + assoziation.classA.name + "]", AdditionalProperties: "", Default: assoziation.multiplya.substr(3) });
                    } else {
                        metaClass.Members.push({ Name: assoziation.classA.name, Visibility: "private", Type: assoziation.classA.name, AdditionalProperties: "", Default: "new " + assoziation.classA.name + "()" });
                    }
                }
            }
        }

        for (var i = 0; i < classObject.members.length; i++) {
            metaClass.Members.push({
                Visibility: classObject.visibilityList[classObject.members[i].VisibilityIndex].Name,
                AdditionalProperties: classObject.additionalProperties[classObject.members[i].AdditionalPropertiesIndex].Name,
                Type: classObject.members[i].Type,
                Name: classObject.members[i].Name,
                Default: classObject.members[i].Default
            });
        }

        for (var i = 0; i < classObject.methods.length; i++) {
            metaClass.Methods.push({
                Visibility: classObject.visibilityList[classObject.methods[i].VisibilityIndex].Name,
                AdditionalProperties: classObject.additionalProperties[classObject.methods[i].AdditionalPropertiesIndex].Name,
                Name: classObject.methods[i].Name,
                Parameter: classObject.methods[i].Parameter,
                Return: classObject.methods[i].Return
            });
        }
        return metaClass;
    },

    /**
    * Anzeige des generierten Quellcodes einer Klasse.
    * @param {classObject} Quellcode der gewaehlten Klasse anzeigen.
    */
    showCode: function (classObject) {
        this.metaLanguager.showCode(this.transformToMetaClass(classObject));
    },

    /**
    * Quellcode als Zip speichern.
    * @return {string} Rohdaten der Zip-Datei.
    */
    saveCodeToZip: function () {
        var metaClasses = new Array();

        for (var i = 0; i < this.classes.length; i++) {
            metaClasses.push(this.transformToMetaClass(this.classes[i].Key));
        }

        var downloadAbleContent = this.metaLanguager.saveCodeToZip(metaClasses);
        uml2code.saveCode(downloadAbleContent);
        return downloadAbleContent;
    },

    /**
    * Diagramm als Zip speichern.
    * @return {string} Rohdaten der Zip-Datei.
    */
    saveDiagramm: function () {

        var classesJSON = {
            "classes": new Array()
        };
        for (var i = 0; i < this.classes.length; i++) {
            classesJSON.classes.push((this.classes[i].Key.toJSON()));
        }

        var assoziationJSON = {
            "assoziationen": new Array()
        };

        for (var i = 0; i < this.assoziationen.length; i++) {
            assoziationJSON.assoziationen.push((this.assoziationen[i].Key.toJSON()));
        }

        var files = [
            {
                Name: 'classes.dia',
                Content: JSON.stringify(classesJSON)
            },
            {
                Name: 'assoziationen.dia',
                Content: JSON.stringify(assoziationJSON)
            }
        ];

        var downloadAbleContent = uml2code.saveDiagramm(files);
        return downloadAbleContent;

    },

    /**
    * oeffnen eines Diagramms.
    */
    openDiagramm: function () {
        var obj = this;

        uml2code.openDiagramm(function (zip) {
            obj.clearDrawArea();

            var classes = zip.files["classes.dia"].data;
            var assoziationen = zip.files["assoziationen.dia"].data;

            obj.createClassesFromFile(classes);
            obj.createAssoziationenFromFile(assoziationen);
        });
    },

    /**
    * Klassen aus gespeicherten Zip generieren.
    * @param {classes} Liste von Klassen aus Zip.
    * @return {List<ShapeKlasse>} Liste von Klassen.
    */
    createClassesFromFile: function (classes) {
        var jsonClasses = JSON.parse(classes);
        var generatedClasses = new Array();

        for (var i = 0; i < jsonClasses.classes.length; i++) {
            var cl = jsonClasses.classes[i];

            var createdClass = this.clickEvent("Klasse");

            createdClass.id = cl.id;
            createdClass.name = cl.name;
            createdClass.showShadow = cl.showShadow;
            createdClass.members = cl.members;
            createdClass.methods = cl.methods;
            createdClass.stereoTypeIndex = cl.stereoTypeIndex;
            createdClass.visibilityClassIndex = cl.visibilityClassIndex;

            createdClass.classItem.wrapper.attr({
                x: cl.bbox.x,
                y: cl.bbox.y
            });

            createdClass.classItem.shadow.attr({
                x: cl.shadow.x,
                y: cl.shadow.y
            });

            createdClass.reDraw();
            generatedClasses.push(createdClass);
        }

        return generatedClasses;
    },

    /**
    * Assoziationen aus gespeicherten Zip generieren.
    * @param {classes} Liste von Klassen aus Zip.
    * @return {List<ShapeAssoziationen>} Liste von Assoziationen.
    */
    createAssoziationenFromFile: function (assoziationen) {
        var jsonAssozationen = JSON.parse(assoziationen);
        var generatedAssoziation = new Array();

        for (var i = 0; i < jsonAssozationen.assoziationen.length; i++) {

            var as = jsonAssozationen.assoziationen[i];

            var createdAssoziation = this.clickEvent("Assoziation");

            createdAssoziation.id = as.id;
            createdAssoziation.name = as.name;
            createdAssoziation.selectedtype = as.type;
            createdAssoziation.label = as.label;

            if (as.classA > 0)
                createdAssoziation.classA = this.getClassById(as.classA);

            if (as.classB > 0)
                createdAssoziation.classB = this.getClassById(as.classB);

            createdAssoziation.multiplya = as.multiplyA;
            createdAssoziation.multiplyb = as.multiplyB;

            createdAssoziation.reDraw();
            generatedAssoziation.push(createdAssoziation);
        }
        return generatedAssoziation;
    },

    /**
    * Klasse anhand ID abrufen.
    * @param {id} ID einer zufindenen Klasse.
    * @return {ShapeKlasse} Gefunde Klasse oder null.
    */
    getClassById: function (id) {
        for (var i = 0; i < this.classes.length; i++) {
            if (this.classes[i].Key.id == id)
                return this.classes[i].Key;
        }
        return null;
    },

    /**
    * Neues Diagramm erzeugen und vorheriges Loeschen.
    */
    newDiagramm: function () {
        var obj = this;

        $$(".newFileDialog").set({
            styles: {
                display: "block"
            }
        });

        $$(".newFileDialog button[action=yes]")[0].addEvent("click", function() {
            obj.clearDrawArea();
            
            $$(".newFileDialog").set({
                styles: {
                    display: "none"
                }
            });

        });

        $$(".newFileDialog button[action=no]")[0].addEvent("click", function () {
            $$(".newFileDialog").set({
                styles: {
                    display: "none"
                }
            });
        });

        
    },
    
    /**
    * Zeichenbrett leer machen.
    */
    clearDrawArea: function() {
        while (this.assoziationen != null && this.assoziationen.length > 0) {
            this.removeAssoziation(this.assoziationen[0].Key);
        }

        while (this.classes != null && this.classes.length > 0) {
            this.removeClass(this.classes[0].Key);
        }
    },
});
