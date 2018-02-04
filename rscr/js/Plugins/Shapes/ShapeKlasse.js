/**
* Datenhaltung fuer Klassen eines Klassendiagramms.
* @author Thobias Michel
*/

var ShapeKlasse = new Class({
    Extends: AbstractPluginShape,

    /**
    * Standard Shape zeichnen.
    */
    drawEmpty: function () {
        this.setDefaults();
        this.uml = Joint.dia.uml;

        this.classItem = this.uml.Class.create({
            rect: {
                x: 10,
                y: 10,
                width: 180,
                height: 80,
            },
            swimlane1OffsetY: 30,
            label: this.name,
            shadow: this.showShadow,
            attrs: {
                fill: '#fff'
            },
            labelAttrs: {
                'font-weight': 'bold',
            },
            methods: [],
            attributes: []

        });
    },

    /**
    * Aktualisieren des gezeichneten Shapes auf dem Zeichenbrett.
    */
    reDraw: function () {
        if (this.stereoTypeIndex > 0)
            this.classItem.properties.label = this.stereoTypes[this.stereoTypeIndex].Name + "\n" + this.name;
        else
            this.classItem.properties.label = this.name;

        this.classItem.properties.shadow = this.showShadow;

        var itemcount = 0;
        this.classItem.properties.attributes = new Array();
        for (var m = 0; m < this.members.length; m++) {
            var selector = this.visibilityList[this.members[m].VisibilityIndex].Selector;

            this.classItem.properties.attributes.push(
               selector + "" + this.members[m].Name + ": " + this.members[m].Type
            );
            itemcount++;
        }

        this.classItem.properties.methods = new Array();
        for (var m = 0; m < this.methods.length; m++) {
            var selector = this.visibilityList[this.methods[m].VisibilityIndex].Selector;

            this.classItem.properties.methods.push(
               selector + "" + this.methods[m].Name + "(" + this.methods[m].Parameter + ") : " + this.methods[m].Return
            );
            itemcount++;
        }

        this.classItem.wrapper.attr({
            height: 80 + 12 * itemcount
        });

        this.classItem.shadow.attr({
            height: 80 + 12 * itemcount,
            opacity: this.showShadow ? 0.5 : 0
        });

        this.classItem.zoom();
    },

    /**
    * Setzen von Standardwerten.
    */
    setDefaults: function () {
        this.id = this.parent.classes.length;

        this.methods = new Array();
        this.members = new Array();


        this.name = "Empty";
        this.showShadow = true;
        this.stereoTypeIndex = 0;

        this.assoziationen = new Array();

        this.visibilityClass = new Array(
            { Name: "public", Selector: "+" },
            { Name: "protected", Selector: "#" },
            { Name: "private", Selector: "-" },
            { Name: "abstract", Selector: "~" }
        );
        this.visibilityClassIndex = 0;

        this.visibilityList = new Array(
            { Name: "public", Selector: "+" },
            { Name: "protected", Selector: "#" },
            { Name: "private", Selector: "-" }
        );

        this.additionalProperties = new Array(
            { Name: ""},
            { Name: "static" },
            { Name: "final" },
            { Name: "abstract" },
            { Name: "synchronized" },
            { Name: "static final" }
        );

        this.stereoTypes = new Array(
            { Name: "" },
            { Name: "<<interface>>" },
            { Name: "<<type>>" },
            { Name: "<<entity>>" },
            { Name: "<<control>>" },
            { Name: "<<boundary>>" },
            { Name: "<<primitive>>" },
            { Name: "<<enumeration>>" },
            { Name: "<<structure>>" },
            { Name: "<<utility>>" }
        );
    },

    /**
    * Hinzufuegen eines neuen Members.
    * @param {name} Name des Members.
    * @param {visibility} Sichtbarkeit des Members.
    * @param {type} Typ des Members.
    * @param {additionalPropertiesIndex} Zusaetzliche Parameter des Members.
    * @param {defaultValue} Standardwert des Members.
    */
    addMember: function (name, visibility, type, additionalPropertiesIndex, defaultValue) {
        this.members.push({
            Name: name, VisibilityIndex: visibility, Type: type, AdditionalPropertiesIndex: additionalPropertiesIndex, Default: defaultValue
        });
        this.reDraw();
        this.showProperties(this);
    },

    /**
    * Entfernen eines Members.
    */
    removeMember: function () {
        var index = $$(".selectmember")[0].selectedIndex;
        var tempmembers = new Array();

        for (var i = 0; i < this.members.length; i++) {
            if (i != index)
                tempmembers.push(this.members[i]);
        }

        this.members = tempmembers;

        this.reDraw();
        this.showProperties(this);
    },

    /**
    * Hinzufuegen einer neuen Methode.
    * @param {name} Name des Members.
    * @param {visibility} Sichtbarkeit der Methode.
    * @param {additionalPropertiesIndex} Zusaetzliche Parameter der Methode.
    * @param {type} ZTyp der Methode.
    * @param {parameter} Parameter der Methode.
    * @param {returnvalue} Rueckgabewert der Methode.
    */
    addMethod: function (name, visibility, additionalPropertiesIndex, type, parameter, returnvalue) {
        this.methods.push({
            Name: name, VisibilityIndex: visibility, AdditionalPropertiesIndex: additionalPropertiesIndex, Type: type, Parameter: parameter, Return: returnvalue
        });
        this.reDraw();
        this.showProperties(this);
    },

    /**
    * Entfernen einer Methode
    */
    removeMethod: function () {
        var index = $$(".selectmethod")[0].selectedIndex;
        var tempmethods = new Array();

        for (var i = 0; i < this.methods.length; i++) {
            if (i != index)
                tempmethods.push(this.methods[i]);
        }

        this.methods = tempmethods;

        this.reDraw();
        this.showProperties(this);
    },

    /**
    * Eine neue Assoziation wird den Klassen bekannt gemacht.
    * @param {assoziation} Hinzuzufuegende Assoziation.
    */
    pushAssoziation: function (assoziation) {
        this.assoziationen.push(assoziation);
    },

    /**
    * Anzeigen von Eigenschaften einer Klasse
    * @param {classObject} Objekt einer Klasse.
    */
    showProperties: function (classObject) {

        var properties = classObject.gui.guimenu.removeProperties();

        var targetul = properties[0].getChildren("ul");

        var lioptions = classObject.gui.guimenu.createLi(10);
        var lioptionlabel = classObject.gui.guimenu.createLabel("Options:");
        var options = new Array(
            {
                Name: "shadow", Icon: "/rscr/img/shadow.png", Event: function () {
                    classObject.showShadow = classObject.showShadow ? false : true; classObject.reDraw();
                }
            },
            {
                Name: "remove",
                Icon: "/rscr/img/remove.png",
                Event: function () {
                    classObject.parent.removeClass(classObject);
                }
            });
        var optionlist = classObject.gui.guimenu.createOptions(options, "optionsclass");

        var ligeneral = classObject.gui.guimenu.createLi(81);

        var labelname = classObject.gui.guimenu.createLabel("Name:");

        var name = classObject.gui.guimenu.createInput(classObject.name, function (event) {
            classObject.name = this.value;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "classname");

        var labelstereotype = classObject.gui.guimenu.createLabel("Stereotype:");
        var selectStereoType = classObject.gui.guimenu.createSelect(function() {
            var index = $$(".classstereotype")[0].selectedIndex;
            classObject.stereoTypeIndex = index;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "classstereotype");

        for (var i = 0; i < classObject.stereoTypes.length; i++) {
            if (i == classObject.stereoTypeIndex) {
                selectStereoType.grab(new Element("option", {
                    value: i,
                    text: classObject.stereoTypes[i].Name,
                    selected: 'selected'
                }));
            } else {
                selectStereoType.grab(new Element("option", {
                    value: i,
                    text: classObject.stereoTypes[i].Name
                }));
            }
        }

        var labelsichtbarkeit = classObject.gui.guimenu.createLabel("Sichtbarkeit:");
        var selectsichtbarkeit = classObject.gui.guimenu.createSelect(function () {
            var index = $$(".selectvisibilityClass")[0].selectedIndex;
            classObject.visibilityClassIndex = index;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "selectvisibilityClass");

        for (var i = 0; i < classObject.visibilityClass.length; i++) {
            if (i == classObject.visibilityClassIndex) {
                selectsichtbarkeit.grab(new Element("option", {
                    value: i,
                    text: classObject.visibilityClass[i].Name,
                    selected: 'selected'
                }));
            } else {
                selectsichtbarkeit.grab(new Element("option", {
                    value: i,
                    text: classObject.visibilityClass[i].Name
                }));
            }
        }

        var limember = classObject.gui.guimenu.createLi(180);

        var labelmember = classObject.gui.guimenu.createLabel("Member:");

        var selectmember = classObject.gui.guimenu.createSelectSmall(function (event) {
            $$(".membername").set({
                value: classObject.members[parseInt(this.value)].Name
            });
            $$(".selectvisibilityMember")[0].selectedIndex = classObject.members[parseInt(this.value)].VisibilityIndex;
            
            $$(".selectPropertiesMember")[0].selectedIndex = classObject.members[parseInt(this.value)].AdditionalPropertiesIndex;

            $$(".membertype").set({
                value: classObject.members[parseInt(this.value)].Type
            });

            $$(".memberdefaultvalue").set({
                value: classObject.members[parseInt(this.value)].Default
            });
        }, "selectmember");

        var selectoptionsmember = new Array(
        {
            Icon: "/rscr/img/add.png",
            Event: function () {
                classObject.addMember("newMember", 0, "", 0, "");
                classObject.parent.showCode(classObject);
            }
        },
        {
            Icon: "/rscr/img/remove.png", Event: function () {
                classObject.removeMember();
            },
        });
        var selectoptionsdiv = classObject.gui.guimenu.createOptions(selectoptionsmember, "optionsmember");

        for (var i = 0; i < classObject.members.length; i++) {
            selectmember.grab(new Element("option", {
                value: i,
                text: classObject.members[i].Name
            }));
        }

        var spanname = classObject.gui.guimenu.createLabel("Name:");


        var memberinputname = classObject.gui.guimenu.createInput(classObject.members.length > 0 ? classObject.members[0].Name : "", function (event) {
            var index = $$(".selectmember")[0].selectedIndex;
            classObject.members[index].Name = this.value;
            $$(".selectmember").getSelected()[0][0].attributes[0].ownerElement.innerHTML = this.value;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "membername");


        var spanmemberclassifier = classObject.gui.guimenu.createLabel("Sichtbarkeit:");
        var selectVisibilityMember = classObject.gui.guimenu.createSelect(function () {
            var index = $$(".selectmember")[0].selectedIndex;
            classObject.members[index].VisibilityIndex = $$(".selectvisibilityMember")[0].selectedIndex;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "selectvisibilityMember");

        for (var i = 0; i < classObject.visibilityList.length; i++) {
            if (classObject.members.length > 0 && i == classObject.members[0].VisibilityIndex) {
                selectVisibilityMember.grab(new Element("option", {
                    value: i,
                    text: classObject.visibilityList[i].Name,
                    selected: 'selected'
                }));
            } else {
                selectVisibilityMember.grab(new Element("option", {
                    value: i,
                    text: classObject.visibilityList[i].Name,
                }));
            }
        }

        var spanMemberAdditionalProperties = classObject.gui.guimenu.createLabel("Eigenschaften:");
        var selectPropertiesMember = classObject.gui.guimenu.createSelect(function () {
            var index = $$(".selectmember")[0].selectedIndex;
            classObject.members[index].AdditionalPropertiesIndex = $$(".selectPropertiesMember")[0].selectedIndex;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "selectPropertiesMember");
        for (var i = 0; i < classObject.additionalProperties.length; i++) {
            if (classObject.members.length > 0 && i == classObject.members[0].AdditionalPropertiesIndex) {
                selectPropertiesMember.grab(new Element("option", {
                    value: i,
                    text: classObject.additionalProperties[i].Name,
                    selected: 'selected'
                }));
            } else {
                selectPropertiesMember.grab(new Element("option", {
                    value: i,
                    text: classObject.additionalProperties[i].Name,
                }));
            }
        }

        var spanmembertype = classObject.gui.guimenu.createLabel("Type:");

        var memberinputtype = classObject.gui.guimenu.createInput(classObject.members.length > 0 ? classObject.members[0].Type : "", function (event) {
            var index = $$(".selectmember")[0].selectedIndex;
            classObject.members[index].Type = this.value;
            classObject.parent.showCode(classObject);
            classObject.reDraw();
        }, "membertype");

        var labelMemberDefaultValue = classObject.gui.guimenu.createLabel("Default:");
        var inputMemberDefaultValue = classObject.gui.guimenu.createInput(classObject.members.length > 0 ? classObject.members[0].Default : "", function (event) {
            var index = $$(".selectmember")[0].selectedIndex;
            classObject.members[index].Default = this.value;
            classObject.parent.showCode(classObject);
        }, "memberdefaultvalue");

        var limethods = classObject.gui.guimenu.createLi(180);
        var spanmethodsname = classObject.gui.guimenu.createLabel("Methods:");
        var selectmethods = classObject.gui.guimenu.createSelectSmall(function () {
            $$(".methodname").set({
                value: classObject.methods[parseInt(this.value)].Name
            });
            
            $$(".selectvisibilityMethod")[0].selectedIndex = classObject.methods[parseInt(this.value)].VisibilityIndex;

            $$(".selectPropertiesMethod")[0].selectedIndex = classObject.methods[parseInt(this.value)].AdditionalPropertiesIndex;
            
            $$(".methodparameter").set({
                value: classObject.methods[parseInt(this.value)].Parameter
            });
            $$(".methodreturn").set({
                value: classObject.methods[parseInt(this.value)].Return
            });
        }, "selectmethod");


        var selectoptionsmethods = new Array(
        {
            Icon: "/rscr/img/add.png",
            Event: function () {
                classObject.addMethod("newMethod", 0, 0, "", "", "");
                classObject.parent.showCode(classObject);
            }
        },
        {
            Icon: "/rscr/img/remove.png", Event: function () {
                classObject.removeMethod();
            },
        });
        var selectoptionsdivmethods = classObject.gui.guimenu.createOptions(selectoptionsmethods, "optionsmethod");

        for (var i = 0; i < classObject.methods.length; i++) {
            selectmethods.grab(new Element("option", {
                value: i,
                text: classObject.methods[i].Name
            }));
        }

        var methodlabelname = classObject.gui.guimenu.createLabel("Name:");
        var methodinputname = classObject.gui.guimenu.createInput(classObject.methods.length > 0 ? classObject.methods[0].Name : "", function () {
            var index = $$(".selectmethod")[0].selectedIndex;
            classObject.methods[index].Name = this.value;
            $$(".selectmethod").getSelected()[0][0].attributes[0].ownerElement.innerHTML = this.value;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "methodname");

        var labelMethodVisibility = classObject.gui.guimenu.createLabel("Sichtbarkeit:");
        var selectMethodVisibility = classObject.gui.guimenu.createSelect(function () {
            var index = $$(".selectmethod")[0].selectedIndex;
            classObject.methods[index].VisibilityIndex = $$(".selectvisibilityMethod")[0].selectedIndex;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "selectvisibilityMethod");

        for (var i = 0; i < classObject.visibilityList.length; i++) {
            if (classObject.methods.length > 0 && i == classObject.methods[0].VisibilityIndex) {
                selectMethodVisibility.grab(new Element("option", {
                    value: i,
                    text: classObject.visibilityList[i].Name,
                    selected: 'selected'
                }));
            } else {
                selectMethodVisibility.grab(new Element("option", {
                    value: i,
                    text: classObject.visibilityList[i].Name,
                }));
            }
        }
        
        var labelMethodAdditionalProperties = classObject.gui.guimenu.createLabel("Eigenschaften:");
        var selectPropertiesMethod = classObject.gui.guimenu.createSelect(function () {
            var index = $$(".selectmethod")[0].selectedIndex;
            classObject.methods[index].AdditionalPropertiesIndex = $$(".selectPropertiesMethod")[0].selectedIndex;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "selectPropertiesMethod");
        for (var i = 0; i < classObject.additionalProperties.length; i++) {
            
            if (classObject.methods.length > 0 && i == classObject.methods[0].AdditionalPropertiesIndex) {
                selectPropertiesMethod.grab(new Element("option", {
                    value: i,
                    text: classObject.additionalProperties[i].Name,
                    selected: 'selected'
                }));
            } else {
                selectPropertiesMethod.grab(new Element("option", {
                    value: i,
                    text: classObject.additionalProperties[i].Name,
                }));
            }
        }

        var labelMethodParameter = classObject.gui.guimenu.createLabel("Parameter:");
        var inputMethodParameter = classObject.gui.guimenu.createInput(classObject.methods.length > 0 ? classObject.methods[0].Parameter : "", function () {
            var index = $$(".selectmethod")[0].selectedIndex;
            classObject.methods[index].Parameter = this.value;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "methodparameter");

        var methodlabelreturn = classObject.gui.guimenu.createLabel("Return:");
        var methodinputreturn = classObject.gui.guimenu.createInput(classObject.methods.length > 0 ? classObject.methods[0].Return : "", function () {
            var index = $$(".selectmethod")[0].selectedIndex;
            classObject.methods[index].Return = this.value;
            classObject.reDraw();
            classObject.parent.showCode(classObject);
        }, "methodreturn");


        lioptions.grab(lioptionlabel);
        lioptions.grab(optionlist);

        ligeneral.grab(labelname);
        ligeneral.grab(name);
        ligeneral.grab(labelstereotype);
        ligeneral.grab(selectStereoType);
        ligeneral.grab(labelsichtbarkeit);
        ligeneral.grab(selectsichtbarkeit);

        limember.grab(labelmember);
        limember.grab(selectmember);
        limember.grab(selectoptionsdiv);
        limember.grab(spanname);
        limember.grab(memberinputname);
        limember.grab(spanmemberclassifier);
        limember.grab(selectVisibilityMember);
        limember.grab(spanMemberAdditionalProperties);
        limember.grab(selectPropertiesMember);
        limember.grab(spanmembertype);
        limember.grab(memberinputtype);
        limember.grab(labelMemberDefaultValue);
        limember.grab(inputMemberDefaultValue);

        limethods.grab(spanmethodsname);
        limethods.grab(selectmethods);
        limethods.grab(selectoptionsdivmethods);
        limethods.grab(methodlabelname);
        limethods.grab(methodinputname);
        limethods.grab(labelMethodVisibility);
        limethods.grab(selectMethodVisibility);
        limethods.grab(labelMethodAdditionalProperties);
        limethods.grab(selectPropertiesMethod);
        limethods.grab(labelMethodParameter);
        limethods.grab(inputMethodParameter);

        
        limethods.grab(methodlabelreturn);
        limethods.grab(methodinputreturn);

        targetul.grab(lioptions);
        targetul.grab(ligeneral);
        targetul.grab(limember);
        targetul.grab(limethods);

    },

    /**
    * Konvertiert Objekt zu einem JSON-Objekt.
    * @return {JSON} Json-Objekt der Assoziation.
    */
    toJSON: function() {
        var json = {
            "id": this.id,
            "name": this.name,
            "showShadow": this.showShadow,
            "shadow": this.classItem.shadow.getBBox(),
            "stereoTypeIndex": this.stereoTypeIndex,
            "visibilityClassIndex": this.visibilityClassIndex,
            "members": this.members,
            "methods": this.methods,
            "bbox": this.classItem.getBBox()
        };
        
        return json;
    },


});