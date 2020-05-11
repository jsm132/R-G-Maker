// función que adecua la ventana de creación de diagramas al diagrama a editar
function edit(db, name, user) {
    let nameFormat = name.replace("%20", " ");
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
                        console.log(diagrams[i].diagram);
                        init(diagrams[i].diagram, true);
                    }
                }
            }
        });
    });

}