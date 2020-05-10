//crea un documento en firebase cuando un usuario se registra, que servirá para almacenar todos los datos necesarios de este.
function reg(db, email) {
    db.collection("users").doc(email).set({
        diagrams: [{ diagramName: "", diagram: [] }]
    })
}

function load(db, user) {
    const diagramDiv = document.getElementById("diagrams");
    // Con esto obtenemos todos los datos de los documentos de firebase
    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.id == user) {
                const diagrams = doc.data().diagrams;
                for (let i = 0; i < diagrams.length; i++) {
                    let innerDiagram = document.createElement("div");
                    innerDiagram.style = " margin: auto; position:relative; width:90%; height:160px; background-color: #DAE4E4;"

                    let div = document.createElement("div");
                    div.style = ' height: 200px; margin-left: 200px; display: inline-block; width: 25%; margin-top: 20px; margin-left: 20px; overflow: hidden; border-radius: 10px; box-shadow: 0px 1px 10px rgba(0, 0, 0, .5); text-align: center; transition-duration: 0.4s;';
                    div.innerHTML = diagrams[i].diagramName;
                    div.appendChild(innerDiagram);
                    diagramDiv.appendChild(div);
                }
            }
        });
    });
}

// functión auxiliar para la funciçon store
function auxStore(db, user, allDiagrams) {

    const name = document.getElementById("diagramName").value;

    if (name != null && name != "") {
        const mio = { diagramName: name, diagram: myDiagram.model.uc };

        allDiagrams.push(mio);
        console.log(allDiagrams);
        db.collection("users").doc(user).update({
            diagrams: allDiagrams
        });

        window.alert("Diagrama creado con el nombre: " + name);
    } else {
        window.alert("Especifique un nombre para el diagrama");
    }
}

// función que almacena los diagramas del usuarios en la base de datos.
function store(db, user) {

    let data;
    data = db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.id == user) {
                auxStore(db, user, doc.data().diagrams);
            }
        });
    });

    /*var diagram = [{ "key": "Algoritmo", "color": "#3d6fa0", "text": "Algoritmo", "group": "Actividades", "son": 0, "category": "Actividad", "__gohashid": 573 }, { "key": "Entrada", "parent": "Algoritmo", "color": "lightblue", "text": "Entrada", "group": "Actividades", "son": 1, "category": "Actividad", "__gohashid": 574 }, { "key": "Desarrollo", "parent": "Algoritmo", "color": "lightblue", "text": "Desarrollo", "group": "Actividades", "son": 1, "category": "Actividad", "__gohashid": 575 }, { "key": "Salida", "parent": "Algoritmo", "color": "lightblue", "text": "Salida", "group": "Actividades", "son": 1, "category": "Actividad", "__gohashid": 576 }, { "key": "Actividad1", "parent": "Entrada", "color": "#dca85c", "text": "Actividad1", "son": 2, "group": "Actividades", "category": "Actividad", "__gohashid": 781 }, { "key": "Sentencia1", "parent": "Desarrollo", "color": "#5ad170", "text": "Sentencia1", "son": 2, "group": "Sentencias", "category": "Sentencia", "__gohashid": 913 }, { "key": "Actividad2", "parent": "Salida", "color": "#dca85c", "text": "Actividad2", "son": 2, "group": "Actividades", "category": "Actividad", "__gohashid": 1131 }, { "key": "Actividad3", "parent": "Salida", "color": "#dca85c", "text": "Actividad3", "son": 2, "group": "Actividades", "category": "Actividad", "__gohashid": 1327 }]


    // cargamos los datos del diagrama en el diagrama de gojs
    myDiagram.model = new go.TreeModel;
    for (var i = 0; i < diagram.length; i++) {
        myDiagram.model.addNodeData(diagram[i]);
    }*/
}