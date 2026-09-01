from flask import Flask, render_template, request
from Estructuras.Lista_De_Contactos import ListaDeContactos

app = Flask(__name__)
contactos = ListaDeContactos()

@app.route("/", methods=["GET", "POST"])
def inicio():
    if request.method == "POST":
        nombre = request.form["nombre"]
        telefono = request.form["telefono"]
        correo = request.form["correo"]
        direccion = request.form["direccion"]
        
        contactos.agregar_contacto(
            nombre,
            telefono,
            correo,
            direccion
        )
        contactos.mostrar_contactos()  # Mostrar contactos en la consola para verificar
    return render_template("index.html")
if __name__ == "__main__":
    app.run(debug=True)