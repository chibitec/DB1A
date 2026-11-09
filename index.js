//llamar a dotenv
require("dotenv").config();
const app = require("./src/app.js");

//Encriptar el servidor en el puerto 3000

const PORT = process.env.PORT;
//iniciar el servidor
app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto 3000");
});
