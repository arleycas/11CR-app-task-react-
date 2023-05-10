Relación entre autenticación y JWT.

1- Iniciar sesión con uno de los usuarios: http://localhost:4000/api/usuario/v1/login (NOTA: Ambas claves son 9900)
1.1- Al iniciar sesión se genera un JWT de esa sesión y la petición nos devuelve ese JWT. Ese JWT tiene de
info: id de user, hora de logueo y tiempo de expiracion del token (para decifrar que dice ingresar a https://jwt.io/ y meter el token ahí)
OJO: Ese JWT no se guarda en la DB (solo se genera en la petición), no confundir con la propiedad token de DB que es para cuando se olvida contraseña

2. Los endpoints que tengan como middleware "checkAuth" significa que requieren tener un JWT para poder usarlas

3. Para poder hacer estas peticiones en el postman hay que aparte de hacer la petición primero ingresar a la pestaña "Authorization" -> elegir
   "Bearer Token" y en el input de Token, meter todo el JWT que nos devolvió el logueo.
