//crea un documento en firebase cuando un usuario se registra, que servirá para almacenar todos los datos necesarios de este.
function reg(db, email) {
    db.collection("users").doc(email).set({
        diagrams: [{ diagramName: "", diagram: [] }]
    })
}