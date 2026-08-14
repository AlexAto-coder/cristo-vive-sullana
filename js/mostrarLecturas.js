/* =========================================================
   CRISTO VIVE – SULLANA
   MOSTRAR LECTURAS DIARIAS
========================================================= */


/* =========================================================
   ELEMENTOS DE LA PÁGINA
========================================================= */

const mesSelect = document.getElementById("mesSelect");
const diaSelect = document.getElementById("diaSelect");
const readingContent = document.getElementById("readingContent");


/* =========================================================
   BUSCAR LECTURA
========================================================= */

function buscarLectura() {

    if (!mesSelect || !diaSelect || typeof contenidoLecturas === "undefined") {
        return null;
    }

    const mes = mesSelect.value;
    const dia = Number(diaSelect.value);

    return contenidoLecturas.find(function (item) {

        return (
            item.mes === mes &&
            item.dia === dia
        );

    }) || null;
}


/* =========================================================
   MOSTRAR PROGRAMACIÓN
========================================================= */

function crearProgramacion(lectura) {

    const contenedor = document.createElement("section");

    contenedor.classList.add("reading-section");

    contenedor.innerHTML = `
        <h2>📚 Programación del día</h2>
    `;

    const lista = document.createElement("div");

    lista.classList.add("reading-references");

    lectura.programacion.forEach(function (texto) {

        const referencia = document.createElement("div");

        referencia.classList.add("reading-reference");

        referencia.innerHTML = `
            <h3>${texto.referencia}</h3>
            <span class="bible-version">
                ${texto.version}
            </span>
        `;

        lista.appendChild(referencia);

    });

    contenedor.appendChild(lista);

    return contenedor;
}


/* =========================================================
   MOSTRAR VIDEO
========================================================= */

function crearVideo(lectura) {

    const contenedor = document.createElement("section");

    contenedor.classList.add("reading-section");

    contenedor.innerHTML = `
        <h2>🎥 Lectura en video</h2>
    `;


    if (
        lectura.video &&
        lectura.video.disponible &&
        lectura.video.youtubeId
    ) {

        const videoWrapper = document.createElement("div");

        videoWrapper.classList.add("reading-video");


        const iframe = document.createElement("iframe");

        iframe.src =
            `https://www.youtube.com/embed/${lectura.video.youtubeId}`;

        iframe.title = lectura.titulo;

        iframe.loading = "lazy";

        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";

        iframe.allowFullscreen = true;


        videoWrapper.appendChild(iframe);

        contenedor.appendChild(videoWrapper);

    } else {

        const pendiente = document.createElement("div");

        pendiente.classList.add("video-pending");

        pendiente.innerHTML = `
            <i class="bx bx-time-five"></i>

            <strong>
                Video próximamente
            </strong>

            <p>
                La lectura en video estará disponible
                próximamente.
            </p>
        `;

        contenedor.appendChild(pendiente);
    }


    return contenedor;
}


/* =========================================================
   MOSTRAR LECTURA BÍBLICA
========================================================= */

function crearLecturaEscrita(lectura) {

    const contenedor = document.createElement("section");

    contenedor.classList.add("reading-section");

    contenedor.innerHTML = `
        <h2>📖 Lectura bíblica</h2>
    `;


    lectura.programacion.forEach(function (texto) {

        const bloque = document.createElement("article");

        bloque.classList.add("bible-reading");


        const encabezado = document.createElement("div");

        encabezado.classList.add("bible-reading-header");


        encabezado.innerHTML = `
            <h3>${texto.referencia}</h3>

            <span class="bible-version">
                ${texto.version}
            </span>
        `;


        bloque.appendChild(encabezado);


        /* ==============================================
           COMPROBAR SI EXISTE EL TEXTO
        ============================================== */

        if (
            texto.texto &&
            texto.texto.trim() !== ""
        ) {

            const contenido =
                document.createElement("div");

            contenido.classList.add(
                "bible-text"
            );


            contenido.textContent =
                texto.texto;


            bloque.appendChild(contenido);

        } else {

            const pendiente =
                document.createElement("div");

            pendiente.classList.add(
                "bible-text-pending"
            );


            pendiente.innerHTML = `
                <i class="bx bx-book-open"></i>

                <strong>
                    Lectura próximamente
                </strong>

                <p>
                    El texto de esta lectura
                    será incorporado próximamente.
                </p>
            `;


            bloque.appendChild(pendiente);
        }


        contenedor.appendChild(bloque);

    });


    return contenedor;
}


/* =========================================================
   MOSTRAR MEDITACIÓN
========================================================= */

function crearMeditacion(lectura) {

    const contenedor =
        document.createElement("section");

    contenedor.classList.add("reading-section");


    contenedor.innerHTML = `
        <h2>📖 Meditación</h2>
    `;


    if (
        lectura.meditacion &&
        lectura.meditacion.disponible
    ) {

        const articulo =
            document.createElement("article");

        articulo.classList.add(
            "meditation"
        );


        /* CONTENIDO */

        const contenido =
            document.createElement("div");

        contenido.classList.add(
            "meditation-content"
        );


        contenido.textContent =
            lectura.meditacion.contenido;


        articulo.appendChild(contenido);


        /* AUTOR */

        if (
            lectura.meditacion.autor
        ) {

            const autor =
                document.createElement("div");

            autor.classList.add(
                "meditation-author"
            );


            autor.innerHTML = `
                <strong>
                    ✍️ Preparada por:
                </strong>

                <span>
                    ${lectura.meditacion.autor}
                </span>
            `;


            articulo.appendChild(autor);
        }


        /* FECHA */

        if (
            lectura.meditacion.fechaPublicacion
        ) {

            const fecha =
                document.createElement("div");

            fecha.classList.add(
                "meditation-date"
            );


            fecha.innerHTML = `
                <i class="bx bx-calendar"></i>

                Subida el
                ${lectura.meditacion.fechaPublicacion}
            `;


            articulo.appendChild(fecha);
        }


        /* AGRADECIMIENTO */

        if (
            lectura.meditacion.agradecimiento
        ) {

            const agradecimiento =
                document.createElement("div");

            agradecimiento.classList.add(
                "meditation-thanks"
            );


            agradecimiento.textContent =
                lectura.meditacion.agradecimiento;


            articulo.appendChild(
                agradecimiento
            );
        }


        contenedor.appendChild(
            articulo
        );

    } else {

        const pendiente =
            document.createElement("div");

        pendiente.classList.add(
            "meditation-pending"
        );


        pendiente.innerHTML = `
            <i class="bx bx-book-reader"></i>

            <strong>
                Meditación próximamente
            </strong>

            <p>
                Estamos preparando la meditación
                correspondiente a esta lectura.
            </p>
        `;


        contenedor.appendChild(
            pendiente
        );
    }


    return contenedor;
}


/* =========================================================
   MOSTRAR LECTURA COMPLETA
========================================================= */

function mostrarLectura() {

    if (!readingContent) {
        return;
    }


    const lectura =
        buscarLectura();


    readingContent.innerHTML = "";


    if (!lectura) {

        const mensaje =
            document.createElement("div");

        mensaje.classList.add(
            "reading-not-found"
        );


        mensaje.innerHTML = `
            <i class="bx bx-book-open"></i>

            <h2>
                Lectura no encontrada
            </h2>

            <p>
                Todavía no tenemos contenido
                para esta fecha.
            </p>
        `;


        readingContent.appendChild(
            mensaje
        );

        return;
    }


    /* ==============================================
       ENCABEZADO
    ============================================== */

    const encabezado =
        document.createElement("header");

    encabezado.classList.add(
        "reading-header"
    );


    const titulo =
        document.createElement("h1");

    titulo.textContent =
        lectura.titulo;


    encabezado.appendChild(
        titulo
    );


    readingContent.appendChild(
        encabezado
    );


    /* ==============================================
       PROGRAMACIÓN
    ============================================== */

    readingContent.appendChild(
        crearProgramacion(
            lectura
        )
    );


    /* ==============================================
       VIDEO
    ============================================== */

    readingContent.appendChild(
        crearVideo(
            lectura
        )
    );


    /* ==============================================
       LECTURA ESCRITA
    ============================================== */

    readingContent.appendChild(
        crearLecturaEscrita(
            lectura
        )
    );


    /* ==============================================
       MEDITACIÓN
    ============================================== */

    readingContent.appendChild(
        crearMeditacion(
            lectura
        )
    );

}


/* =========================================================
   EVENTOS
========================================================= */

if (diaSelect) {

    diaSelect.addEventListener(
        "change",
        mostrarLectura
    );

}


if (mesSelect) {

    mesSelect.addEventListener(
        "change",
        mostrarLectura
    );

}


/* =========================================================
   INICIAR
========================================================= */

mostrarLectura();