// función que adecua la ventana de creación de diagramas al diagrama a editar
var url;
var database;
var username;

function edit(db, name, user) {
    let nameFormat = decodeURI(name);
    let input = document.getElementById("diagramName");
    input.value = nameFormat;
    input.readOnly = true;
    input.style = " background-color: rgb(192, 192, 192, 0.7)";

    db.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.id == user) {
                const diagrams = doc.data().diagrams;
                for (let i = 1; i < diagrams.length; i++) {
                    if (diagrams[i].diagramName == nameFormat) {
                        init(diagrams[i].diagram, true, diagrams[i].code);
                    }
                }
            }
        });
    });

}

// función que ayuda al botón de borrar diagrama a llamar a la función de borrado
function change(del, route, db, user) {
    url = route[3];
    database = db;
    username = user;
    del.setAttribute("onclick", "deleteDiag()");
}

function deleteDiag(route) {
    database.collection("users").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.id == username) {
                const diagrams = doc.data().diagrams;
                const allDiagrams = doc.data().diagrams;
                for (let i = 1; i < diagrams.length; i++) {
                    let nameFormat = url.replace("%20", " ");
                    if (diagrams[i].diagramName == nameFormat) {
                        allDiagrams.splice(diagrams[i], 1); //borramos el anterior diagrama guardado
                        database.collection("users").doc(username).update({
                            diagrams: allDiagrams
                        });
                        window.alert("El diagrama " + diagrams[i].diagramName + " ha sido eliminado");
                    }
                }
            }
        });
    });
}