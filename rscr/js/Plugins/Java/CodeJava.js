
/**
* Plug-In zur Generierung von Java-Code.
* @author Thobias Michel
*/
var CodeJava = new Class({
    Implements: CodeAbstract,

    /**
    * Generiert Quellcode anhand Meta-Klasse
    * @param {MetaClass} Meta-Klasse einer Klasse.
    * @return {String} Der generierte Quellcode.
    */
    generateCodeFromMetaClass: function(metaClass) {
        var code = "package unnamed;\n\n";
        code += "import java.util.*;\n\n";

        if (metaClass.Visibility.length > 0) {
            code += metaClass.Visibility + " ";
        }

        code += "class " + metaClass.Name + " ";

        var setextends = false;
        for (var i = 0; i < metaClass.Extends.length; i++) {
           
            if (!setextends) {
                code += "extends";
                setextends = true;
            }
            if (i > 0)
                code += ",";
            code += " " + metaClass.Extends[i].Name;
        }

        var setimplements = false;
        for (var i = 0; i < metaClass.Implements.length; i++) {
            
            if (!setimplements) {
                code += " implements";
                setimplements = true;
            }
            if (i > 0)
                code += ",";
            code += " " + metaClass.Implements[i].Name;
        }

        code += " {\n";

        for (var i = 0; i < metaClass.Members.length; i++) {
            if (metaClass.Members[i].Type.substr(0, 1) == "{") {
                code += "\t" + metaClass.Members[i].Visibility + " ArrayList<" + metaClass.Members[i].Type.substr(1, metaClass.Members[i].Type.length - 2) + "> " + metaClass.Members[i].Name + " = new ArrayList<" + metaClass.Members[i].Type.substr(1, metaClass.Members[i].Type.length - 2) + ">()";
            }
            else if (metaClass.Members[i].Type.substr(0, 1) == "[") {
                code += "\t" + metaClass.Members[i].Visibility + " " + metaClass.Members[i].Type.substr(1, metaClass.Members[i].Type.length - 2) + "[] " + metaClass.Members[i].Name + " = new " + metaClass.Members[i].Type.substr(1, metaClass.Members[i].Type.length - 2) + "[" + metaClass.Members[i].Default + "]";
            }
            else {
                code += "\t" + metaClass.Members[i].Visibility + " " + metaClass.Members[i].AdditionalProperties + " " + metaClass.Members[i].Type + " " + metaClass.Members[i].Name;
                if (metaClass.Members[i].Default.length > 0)
                    code += " = " + metaClass.Members[i].Default;
            }
            
            code += ";\n";
        }

        for (var i = 0; i < metaClass.Methods.length; i++) {
            code += "\t" + metaClass.Methods[i].Visibility;
            if (metaClass.Methods[i].AdditionalProperties.length > 0) {
                code += " " + metaClass.Methods[i].AdditionalProperties;
            }

            if (metaClass.Methods[i].Return.length == 0)
                code += " void";
            else {
                code += " " + metaClass.Methods[i].Return;
            }

            if (metaClass.Methods[i].Name.length == 0)
                code += " Empty";
            else {
                code += " " + metaClass.Methods[i].Name;
            }
            code += "(";

            var content = "";

            if (metaClass.Methods[i].Parameter.length > 0) {
                code += metaClass.Methods[i].Parameter;
            }
            
            if (metaClass.Methods[i].Type != null) {
                if (metaClass.Methods[i].Type == "Aggregation") {
                    content = "\n\t\t";
                    content += "return this." + metaClass.Methods[i].Return + ";";
                    content += "\n\t";
                } else if (metaClass.Methods[i].Type == "Komposition") {
                    content = "\n\t\t";
                    content += "return this." + metaClass.Methods[i].Return + ";";
                    content += "\n\t";
                }
            }

            code += "){" + content + "}\n";
        }

        code += "}";
        return code;
    },

    /**
    * Anzeige des generierten Quellcodes.
    * @param {metaClass} Meta-Klasse einer Klasse.
    * @return {Object} Liste von Dateien.
    */
    showCode: function (metaClass) {
        this.host.gui.updateCodeArea(this.generateCodeFromMetaClass(metaClass), "java");
    },
    
    saveCodeToZip: function (metaClasses) {
        var files = new Array();

        for (var i = 0; i < metaClasses.length; i++) {
            files.push({
                Name: metaClasses[i].Name + ".java",
                Content: this.generateCodeFromMetaClass(metaClasses[i])
            });
        }
        return files;
    }
});
