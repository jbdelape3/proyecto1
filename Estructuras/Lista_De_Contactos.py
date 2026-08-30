class Contacto: # (Creamos el nodo de la lista enlazada para poder almacenar los contactos)
    def __init__(self, nombre, telefono, correo, direccion):
        self.nombre = nombre
        self.telefono = telefono
        self.correo = correo
        self.direccion = direccion
        self.siguiente = None
    def __str__(self):
        return f"Nombre: {self.nombre}, Telefono: {self.telefono}, Correo: {self.correo}, Direccion: {self.direccion}"
class ListaDeContactos: # (Creamos la lista enlazada para poder organizar los contactos)
    def __init__(self):
        self.cabeza = None
    def agregar_contacto(self, nombre, telefono, correo, direccion):
        nuevo = Contacto(nombre, telefono, correo, direccion)
        if self.cabeza is None:
            self.cabeza = nuevo
            return
        actual = self.cabeza
        while actual.siguiente is not None:
            actual =  actual.siguiente
        actual.siguiente = nuevo