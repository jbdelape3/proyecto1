from Estructuras.Lista_De_Contactos import ListaDeContactos

contactos = ListaDeContactos()

contactos.agregar_contacto(
    "Juan",
    "3001234567",
    "juan@ejemplo.com",
    "Calle 50 #50-20"
)

contactos.agregar_contacto(
    "Maria",
    "3009876543",
    "maria@ejemplo.com",
    "Calle 60 #60-30"
)

contactos.agregar_contacto(
    "Carlos",
    "3011111111",
    "carlos@ejemplo.com",
    "Calle 70 #70-40"
)


actual = contactos.cabeza
while actual is not None:
    print(actual)
    actual = actual.siguiente
