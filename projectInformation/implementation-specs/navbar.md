# Screen Name

    Navbar

# 1. Screen Information

- Navbar
- /NA
- TBD
- Roles: Todos los usuarios que vean la página

# 2. Finalidad

    Generar accesibilidad para todos los usuarios de la aplicacion, ya sea que estén logueados o no

# 3. UI Reference

    ./screens/navbar-references.png

# 4. Layout / Estructura

    # Loged user

        <Logo>
        <Descubrir>
        <SearchBarGlobal>
        <Bandeja de entrada>
        <Perfil>

    # Unloged user

        <Logo>
        <Descubrir>
        <SearchBarGlobal>
        <Iniciar Sesión>
        <Registrarse>

# 5. Componentes Reutilizables

    <searchbarGlobal>

---

# 5. Funcionalidad

    Debe cargar en el servidor la estructura basica del navbar y utilizar framengts o suspense para aquellos elementos que necesiten espera como los botonrs de inicio de sesion en caso de no detectrar una sesion o el dropdown del usuario que habilita el submenu del usuario apra navegacion

# 6. Integración

# 7. Estados

    - Carga inicial(server)
    - partial rendering con suspense y fragments

# 8. Consideraciones

    El dropdown del perfil es solo para usuarios logueados, se debe manejar la logica de renderizado condicional y utilizar suspense para el manejo de carga.

    El dropdown va a contener las rutas de perfil, inbox, mis servicios, mis eventos, y cerrar sesion de momento

    Va a haber un boton a la derecha color primario con un plus icon que dirá crear, que redirigiría hacia la scren de /crear

# 9. Consideraciones de elementos del layout

Implementar segun:

    - projectInformation/domain/ubication.md
    - projectInformation/domain/categories.md
    . skills/react-clean-architecture.md
