const express = require('express');
const mysql = require("mysql");
const path = require("path");

const app = express();

// Conexión a la base de datos MySQL
let conexion = mysql.createConnection({
    host: "localhost",
    database: "database_pruebas",
    user: "root",
    password: "31540230"
});

// Configuración del servidor y vistas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Ruta para renderizar el formulario
app.get("/", (req, res) => {
    res.render("formularioEletricidad");
});

// Ruta para recibir datos del formulario y guardar en MySQL
app.post("/enviar-formulario", (req, res) => {
    const datosFormulario = req.body;

    // Consulta para insertar datos en la base de datos
    const query = "INSERT INTO respuestas (nom, apell, correo, tel, preg1, preg2, preg3, preg4, preg5, preg6, preg7, preg8, preg9, preg10, final) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // Ejecución de la consulta con los datos recibidos
    conexion.query(query, [
        datosFormulario.nom,
        datosFormulario.apell,
        datosFormulario.correo,
        datosFormulario.tel,
        datosFormulario.preg1,
        datosFormulario.preg2,
        datosFormulario.preg3,
        datosFormulario.preg4,
        datosFormulario.preg5,
        datosFormulario.preg6,
        datosFormulario.preg7,
        datosFormulario.preg8,
        datosFormulario.preg9,
        datosFormulario.preg10,
        datosFormulario.final
    ], (err, result) => {
        if (err) {
            console.error("Error al guardar en MySQL:", err);
            res.status(500).send("Error al guardar en la base de datos.");
        } else {
            res.send("Datos enviados correctamente.");
        }
    });
});

// Iniciar el servidor en el puerto 4000
app.listen(4000, () => {
    console.log('Servidor funcionando en http://localhost:4000');
});
