# jwt-login-generico
Este es un login muy generico hecho con Node.js, le permite al usuario: 
- Registrarse
- Loguearse
- Desloguearse
- Ver sus datos como usuario
- Cambiar su nombre de usuario
---
## ¿Como ejecutarlo?

Hay que crear un archivo .env (en la carpeta backend) que contenga los siguientes datos:
- ACCESS_TOKEN_SECRET
- PORT
- MONGODB_URI

Luego seguir los siguientes pasos:
- cd backend
- npm i (Instala las dependencias necesarias del package.json)
- npm run dev
- Disclaimer: Sin MongoDB NO VA A CORRER LA BASE DE DATOS.
