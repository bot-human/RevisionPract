document.getElementById('formulario').addEventListener('submit', function(e) {
    e.preventDefault();

    // Reemplaza con la URL de tu script de Google Apps Script
    const url = 'https://script.google.com/macros/s/AKfycbz-XnlhqoU8KNCFR38D73qLuLanvW8j8Sv63uQEk3Zfe3KNO-ihPN1Fo1RnhCBEMV1gzQ/exec'; 
    const datos = {
        nom: document.getElementById('nom').value,
        apell: document.getElementById('apell').value,
        correo: document.getElementById('correo').value,
        tel: document.getElementById('tel').value,
        preg1: document.querySelector('input[name="preg1"]:checked').value,
        preg2: document.querySelector('input[name="preg2"]:checked').value,
        preg3: document.querySelector('input[name="preg3"]:checked').value,
        preg4: document.querySelector('input[name="preg4"]:checked').value,
        preg5: document.querySelector('input[name="preg5"]:checked').value,
        preg6: document.querySelector('input[name="preg6"]:checked').value,
        preg7: document.querySelector('input[name="preg7"]:checked').value,
        preg8: document.querySelector('input[name="preg8"]:checked').value,
        preg9: document.querySelector('input[name="preg9"]:checked').value,
        preg10: document.querySelector('input[name="preg10"]:checked').value,
        final: document.querySelector('input[name="final"]:checked').value
    };

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "Success") {
            alert('¡Formulario enviado exitosamente!');
        } else {
            alert('Error al enviar el formulario.');
        }
    })
    .catch(error => console.error('Error:', error));
});

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");

    // Respuestas correctas del cuestionario
    const respuestasCorrectas = {
        preg1: "opcionC",
        preg2: "opcionA",
        preg3: "opcionC",
        preg4: "opcionA",
        preg5: "opcionA",
        preg6: "opcionC",
        preg7: "opcionB",
        preg8: "opcionB",
        preg9: "opcionA",
        preg10: "opcionB"
    };

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const respuestasUsuario = {};
        let formularioCompleto = true;

        // Captura y validación de respuestas del usuario
        for (let i = 1; i <= 10; i++) {
            const respuesta = document.querySelector(`input[name="preg${i}"]:checked`);
            if (respuesta) {
                respuestasUsuario[`preg${i}`] = respuesta.value;
            } else {
                formularioCompleto = false;
                alert(`Por favor, responde la pregunta ${i}.`);
                break;
            }
        }

        // Validación de pregunta final
        if (formularioCompleto) {
            const comprobacionFinal = document.querySelector(`input[name="final"]:checked`);
            if (comprobacionFinal) {
                respuestasUsuario.final = comprobacionFinal.value;
            } else {
                formularioCompleto = false;
                alert("Por favor, responde la pregunta final.");
            }
        }

        // Validación de campos de datos personales
        if (formularioCompleto) {
            respuestasUsuario.nom = document.getElementById("nom").value.trim();
            respuestasUsuario.apell = document.getElementById("apell").value.trim();
            respuestasUsuario.correo = document.getElementById("correo").value.trim();
            respuestasUsuario.tel = document.getElementById("tel").value.trim();

            if (!respuestasUsuario.nom || !respuestasUsuario.apell || !respuestasUsuario.correo || !respuestasUsuario.tel) {
                formularioCompleto = false;
                alert("Por favor, completa todos los datos personales.");
            }
        }

        // Si todas las validaciones pasan, procede con la evaluación
        if (formularioCompleto) {
            // Calcular el puntaje
            let puntaje = 0;
            for (let pregunta in respuestasCorrectas) {
                if (respuestasUsuario[pregunta] === respuestasCorrectas[pregunta]) {
                    puntaje += 1;
                }
            }
            // Agregar el puntaje a las respuestas
            respuestasUsuario.puntaje = puntaje;

            // Enviar las respuestas a Google Sheets y al servidor
            fetch("https://script.google.com/macros/s/AKfycbz-XnlhqoU8KNCFR38D73qLuLanvW8j8Sv63uQEk3Zfe3KNO-ihPN1Fo1RnhCBEMV1gzQ/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(respuestasUsuario),
            })
            .then(response => response.text())
            .then(data => {
                console.log("Respuesta de Google Sheets:", data);
                // Enviar los mismos datos a nuestro servidor para almacenar en MySQL
                return fetch("http://localhost:4000/enviar-formulario", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(respuestasUsuario),
                });
            })
            .then(response => response.text())
            .then(data => {
                console.log("Respuesta del servidor local:", data);
                alert("Respuestas enviadas correctamente a ambos destinos.");
            })
            .catch(error => {
                console.error("Error al enviar las respuestas:", error);
            });
        }
    });

});
