
/* =========================================================
   FORMULARIO DE CONTACTO
   CRISTO VIVE – SULLANA
========================================================= */

const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");

if (contactForm) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correo").value.trim();
        const asunto = document.getElementById("asunto").value;
        const mensaje = document.getElementById("mensaje").value.trim();

        const botonEnviar = contactForm.querySelector(
            'button[type="submit"]'
        );

        // Validación básica
        if (!nombre || !correo || !asunto || !mensaje) {
            contactMessage.textContent =
                "Por favor, completa todos los campos.";

            contactMessage.className = "admin-message error";
            return;
        }

        if (
            nombre.length < 2 || nombre.length > 100 ||
            correo.length < 5 || correo.length > 254 ||
            asunto.length < 2 || asunto.length > 100 ||
            mensaje.length < 5 || mensaje.length > 5000
        ) {
            contactMessage.textContent =
                "Revisa los datos. Algunos campos tienen una longitud no válida.";

            contactMessage.className = "admin-message error";
            return;
        }

        // Evitar envíos repetidos
        botonEnviar.disabled = true;
        botonEnviar.innerHTML = "Enviando...";

        contactMessage.textContent = "Enviando tu mensaje...";
        contactMessage.className = "admin-message";

        try {

            // 1. Guardar el mensaje en Supabase
            const { error: errorRegistro } = await supabaseClient
                .from("mensajes_contacto")
                .insert([
                    {
                        nombre,
                        correo,
                        asunto,
                        mensaje
                    }
                ]);

            if (errorRegistro) {
                throw errorRegistro;
            }

            // 2. Solicitar el envío de la notificación
            const { data, error: errorNotificacion } =
                await supabaseClient.functions.invoke(
                    "notificar-contacto",
                    {
                        body: {
                            nombre,
                            correo,
                            asunto,
                            mensaje
                        }
                    }
                );

            if (errorNotificacion) {
                console.error(
                    "Mensaje guardado, pero falló la notificación:",
                    errorNotificacion
                );

                contactMessage.textContent =
                    "Tu mensaje fue recibido correctamente, pero no pudimos enviar la notificación por correo.";

                contactMessage.className = "admin-message success";

                contactForm.reset();
                return;
            }

            console.log("Notificación:", data);

            contactMessage.textContent =
                "¡Tu mensaje se ha enviado correctamente! Gracias por escribirnos.";

            contactMessage.className = "admin-message success";

            contactForm.reset();

        } catch (error) {

            console.error("Error al guardar el mensaje:", error);

            contactMessage.textContent =
                "No pudimos guardar tu mensaje. Inténtalo nuevamente.";

            contactMessage.className = "admin-message error";

        } finally {

            botonEnviar.disabled = false;

            botonEnviar.innerHTML =
                '<i class="bx bx-send"></i> Enviar mensaje';

        }

    });

}
