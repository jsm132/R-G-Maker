//crea un documento en firebase cuando un usuario se registra, 
//que servirá para almacenar todos los datos necesarios de este.
function reg(db, email) {
    db.collection("users").doc(email).set({
        diagrams: [{ diagramName: "", diagram: [], code: [] }]
    })
}

//función que se encarga de crear la miniatura de los diagramas almacenados
function thumbnail(id, model, isThumbnail) {
    var $ = go.GraphObject.make;

    if (isThumbnail) {
        myDiagram =
            $(go.Diagram, id, {
                layout: $(go.TreeLayout, // el diagrama se muestra en forma de árbol
                    { angle: 90, layerSpacing: 35 })
            });
    }

    myDiagram.linkTemplate =
        $(go.Link, { routing: go.Link.Orthogonal, corner: 5 },
            $(go.Shape, { strokeWidth: 3, stroke: "#555" }));

    var activityTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Rectangle",
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 6, font: "18px sans-serif", editable: false, isMultiline: false },
                new go.Binding("text", "text").makeTwoWay())

        );

    var sentenceTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "RoundedRectangle",
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 6, font: "18px sans-serif", editable: false, isMultiline: false },
                new go.Binding("text", "text").makeTwoWay()),
        );

    var loopTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Ellipse",
                new go.Binding("fill", "color")),
            $(go.Panel, "Horizontal", { margin: 2 },
                $(go.TextBlock, "for (", { font: "18px sans-serif" }),
                $(go.TextBlock, { editable: false, font: "18px sans-serif" },
                    new go.Binding("text").makeTwoWay()),
                $(go.TextBlock, ")", { font: "18px sans-serif" })
            )
        );

    var ConditionTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "Diamond",
                new go.Binding("fill", "color")),
            $(go.Panel, "Horizontal", { margin: 2 },
                $(go.TextBlock, "if (", { font: "18px sans-serif" }),
                $(go.TextBlock, { editable: false, font: "18px sans-serif" },
                    new go.Binding("text").makeTwoWay()),
                $(go.TextBlock, ")", { font: "18px sans-serif" })
            )
        );

    var FunctionTemplate =
        $(go.Node, "Auto",
            $(go.Shape, "TriangleUp",
                new go.Binding("fill", "color")),
            $(go.TextBlock, { margin: 6, font: "18px sans-serif", editable: false, isMultiline: false },
                new go.Binding("text", "text").makeTwoWay())
        );

    var templmap = new go.Map();
    templmap.add("Actividad", activityTemplate);
    templmap.add("Sentencia", sentenceTemplate);
    templmap.add("Loop", loopTemplate);
    templmap.add("Condition", ConditionTemplate);
    templmap.add("Function", FunctionTemplate);
    myDiagram.nodeTemplateMap = templmap;

    if (isThumbnail) {
        myDiagram.initialScale = 0.65;
    }

    myDiagram.model = new go.TreeModel;
    for (var i = 0; i < model.length; i++) {
        myDiagram.model.addNodeData(model[i]);
    }
}

// función que se encarga de mostrar al usuario sus diagramas guardados
function load(db, user) {
    const diagramDiv = document.getElementById("diagrams");
    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.id == user) {
                const diagrams = doc.data().diagrams;
                for (let i = 1; i < diagrams.length; i++) {
                    let innerDiagram = document.createElement("div");
                    innerDiagram.style = " margin: auto; position:relative; width:90%; height:265px; background-color: #DAE4E4;"
                    innerDiagram.id = "dig" + i;

                    let div = document.createElement("div");
                    div.style = ' height: 300px; margin-left: 200px; display: inline-block; width: 25%;' +
                        'margin-top: 20px; margin-left: 20px; overflow: hidden; border-radius: 10px;' +
                        'box-shadow: 0px 1px 10px rgba(0, 0, 0, .5); text-align: center; transition-duration: 0.4s;';
                    // creamos un link que al pulsar en el nombre del diagrama almacenado nos lleve a la página de edición del mismo
                    div.innerHTML = "<a style=' color: #4CAF50;' routerLinkActive='router-link-active' " +
                        "ng-reflect-router-link='/createDiagram/edit' ng-reflect-router-link-active = 'router-link-active' " +
                        "href='/createDiagram/edit/" + diagrams[i].diagramName + "'>" + diagrams[i].diagramName + "</a>";
                    div.appendChild(innerDiagram);
                    diagramDiv.appendChild(div);
                    thumbnail("dig" + i, diagrams[i].diagram, true);
                }
            }
        });
    });
}

// función auxiliar para la función store
function auxStore(db, user, allDiagrams, route) {

    const name = document.getElementById("diagramName").value;
    const codelabel = getTree();
    if (name != null && name != "") {
        const mio = { diagramName: name, diagram: myDiagram.model.uc, code: codelabel };

        // se encarga de editar el diagrama si estamos en la página de edición
        if (route[2] == "edit") {
            db.collection("users").get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (doc.id == user) {
                        const diagrams = doc.data().diagrams;
                        for (let i = 1; i < diagrams.length; i++) {
                            let nameFormat = route[3].replace("%20", " ");
                            if (diagrams[i].diagramName == nameFormat) {
                                allDiagrams.splice(diagrams[i], 1); //borramos el anterior diagrama guardado
                                allDiagrams.push(mio); // y añadimos el nuevo diagrama editado
                                db.collection("users").doc(user).update({
                                    diagrams: allDiagrams
                                });
                            }
                        }
                    }
                });
            });
            window.alert("El diagrama " + name + " ha sido editado con éxito");
        } else {
            allDiagrams.push(mio);
            db.collection("users").doc(user).update({
                diagrams: allDiagrams
            });
            window.alert("Diagrama creado con el nombre: " + name);
        }
    } else {
        window.alert("Especifique un nombre para el diagrama");
    }
}

// función que almacena los diagramas del usuarios en la base de datos.
function store(db, user, route) {
    let data;
    data = db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.id == user) {
                auxStore(db, user, doc.data().diagrams, route);
            }
        });
    });
}