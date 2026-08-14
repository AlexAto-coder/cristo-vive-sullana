/* =========================================================
   CRISTO VIVE – SULLANA
   PANEL DE ADMINISTRACIÓN
   CONEXIÓN CON SUPABASE
========================================================= */


/* =========================================================
   ELEMENTOS PRINCIPALES
========================================================= */

const adminMes = document.getElementById("adminMes");
const adminDia = document.getElementById("adminDia");

const btnCargar = document.getElementById("btnCargar");
const btnGuardar = document.getElementById("btnGuardar");

const adminMessage = document.getElementById("adminMessage");


/* =========================================================
   LECTURA 1
========================================================= */

const referencia1 = document.getElementById("referencia1");
const version1 = document.getElementById("version1");
const texto1 = document.getElementById("texto1");


/* =========================================================
   LECTURA 2
========================================================= */

const referencia2 = document.getElementById("referencia2");
const version2 = document.getElementById("version2");
const texto2 = document.getElementById("texto2");


/* =========================================================
   LECTURA 3
========================================================= */

const referencia3 = document.getElementById("referencia3");
const version3 = document.getElementById("version3");
const texto3 = document.getElementById("texto3");


/* =========================================================
   VIDEO
========================================================= */

const videoDisponible =
    document.getElementById("videoDisponible");

const youtubeId =
    document.getElementById("youtubeId");


/* =========================================================
   MEDITACIÓN
========================================================= */

const meditacionDisponible =
    document.getElementById("meditacionDisponible");

const autorMeditacion =
    document.getElementById("autorMeditacion");

const fechaMeditacion =
    document.getElementById("fechaMeditacion");

const agradecimiento =
    document.getElementById("agradecimiento");

const contenidoMeditacion =
    document.getElementById("contenidoMeditacion");


/* =========================================================
   VARIABLES
========================================================= */

let programacionActual = null;
let contenidoActual = null;


/* =========================================================
   MOSTRAR MENSAJE
========================================================= */

function mostrarMensaje(texto, tipo = "success") {

    adminMessage.textContent = texto;

    adminMessage.className =
        `admin-message ${tipo}`;
}


/* =========================================================
   COMPROBAR SUPABASE
========================================================= */

function comprobarSupabase() {

    if (
        typeof supabaseClient === "undefined" ||
        !supabaseClient
    ) {

        mostrarMensaje(
            "No se pudo conectar con Supabase.",
            "error"
        );

        console.error(
            "supabaseClient no está disponible."
        );

        return false;
    }

    return true;
}


/* =========================================================
   LIMPIAR FORMULARIO
========================================================= */

function limpiarFormulario() {

    referencia1.value = "";
    version1.value = "RVR1960";
    texto1.value = "";

    referencia2.value = "";
    version2.value = "RVR1960";
    texto2.value = "";

    referencia3.value = "";
    version3.value = "RVR1960";
    texto3.value = "";

    videoDisponible.checked = false;
    youtubeId.value = "";

    meditacionDisponible.checked = false;
    autorMeditacion.value = "";
    fechaMeditacion.value = "";
    agradecimiento.value = "";
    contenidoMeditacion.value = "";

    programacionActual = null;
    contenidoActual = null;
}


/* =========================================================
   BUSCAR PROGRAMACIÓN EN SUPABASE
========================================================= */

async function buscarProgramacion() {

    if (!comprobarSupabase()) {
        return null;
    }

    const mes = adminMes.value;
    const dia = Number(adminDia.value);

    try {

        const { data, error } = await supabaseClient
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

            mostrarMensaje(
                "No se pudo consultar la programación.",
                "error"
            );

            return null;
        }


        return data;

    } catch (error) {

        console.error(
            "Error inesperado:",
            error
        );

        mostrarMensaje(
            "Ocurrió un error al consultar Supabase.",
            "error"
        );

        return null;
    }
}


/* =========================================================
   BUSCAR CONTENIDO EN SUPABASE
========================================================= */

async function buscarContenido(programacionId) {

    if (!programacionId) {
        return null;
    }

    try {

        const { data, error } = await supabaseClient
            .from("contenido_lecturas")
            .select("*")
            .eq("programacion_id", programacionId)
            .maybeSingle();


        if (error) {

            console.error(
                "Error buscando contenido:",
                error
            );

            mostrarMensaje(
                "No se pudo consultar el contenido.",
                "error"
            );

            return null;
        }


        return data;

    } catch (error) {

        console.error(
            "Error inesperado:",
            error
        );

        mostrarMensaje(
            "Ocurrió un error al consultar el contenido.",
            "error"
        );

        return null;
    }
}


/* =========================================================
   CARGAR PROGRAMACIÓN EN EL FORMULARIO
========================================================= */

function cargarProgramacion(programacion) {

    if (!programacion) {
        return;
    }

    referencia1.value =
        programacion.referencia_1 || "";

    version1.value =
        programacion.version_1 || "RVR1960";


    referencia2.value =
        programacion.referencia_2 || "";

    version2.value =
        programacion.version_2 || "RVR1960";


    referencia3.value =
        programacion.referencia_3 || "";

    version3.value =
        programacion.version_3 || "RVR1960";
}


/* =========================================================
   CARGAR CONTENIDO EN EL FORMULARIO
========================================================= */

function cargarContenido(contenido) {

    if (!contenido) {
        return;
    }


    /* -----------------------------------------
       TEXTOS BÍBLICOS
    ----------------------------------------- */

    texto1.value =
        contenido.texto_1 || "";

    texto2.value =
        contenido.texto_2 || "";

    texto3.value =
        contenido.texto_3 || "";


    /* -----------------------------------------
       VIDEO
    ----------------------------------------- */

    videoDisponible.checked =
        Boolean(contenido.video_disponible);

    youtubeId.value =
        contenido.youtube_id || "";


    /* -----------------------------------------
       MEDITACIÓN
    ----------------------------------------- */

    meditacionDisponible.checked =
        Boolean(contenido.meditacion_disponible);

    autorMeditacion.value =
        contenido.colaborador || "";

    fechaMeditacion.value =
        contenido.fecha_publicacion || "";

    agradecimiento.value =
        contenido.agradecimiento || "";

    contenidoMeditacion.value =
        contenido.meditacion_contenido || "";
}


/* =========================================================
   CARGAR DÍA
========================================================= */

async function cargarDia() {

    limpiarFormulario();

    mostrarMensaje(
        "Cargando información...",
        "success"
    );


    /* -----------------------------------------
       BUSCAR PROGRAMACIÓN
    ----------------------------------------- */

    const programacion =
        await buscarProgramacion();


    if (!programacion) {

        mostrarMensaje(
            "No existe programación para este día.",
            "error"
        );

        return;
    }


    programacionActual =
        programacion;


    /* -----------------------------------------
       MOSTRAR LAS CITAS
    ----------------------------------------- */

    cargarProgramacion(
        programacion
    );


    /* -----------------------------------------
       BUSCAR CONTENIDO
    ----------------------------------------- */

    const contenido =
        await buscarContenido(
            programacion.id
        );


    if (contenido) {

        contenidoActual =
            contenido;

        cargarContenido(
            contenido
        );

        mostrarMensaje(
            `Contenido del ${programacion.dia} de ${programacion.mes} cargado correctamente.`,
            "success"
        );

    } else {

        mostrarMensaje(
            `El ${programacion.dia} de ${programacion.mes} está disponible para agregar contenido.`,
            "success"
        );
    }
}


/* =========================================================
   GUARDAR CAMBIOS
========================================================= */

async function guardarCambios() {

    if (!comprobarSupabase()) {
        return;
    }


    /* -----------------------------------------
       COMPROBAR PROGRAMACIÓN
    ----------------------------------------- */

    if (!programacionActual) {

        mostrarMensaje(
            "Primero carga un día con programación.",
            "error"
        );

        return;
    }


    mostrarMensaje(
        "Guardando cambios...",
        "success"
    );


    /* -----------------------------------------
       PREPARAR DATOS
    ----------------------------------------- */

    const datos = {

        programacion_id:
            programacionActual.id,

        texto_1:
            texto1.value.trim(),

        texto_2:
            texto2.value.trim(),

        texto_3:
            texto3.value.trim(),

        video_disponible:
            videoDisponible.checked,

        youtube_id:
            youtubeId.value.trim(),

        meditacion_disponible:
            meditacionDisponible.checked,

        meditacion_contenido:
            contenidoMeditacion.value.trim(),

        colaborador:
            autorMeditacion.value.trim(),

        fecha_publicacion:
            fechaMeditacion.value || null,

        agradecimiento:
            agradecimiento.value.trim(),

        updated_at:
            new Date().toISOString()
    };


    /* -----------------------------------------
       INSERTAR / ACTUALIZAR
    ----------------------------------------- */

    try {

        const { data, error } =
            await supabaseClient
                .from("contenido_lecturas")
                .upsert(
                    datos,
                    {
                        onConflict: "programacion_id"
                    }
                )
                .select()
                .single();


        if (error) {

            console.error(
                "Error guardando:",
                error
            );

            mostrarMensaje(
                "No se pudieron guardar los cambios.",
                "error"
            );

            return;
        }


        contenidoActual =
            data;


        mostrarMensaje(
            "✅ Cambios guardados correctamente en Supabase.",
            "success"
        );


        console.log(
            "Contenido guardado:",
            data
        );


    } catch (error) {

        console.error(
            "Error inesperado:",
            error
        );

        mostrarMensaje(
            "Ocurrió un error al guardar.",
            "error"
        );
    }
}


/* =========================================================
   EVENTOS
========================================================= */

btnCargar.addEventListener(
    "click",
    cargarDia
);


btnGuardar.addEventListener(
    "click",
    guardarCambios
);


/* =========================================================
   CAMBIAR AUTOMÁTICAMENTE DE DÍA
========================================================= */

adminDia.addEventListener(
    "change",
    cargarDia
);


adminMes.addEventListener(
    "change",
    cargarDia
);


/* =========================================================
   INICIO
========================================================= */

if (comprobarSupabase()) {

    cargarDia();

}