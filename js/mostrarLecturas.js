/* =========================================================
   CRISTO VIVE – SULLANA
   MOSTRAR LECTURAS DIARIAS
   DATOS DESDE SUPABASE
========================================================= */


/* =========================================================
   ELEMENTOS DE LA PÁGINA
========================================================= */

const mesSelect =
    document.getElementById("mesSelect");

const diaSelect =
    document.getElementById("diaSelect");

const readingContent =
    document.getElementById("readingContent");


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const nombresMeses = {

    enero: "Enero",

    febrero: "Febrero",

    marzo: "Marzo",

    abril: "Abril",

    mayo: "Mayo",

    junio: "Junio",

    julio: "Julio",

    agosto: "Agosto",

    septiembre: "Septiembre",

    octubre: "Octubre",

    noviembre: "Noviembre",

    diciembre: "Diciembre"

};


/* =========================================================
   COMPROBAR SUPABASE
========================================================= */

function comprobarSupabase() {

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        console.error(
            "supabaseClient no está disponible."
        );

        mostrarMensajeError(
            "No se pudo conectar con Supabase."
        );

        return false;
    }

    return true;
}


/* =========================================================
   MENSAJE DE ERROR
========================================================= */

function mostrarMensajeError(mensaje) {

    if (!readingContent) {
        return;
    }

    readingContent.innerHTML = "";

    const contenedor =
        document.createElement("div");

    contenedor.classList.add(
        "reading-not-found"
    );

    contenedor.innerHTML = `

        <i class="bx bx-error-circle"></i>

        <h2>
            Ocurrió un problema
        </h2>

        <p>
            ${mensaje}
        </p>

    `;

    readingContent.appendChild(
        contenedor
    );
}


/* =========================================================
   CARGAR MESES DESDE SUPABASE
========================================================= */

async function cargarMeses() {

    if (!comprobarSupabase()) {
        return;
    }

    try {

        const { data, error } =
            await supabaseClient

                .from("programacion_lecturas")

                .select("mes")

                .order("mes");


        if (error) {

            console.error(
                "Error cargando meses:",
                error
            );

            mostrarMensajeError(
                "No se pudieron cargar los meses."
            );

            return;
        }


        /* Obtener meses únicos */

        const mesesUnicos = [
            ...new Set(
                data.map(
                    item => item.mes
                )
            )
        ];


        /* Orden correcto de los meses */

        const ordenMeses = [

            "enero",
            "febrero",
            "marzo",
            "abril",
            "mayo",
            "junio",
            "julio",
            "agosto",
            "septiembre",
            "octubre",
            "noviembre",
            "diciembre"

        ];


        mesesUnicos.sort(
            (a, b) =>
                ordenMeses.indexOf(a) -
                ordenMeses.indexOf(b)
        );


        /* Limpiar selector */

        mesSelect.innerHTML = "";


        /* Crear opciones */

        mesesUnicos.forEach(
            function (mes) {

                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value = mes;

                opcion.textContent =
                    nombresMeses[mes] ||
                    mes;

                mesSelect.appendChild(
                    opcion
                );

            }
        );


        if (mesesUnicos.length === 0) {

            mostrarMensajeError(
                "Todavía no hay programaciones disponibles."
            );

            return;
        }


        /*
           Seleccionar agosto si existe.
           Así mantenemos el comportamiento
           que ya tenía la página.
        */

        if (
            mesesUnicos.includes("agosto")
        ) {

            mesSelect.value =
                "agosto";

        } else {

            mesSelect.value =
                mesesUnicos[0];

        }


        await cargarDias();


    } catch (error) {

        console.error(
            "Error inesperado cargando meses:",
            error
        );

        mostrarMensajeError(
            "Ocurrió un error al cargar los meses."
        );

    }
}


/* =========================================================
   CARGAR DÍAS DEL MES
========================================================= */

async function cargarDias() {

    if (!comprobarSupabase()) {
        return;
    }

    const mes =
        mesSelect.value;


    if (!mes) {
        return;
    }


    try {

        const { data, error } =
            await supabaseClient

                .from("programacion_lecturas")

                .select("dia")

                .eq("mes", mes)

                .order("dia");


        if (error) {

            console.error(
                "Error cargando días:",
                error
            );

            mostrarMensajeError(
                "No se pudieron cargar los días."
            );

            return;
        }


        /* Limpiar selector */

        diaSelect.innerHTML = "";


        /* Crear días */

        data.forEach(
            function (item) {

                const opcion =
                    document.createElement(
                        "option"
                    );

                opcion.value =
                    item.dia;

                opcion.textContent =
                    `${item.dia} de ${
                        nombresMeses[mes] || mes
                    }`;

                diaSelect.appendChild(
                    opcion
                );

            }
        );


        if (data.length === 0) {

            mostrarMensajeError(
                `No hay programaciones para ${nombresMeses[mes] || mes}.`
            );

            return;
        }


        /*
           Seleccionamos el primer día
           disponible.
        */

        diaSelect.value =
            data[0].dia;


        await mostrarLectura();

    } catch (error) {

        console.error(
            "Error inesperado cargando días:",
            error
        );

        mostrarMensajeError(
            "Ocurrió un error al cargar los días."
        );

    }
}


/* =========================================================
   BUSCAR PROGRAMACIÓN
========================================================= */

async function buscarProgramacion() {

    if (!comprobarSupabase()) {
        return null;
    }

    const mes =
        mesSelect.value;

    const dia =
        Number(diaSelect.value);


    try {

        const { data, error } =
            await supabaseClient

                .from("programacion_lecturas")

                .select("*")

                .eq("mes", mes)

                .eq("dia", dia)

                .maybeSingle();


        if (error) {

            console.error(
                "Error buscando programación:",
                error
            );

            return null;
        }


        return data;

    } catch (error) {

        console.error(
            "Error inesperado buscando programación:",
            error
        );

        return null;
    }
}


/* =========================================================
   BUSCAR CONTENIDO
========================================================= */

async function buscarContenido(
    programacionId
) {

    if (!programacionId) {
        return null;
    }


    try {

        const { data, error } =
            await supabaseClient

                .from("contenido_lecturas")

                .select("*")

                .eq(
                    "programacion_id",
                    programacionId
                )

                .maybeSingle();


        if (error) {

            console.error(
                "Error buscando contenido:",
                error
            );

            return null;
        }


        return data;

    } catch (error) {

        console.error(
            "Error inesperado buscando contenido:",
            error
        );

        return null;
    }
}


/* =========================================================
   CREAR PROGRAMACIÓN
========================================================= */

function crearProgramacion(
    programacion
) {

    const contenedor =
        document.createElement(
            "section"
        );

    contenedor.classList.add(
        "reading-section"
    );


    contenedor.innerHTML = `

        <h2>
            📚 Programación del día
        </h2>

    `;


    const lista =
        document.createElement(
            "div"
        );

    lista.classList.add(
        "reading-references"
    );


    const referencias = [

        {
            referencia:
                programacion.referencia_1,

            version:
                programacion.version_1
        },

        {
            referencia:
                programacion.referencia_2,

            version:
                programacion.version_2
        },

        {
            referencia:
                programacion.referencia_3,

            version:
                programacion.version_3
        }

    ];


    referencias.forEach(
        function (texto) {

            if (
                !texto.referencia
            ) {
                return;
            }


            const referencia =
                document.createElement(
                    "div"
                );

            referencia.classList.add(
                "reading-reference"
            );


            referencia.innerHTML = `

                <h3>
                    ${texto.referencia}
                </h3>

                <span class="bible-version">
                    ${texto.version || "RVR1960"}
                </span>

            `;


            lista.appendChild(
                referencia
            );

        }
    );


    contenedor.appendChild(
        lista
    );


    return contenedor;
}


/* =========================================================
   CREAR VIDEO
========================================================= */

function crearVideo(
    contenido
) {

    const contenedor =
        document.createElement(
            "section"
        );

    contenedor.classList.add(
        "reading-section"
    );


    contenedor.innerHTML = `

        <h2>
            🎥 Lectura en video
        </h2>

    `;


    if (
        contenido &&
        contenido.video_disponible &&
        contenido.youtube_id
    ) {

        const videoWrapper =
            document.createElement(
                "div"
            );

        videoWrapper.classList.add(
            "reading-video"
        );


        const iframe =
            document.createElement(
                "iframe"
            );


        iframe.src =
            `https://www.youtube.com/embed/${contenido.youtube_id}`;


        iframe.title =
            "Lectura bíblica";


        iframe.loading =
            "lazy";


        iframe.allow =
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";


        iframe.allowFullscreen =
            true;


        videoWrapper.appendChild(
            iframe
        );


        contenedor.appendChild(
            videoWrapper
        );

    } else {

        const pendiente =
            document.createElement(
                "div"
            );

        pendiente.classList.add(
            "video-pending"
        );


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


        contenedor.appendChild(
            pendiente
        );

    }


    return contenedor;
}


/* =========================================================
   CREAR LECTURA BÍBLICA
========================================================= */

function crearLecturaEscrita(
    programacion,
    contenido
) {

    const contenedor =
        document.createElement(
            "section"
        );

    contenedor.classList.add(
        "reading-section"
    );


    contenedor.innerHTML = `

        <h2>
            📖 Lectura bíblica
        </h2>

    `;


    const textos = [

        {
            referencia:
                programacion.referencia_1,

            version:
                programacion.version_1,

            texto:
                contenido
                    ? contenido.texto_1
                    : ""
        },

        {
            referencia:
                programacion.referencia_2,

            version:
                programacion.version_2,

            texto:
                contenido
                    ? contenido.texto_2
                    : ""
        },

        {
            referencia:
                programacion.referencia_3,

            version:
                programacion.version_3,

            texto:
                contenido
                    ? contenido.texto_3
                    : ""
        }

    ];


    textos.forEach(
        function (item) {

            if (!item.referencia) {
                return;
            }


            const bloque =
                document.createElement(
                    "article"
                );

            bloque.classList.add(
                "bible-reading"
            );


            const encabezado =
                document.createElement(
                    "div"
                );

            encabezado.classList.add(
                "bible-reading-header"
            );


            encabezado.innerHTML = `

                <h3>
                    ${item.referencia}
                </h3>

                <span class="bible-version">
                    ${item.version || "RVR1960"}
                </span>

            `;


            bloque.appendChild(
                encabezado
            );


            if (
                item.texto &&
                item.texto.trim() !== ""
            ) {

                const contenidoTexto =
                    document.createElement(
                        "div"
                    );

                contenidoTexto.classList.add(
                    "bible-text"
                );


                contenidoTexto.textContent =
                    item.texto;


                bloque.appendChild(
                    contenidoTexto
                );

            } else {

                const pendiente =
                    document.createElement(
                        "div"
                    );

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


                bloque.appendChild(
                    pendiente
                );

            }


            contenedor.appendChild(
                bloque
            );

        }
    );


    return contenedor;
}


/* =========================================================
   CREAR MEDITACIÓN
========================================================= */

function crearMeditacion(
    contenido
) {

    const contenedor =
        document.createElement(
            "section"
        );

    contenedor.classList.add(
        "reading-section"
    );


    contenedor.innerHTML = `

        <h2>
            📖 Meditación
        </h2>

    `;


    if (
        contenido &&
        contenido.meditacion_disponible
    ) {

        const articulo =
            document.createElement(
                "article"
            );

        articulo.classList.add(
            "meditation"
        );


        /* CONTENIDO */

        const contenidoMeditacion =
            document.createElement(
                "div"
            );

        contenidoMeditacion.classList.add(
            "meditation-content"
        );


        contenidoMeditacion.textContent =
            contenido.meditacion_contenido || "";


        articulo.appendChild(
            contenidoMeditacion
        );


        /* AUTOR */

        if (
            contenido.colaborador
        ) {

            const autor =
                document.createElement(
                    "div"
                );

            autor.classList.add(
                "meditation-author"
            );


            autor.innerHTML = `

                <strong>
                    ✍️ Preparada por:
                </strong>

                <span>
                    ${contenido.colaborador}
                </span>

            `;


            articulo.appendChild(
                autor
            );

        }


        /* FECHA */

        if (
            contenido.fecha_publicacion
        ) {

            const fecha =
                document.createElement(
                    "div"
                );

            fecha.classList.add(
                "meditation-date"
            );


            fecha.innerHTML = `

                <i class="bx bx-calendar"></i>

                Subida el
                ${contenido.fecha_publicacion}

            `;


            articulo.appendChild(
                fecha
            );

        }


        /* AGRADECIMIENTO */

        if (
            contenido.agradecimiento
        ) {

            const agradecimiento =
                document.createElement(
                    "div"
                );

            agradecimiento.classList.add(
                "meditation-thanks"
            );


            agradecimiento.textContent =
                contenido.agradecimiento;


            articulo.appendChild(
                agradecimiento
            );

        }


        contenedor.appendChild(
            articulo
        );

    } else {

        const pendiente =
            document.createElement(
                "div"
            );

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

async function mostrarLectura() {

    if (!readingContent) {
        return;
    }


    readingContent.innerHTML = `

        <div class="reading-not-found">

            <i class="bx bx-loader-alt bx-spin"></i>

            <h2>
                Cargando lectura...
            </h2>

        </div>

    `;


    const programacion =
        await buscarProgramacion();


    if (!programacion) {

        mostrarMensajeError(
            "No existe programación para este día."
        );

        return;
    }


    const contenido =
        await buscarContenido(
            programacion.id
        );


    /* Limpiar */

    readingContent.innerHTML = "";


    /* ==============================================
       ENCABEZADO
    ============================================== */

    const encabezado =
        document.createElement(
            "header"
        );

    encabezado.classList.add(
        "reading-header"
    );


    const titulo =
        document.createElement(
            "h1"
        );


    titulo.textContent =
        `LECTURA ${programacion.dia} DE ${
            nombresMeses[
                programacion.mes
            ] || programacion.mes
        }`;


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
            programacion
        )
    );


    /* ==============================================
       VIDEO
    ============================================== */

    readingContent.appendChild(
        crearVideo(
            contenido
        )
    );


    /* ==============================================
       LECTURA ESCRITA
    ============================================== */

    readingContent.appendChild(
        crearLecturaEscrita(
            programacion,
            contenido
        )
    );


    /* ==============================================
       MEDITACIÓN
    ============================================== */

    readingContent.appendChild(
        crearMeditacion(
            contenido
        )
    );

}


/* =========================================================
   EVENTO: CAMBIO DE DÍA
========================================================= */

if (diaSelect) {

    diaSelect.addEventListener(
        "change",
        function () {

            mostrarLectura();

        }
    );

}


/* =========================================================
   EVENTO: CAMBIO DE MES
========================================================= */

if (mesSelect) {

    mesSelect.addEventListener(
        "change",
        async function () {

            await cargarDias();

        }
    );

}


/* =========================================================
   INICIAR
========================================================= */

async function iniciarLecturas() {

    if (
        !mesSelect ||
        !diaSelect ||
        !readingContent
    ) {

        console.error(
            "No se encontraron los elementos de lecturas."
        );

        return;
    }


    await cargarMeses();

}


iniciarLecturas();