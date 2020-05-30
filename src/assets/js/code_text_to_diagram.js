var myDiagram;
var tree;

function getGojsNodeByText(text) {
    if (text != null) {
        var replacedText = text.replace("//", "");
        for (var i = 0; i < myDiagram.model.uc.length; i++) {
            if (replacedText == myDiagram.model.uc[i].text + " ") {
                return myDiagram.model.uc[i];
            }
        }
    }
}

function initFromText() {
    // creamos el tablero
    var $ = go.GraphObject.make;
    myDiagram =
        $(go.Diagram, "DiagramDiv", {
            isReadOnly: true,
            layout: $(go.TreeLayout, // el diagrama se muestra en forma de árbol
                { angle: 90, layerSpacing: 35 })
        });

    var myModel = $(go.Model);

    var activityTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Rectangle",
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 6, font: "18px sans-serif", editable: true, isMultiline: false }, // el atributo editable permite editar el texto de los nodos
                new go.Binding("text", "text").makeTwoWay()) //makeTwoWay se utiliza para que el texto al ser modificado se modifique también el atributo text
        );

    var sentenceTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "RoundedRectangle",
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 6, font: "18px sans-serif", editable: true, isMultiline: false }, // el atributo editable permite editar el texto de los nodos
                new go.Binding("text", "text").makeTwoWay()) //makeTwoWay se utiliza para que el texto al ser modificado se modifique también el atributo text
        );

    var loopTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Ellipse",
                new go.Binding("fill", "color")),
            $(go.Panel, "Horizontal", { margin: 2 },
                $(go.TextBlock, { editable: true, font: "18px sans-serif" },
                    new go.Binding("text").makeTwoWay())
            )
        );

    var ConditionTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Diamond",
                new go.Binding("fill", "color")),
            $(go.Panel, "Horizontal", { margin: 2 },
                $(go.TextBlock, { editable: true, font: "18px sans-serif" },
                    new go.Binding("text").makeTwoWay())
            )
        );

    var FunctionTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "TriangleUp",
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 6, font: "18px sans-serif", editable: true, isMultiline: false }, // el atributo editable permite editar el texto de los nodos
                new go.Binding("text", "text").makeTwoWay()) //makeTwoWay se utiliza para que el texto al ser modificado se modifique también el atributo text
        );

    var templmap = new go.Map();
    templmap.add("Actividad", activityTemplate);
    templmap.add("Sentencia", sentenceTemplate);
    templmap.add("Loop", loopTemplate);
    templmap.add("Condition", ConditionTemplate);
    templmap.add("Function", FunctionTemplate);
    myDiagram.nodeTemplateMap = templmap;

    myDiagram.linkTemplate =
        $(go.Link, { routing: go.Link.Orthogonal, corner: 5 },
            $(go.Shape, { strokeWidth: 3, stroke: "#555" }));


    myDiagram.model = new go.TreeModel([
        { key: "Algoritmo", color: "#3d6fa0", text: "Algoritmo", group: "Actividades", son: 0, category: "Actividad" },
        { key: "Entrada", parent: "Algoritmo", color: "lightblue", text: "Entrada", group: "Actividades", son: 1, category: "Actividad" },
        { key: "Desarrollo", parent: "Algoritmo", color: "lightblue", text: "Desarrollo", group: "Actividades", son: 1, category: "Actividad" },
        { key: "Salida", parent: "Algoritmo", color: "lightblue", text: "Salida", group: "Actividades", son: 1, category: "Actividad" },
    ]);

    oldCode = document.getElementById("code").value;
    oldLines = oldCode.split("\n");
    enableTab('code');

    tree = { value: "Algoritmo", text: "Algoritmo", children: [] };
    tree.children.push({ value: "Entrada", group: "Actividad", text: "Entrada", son: 1, children: [] });
    tree.children.push({ value: "Desarrollo", group: "Actividad", text: "Desarrollo", son: 1, children: [] });
    tree.children.push({ value: "Salida", group: "Actividad", text: "Salida", son: 1, children: [] }); //creo la que será la estructura principal del árbol que servirá para realizar imprimir el código
}

function enableTab(id) { //Función que permite añadir "tabulaciones" en el código
    var el = document.getElementById(id);
    el.onkeydown = function(e) {
        if (e.keyCode === 9) {
            var val = this.value,
                start = this.selectionStart,
                end = this.selectionEnd;
            this.value = val.substring(0, start) + '\t' + val.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
            return false;

        }
    };
}

function changeDiagram() { //cambia el diagrama cuando el código cambie
    var code = document.getElementById("code").value;
    var lines = code.split("\n");
    var text = [];
    var parent;

    const count = (str) => { //función que cuenta cuantas tabulaciones se han hecho en un string
        const re = /\t/g;
        return ((str || '').match(re) || []).length;
    }

    for (var i = 0; i < lines.length; i++) //obtengo en un array el texto sin tabulaciones de cada línea
    {
        var completeText = "";
        for (var j = 0; j < lines[i].split(/\s/).length; j++) {
            if (lines[i].split(/\s/)[j].length > 0) {
                completeText += lines[i].split(/\s/)[j] + " ";
            }
        }
        text.push(completeText);
    }

    myDiagram.model = new go.TreeModel([
        { key: "Algoritmo", color: "#3d6fa0", text: "Algoritmo", group: "Actividades", son: 0, category: "Actividad" },
        { key: "Entrada", parent: "Algoritmo", color: "lightblue", text: "Entrada", group: "Actividades", son: 1, category: "Actividad" },
        { key: "Desarrollo", parent: "Algoritmo", color: "lightblue", text: "Desarrollo", group: "Actividades", son: 1, category: "Actividad" },
        { key: "Salida", parent: "Algoritmo", color: "lightblue", text: "Salida", group: "Actividades", son: 1, category: "Actividad" },
    ]);

    for (var i = 0; i < text.length; i++) {
        if (text[i] != "//Algoritmo " && text[i] != "//Entrada " && text[i] != "//Desarrollo " && text[i] != "//Salida ") {

            var j = i;
            var found = false;
            while (j > 0 && found == false) {
                if (count(lines[i]) > count(lines[j])) {
                    parent = text[j];
                    found = true;
                }
                j--;
            }

            if (parent != "//Algoritmo " && parent != "//Entrada " && parent != "//Desarrollo " && parent != "//Salida ") {
                parent = parent + " ";
            }

            console.log(parent);
            var parentText;
            parentText = getGojsNodeByText(parent);
            if (parentText != null) {
                parentText = parentText.text;
            }




            if (text[i].split("//")[0] == "") {
                var replacedText = text[i].replace("//", "");
                var node = { key: replacedText, parent: parentText, color: "#dca85c", text: replacedText, group: "Actividades", category: "Actividad" };
            } else if (text[i].split("if")[0] == "") {
                var node = { key: text[i], parent: parentText, color: "#dc727c", text: text[i], group: "Actividades", category: "Condition" };
            } else if (text[i].split("for")[0] == "") {
                var node = { key: text[i], parent: parentText, color: "#dc727c", text: text[i], group: "Actividades", category: "Loop" }
            } else {
                var node = { key: text[i], parent: parentText, color: "#5ad170", text: text[i], group: "Sentencias", category: "Sentencia" };
            }

            if (node != null) {
                myDiagram.model.addNodeData(node);
            }
        }
    }

    oldCode = code;
    oldLines = lines;
}


document.addEventListener("DOMContentLoaded", init, false);