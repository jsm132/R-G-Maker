var myDiagram;
var tree;
var activity = 1;
var sentence = 1;
var forLoop = 1;
var ifCond = 1;
var functionNumber = 1;
var code = "";

function getTree() {
    return tree;
}

function recursive(node) { //función que recorre el árbol recursivamente en preorden
    for (var i = 0; i < node.children.length; i++) {
        for (var j = 0; j < node.children[i].son; j++) {
            code += "&nbsp;&nbsp;&nbsp;&nbsp;";
        }
        if (node.children[i].group == "Actividad") {
            code += "//";
        }

        code += node.children[i].text + "<br>";

        if (node.children[i].children.length > 0) {
            recursive(node.children[i]);
        }
    }
}

function childLength(children) {
    var cont = 0;
    for (var i = 0; i < children.length; i++) {
        if (children[i] != null) {
            cont++;
        }
    }
    return cont;
}

function searchNode(node, oldText, newText) { //busca un nodo para cambiar su texto en el arbol

    for (var i = 0; i < node.children.length; i++) {
        switch (node.children[i].group) {
            case "Condition":
                if (node.children[i].innerText == oldText) {
                    node.children[i].text = "if(" + newText + ")";
                    node.children[i].innerText = newText;
                }
                break;
            case "Loop":
                if (node.children[i].innerText == oldText) {
                    node.children[i].text = "for(" + newText + ")";
                    node.children[i].innerText = newText;
                }
                break;
            default:
                if (node.children[i].text == oldText) {
                    node.children[i].text = newText;
                }
        }
        if (node.children[i].children.length > 0) {
            searchNode(node.children[i], oldText, newText);
        }
    }
}

function recursiveAddActivity(node, gojsNode) { //función que añade una actividad al árbol comprobando nodo a nodo de forma recursiva
    for (var i = 0; i < node.children.length; i++) {
        if (node.children[i].value == gojsNode.key) {
            var tab = gojsNode.son + 1;
            var auxNode = { value: "Actividad" + activity, group: "Actividad", text: "Actividad" + activity, son: tab, children: [] };

            node.children[i].children.push(auxNode);
            activity++;
        } else {
            if (node.children[i].children.length > 0) {
                recursiveAddActivity(node.children[i], gojsNode);
            }
        }
    }
}

function recursiveAddSentence(node, gojsNode) { //función que añade una sentencia al árbol comprobando nodo a nodo de forma recursiva
    if (node.value == gojsNode.key) {
        node.children.push({ value: "Sentencia" + sentence, text: "Sentencia" + sentence, children: [] });
        sentence++;
    } else {
        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].value == gojsNode.key) {
                var tab = gojsNode.son + 1;
                var auxNode = { value: "Sentencia" + sentence, group: "Sentencia", text: "Sentencia" + sentence, son: tab, children: [] };

                node.children[i].children.push(auxNode);
                sentence++;
            } else {
                if (node.children[i].children.length > 0) {
                    recursiveAddSentence(node.children[i], gojsNode);
                }
            }
        }
    }
}

function recursiveAddForLoop(node, gojsNode) {
    if (node.value == gojsNode.key) {
        node.children.push({ value: "for" + forLoop, text: "for (i = 0; i < 10; i++)", children: [] });
        forLoop++;
    } else {
        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].value == gojsNode.key) {
                var tab = gojsNode.son + 1;
                var newNode = { value: "for" + forLoop, group: "Loop", innerText: "i = 0; i < 10; i++", son: tab, children: [] }
                newNode.text = "for(" + newNode.innerText + ")";
                node.children[i].children.push(newNode);
                forLoop++;
            } else {
                if (node.children[i].children.length > 0) {
                    recursiveAddForLoop(node.children[i], gojsNode);
                }
            }
        }
    }
}

function recursiveAddIf(node, gojsNode) {
    if (node.value == gojsNode.key) {
        node.children.push({ value: "if" + ifCond, text: "if(true)", children: [] });
        ifCond++;
    } else {
        for (var i = 0; i < node.children.length; i++) {
            if (node.children[i].value == gojsNode.key) {
                var tab = gojsNode.son + 1;
                var newNode = { value: "if" + ifCond, group: "Condition", innerText: "true", son: tab, children: [] };
                newNode.text = "if(" + newNode.innerText + ")";
                node.children[i].children.push(newNode);

                ifCond++;
            } else {
                if (node.children[i].children.length > 0) {
                    recursiveAddIf(node.children[i], gojsNode);
                }
            }
        }
    }
}

function init(model, isEdit, editCode) {
    // creamos el tablero
    var $ = go.GraphObject.make;

    if (isEdit == false) {
        myDiagram =
            $(go.Diagram, "DiagramDiv", {
                layout: $(go.TreeLayout, // el diagrama se muestra en forma de árbol
                    { angle: 90, layerSpacing: 35 })
            });
    }

    var myModel = $(go.Model);

    var activityTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Rectangle",
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 6, font: "18px sans-serif", editable: true, isMultiline: false }, // el atributo editable permite editar el texto de los nodos
                new go.Binding("text", "text").makeTwoWay()), //makeTwoWay se utiliza para que el texto al ser modificado se modifique también el atributo text
            {
                contextMenu: //menú de click derecho
                    $("ContextMenu", //opciones del menú contextual
                    $("ContextMenuButton",
                        $(go.TextBlock, "Añadir Actividad"), { click: addActivity }),
                    $("ContextMenuButton",
                        $(go.TextBlock, "Añadir Sentencia"), { click: addSentence }),
                    $("ContextMenuButton",
                        $(go.TextBlock, "Actividad de condición"), { click: condition }),
                    $("ContextMenuButton",
                        $(go.TextBlock, "Actividad de repetición"), { click: iterator })
                )
            }
        );

    myDiagram.addDiagramListener("TextEdited", (e, obj) => {
        searchNode(tree, e.Fs, e.dt.Zb);
        updateCode();
    }); //cuando el texto de un nodo se edita se edita el código

    /* myDiagram.addDiagramListener("SelectionDeleted", (e, obj)=> {
         updateCode();
     }); //cuando se borra un nodo se edita el código*/


    var sentenceTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "RoundedRectangle",
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 6, font: "18px sans-serif", editable: true, isMultiline: true }, // el atributo editable permite editar el texto de los nodos
                new go.Binding("text", "text").makeTwoWay()), //makeTwoWay se utiliza para que el texto al ser modificado se modifique también el atributo text
            {
                contextMenu: //menú de click derecho
                    $("ContextMenu", //opciones del menú contextual
                    $("ContextMenuButton",
                        $(go.TextBlock, "Añadir Función"), { click: addFunction })
                )
            }
        );

    var loopTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Ellipse",
                new go.Binding("fill", "color")),
            $(go.Panel, "Horizontal", { margin: 2 }, {
                    contextMenu: //menú de click derecho
                        $("ContextMenu", //opciones del menú contextual
                        $("ContextMenuButton",
                            $(go.TextBlock, "Añadir Actividad"), { click: addActivity }),
                        $("ContextMenuButton",
                            $(go.TextBlock, "Añadir Sentencia"), { click: addSentence }),
                        $("ContextMenuButton",
                            $(go.TextBlock, "Actividad de condición"), { click: condition }),
                        $("ContextMenuButton",
                            $(go.TextBlock, "Actividad de repetición"), { click: iterator })
                    )
                },
                $(go.TextBlock, "for (", { font: "18px sans-serif" }),
                $(go.TextBlock, { editable: true, font: "18px sans-serif" },
                    new go.Binding("text").makeTwoWay()),
                $(go.TextBlock, ")", { font: "18px sans-serif" })
            )
        );

    var ConditionTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Diamond",
                new go.Binding("fill", "color")),
            $(go.Panel, "Horizontal", { margin: 2 }, {
                    contextMenu: //menú de click derecho
                        $("ContextMenu", //opciones del menú contextual
                        $("ContextMenuButton",
                            $(go.TextBlock, "Añadir Actividad"), { click: addActivity }),
                        $("ContextMenuButton",
                            $(go.TextBlock, "Añadir Sentencia"), { click: addSentence }),
                        $("ContextMenuButton",
                            $(go.TextBlock, "Actividad de condición"), { click: condition }),
                        $("ContextMenuButton",
                            $(go.TextBlock, "Actividad de repetición"), { click: iterator })
                    )
                },
                $(go.TextBlock, "if (", { font: "18px sans-serif" }),
                $(go.TextBlock, { editable: true, font: "18px sans-serif" },
                    new go.Binding("text").makeTwoWay()),
                $(go.TextBlock, ")", { font: "18px sans-serif" })
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


    if (model == null) {
        myDiagram.model = new go.TreeModel([
            { key: "Algoritmo", color: "#3d6fa0", text: "Algoritmo", group: "Actividades", son: 0, category: "Actividad" },
            { key: "Entrada", parent: "Algoritmo", color: "lightblue", text: "Entrada", group: "Actividades", son: 1, category: "Actividad" },
            { key: "Desarrollo", parent: "Algoritmo", color: "lightblue", text: "Desarrollo", group: "Actividades", son: 1, category: "Actividad" },
            { key: "Salida", parent: "Algoritmo", color: "lightblue", text: "Salida", group: "Actividades", son: 1, category: "Actividad" },
        ]);
    } else {
        myDiagram.model = new go.TreeModel;
        for (var i = 0; i < model.length; i++) {
            myDiagram.model.addNodeData(model[i]);
        }
    }

    /*var inspector = new Inspector('inspectorDiv', myDiagram, //crea un inspector para modificar propiedades de un nodo
        {
            includesOwnProperties: false,
            properties: {
              "text": { show: Inspector.showIfPresent }
            }
        });*/

    if (!isEdit) {
        tree = { value: "Algoritmo", text: "Algoritmo", children: [] };
        tree.children.push({ value: "Entrada", group: "Actividad", text: "Entrada", son: 1, children: [] });
        tree.children.push({ value: "Desarrollo", group: "Actividad", text: "Desarrollo", son: 1, children: [] });
        tree.children.push({ value: "Salida", group: "Actividad", text: "Salida", son: 1, children: [] });
        recursive(tree);
        updateCode(isEdit);
    } else {

        tree = editCode;
        updateCode(isEdit);
    }
}

function updateCode(isEdit) { //funcion que actualiza el código generado por el arbol
    var body = document.getElementById("codeLabelDiv");
    if (body != null) {
        if (body.querySelector("p") != null) {
            body.removeChild(body.querySelector("p"));
        }

        code = "//Algoritmo<br>";

        var codelabel = document.createElement("p");

        recursive(tree);
        codelabel.innerHTML = code;
        codelabel.id = "codeLabel";
        codelabel.style.position = "absolute";
        codelabel.style.left = "62%";
        codelabel.style.top = "8%";
        codelabel.style.fontFamily = "Calibri";
        codelabel.style.fontSize = "16px";

        body.appendChild(codelabel);
    }

}

function condition(e, obj) { //añade una if
    if (myDiagram.toolManager.contextMenuTool.currentObject.nb == null) {
        var currentObject = myDiagram.toolManager.contextMenuTool.currentObject.zg.nb;
    } else {
        var currentObject = myDiagram.toolManager.contextMenuTool.currentObject.nb;
    }
    var sonNumber = currentObject.son;
    sonNumber++;

    var node = { key: "if" + ifCond, parent: obj.part.key, color: "#dc727c", text: "true", son: sonNumber, group: "Actividades", category: "Condition" }; //añadimos un nodo cuyo padre sea el nodo desde el que se ha llamado
    myDiagram.model.addNodeData(node);
    recursiveAddIf(tree, currentObject);
    updateCode();
}

function iterator(e, obj) { //añade un for
    if (myDiagram.toolManager.contextMenuTool.currentObject.nb == null) {
        var currentObject = myDiagram.toolManager.contextMenuTool.currentObject.zg.nb;
    } else {
        var currentObject = myDiagram.toolManager.contextMenuTool.currentObject.nb;
    }
    var sonNumber = currentObject.son;
    sonNumber++;

    var node = { key: "for" + forLoop, parent: obj.part.key, color: "#dc727c", text: "i = 0; i < 10; i++", son: sonNumber, group: "Actividades", category: "Loop" }; //añadimos un nodo cuyo padre sea el nodo desde el que se ha llamado
    myDiagram.model.addNodeData(node);
    recursiveAddForLoop(tree, currentObject);
    updateCode();
}

function addActivity(event, obj) { //añade una actividad
    // obtenemos el nodo que llama a la función, e incrementamos su atributo "son" para que su hijo tenga un valor de son+1
    if (myDiagram.toolManager.contextMenuTool.currentObject.nb == null) {
        var currentObject = myDiagram.toolManager.contextMenuTool.currentObject.zg.nb;
    } else {
        var currentObject = myDiagram.toolManager.contextMenuTool.currentObject.nb;
    }
    var sonNumber = currentObject.son;
    sonNumber++;

    var node = { key: "Actividad" + activity, parent: obj.part.key, color: "#dca85c", text: "Actividad" + activity, son: sonNumber, group: "Actividades", category: "Actividad" }; //añadimos un nodo cuyo padre sea el nodo desde el que se ha llamado

    myDiagram.model.addNodeData(node);
    recursiveAddActivity(tree, currentObject);
    updateCode();
}

function addSentence(e, obj) //añade una sentencia
{
    if (myDiagram.toolManager.contextMenuTool.currentObject.nb == null) {
        var currentObject = myDiagram.toolManager.contextMenuTool.currentObject.zg.nb;
    } else {
        var currentObject = myDiagram.toolManager.contextMenuTool.currentObject.nb;
    }
    var sonNumber = currentObject.son;
    sonNumber++;

    var node = { key: "Sentencia" + sentence, parent: obj.part.key, color: "#5ad170", text: "Sentencia" + sentence, son: sonNumber, group: "Sentencias", category: "Sentencia" }; //añadimos un nodo cuyo padre sea el nodo desde el que se ha llamado
    myDiagram.model.addNodeData(node);
    recursiveAddSentence(tree, currentObject);
    updateCode();
}

function addFunction(e, obj) { //añade una función
    if (myDiagram.toolManager.contextMenuTool.currentObject.nb == null) {
        var currentObject = myDiagram.toolManager.contextMenuTool.currentObject.zg.nb;
    } else {
        var currentObject = myDiagram.toolManager.contextMenuTool.currentObject.nb;
    }
    var sonNumber = currentObject.son;
    sonNumber++;

    var node = { key: "Function" + functionNumber, parent: obj.part.key, color: "#d9bc9d", text: "Function" + functionNumber, son: sonNumber, group: "funciones", category: "Function" }; //añadimos un nodo cuyo padre sea el nodo desde el que se ha llamado
    myDiagram.model.addNodeData(node);
    updateCode();
}


document.addEventListener("DOMContentLoaded", init, false);