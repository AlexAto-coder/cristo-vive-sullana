/* =========================================================
   CRISTO VIVE – SULLANA
   PANEL DE ADMINISTRACIÓN
========================================================= */


const adminMes = document.getElementById("adminMes");
const adminDia = document.getElementById("adminDia");

const btnCargar = document.getElementById("btnCargar");
const btnGuardar = document.getElementById("btnGuardar");

const adminMessage = document.getElementById("adminMessage");


/* =========================================================
   ELEMENTOS DE LAS LECTURAS
========================================================= */

const referencia1 = document.getElementById("referencia1");
const version1 = document.getElementById("version1");
const texto1 = document.getElementById("texto1");

const referencia2 = document.getElementById("referencia2");
const version2 = document.getElementById("version2");
const texto2 = document.getElementById("texto2");

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
   MOSTRAR MENSAJE
========================================================= */

function mostrarMensaje(texto, tipo = "success") {

    adminMessage.textContent = texto;

    adminMessage.className =
        `admin-message ${tipo}`;

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

}


/* =========================================================
   BUSCAR DÍA
========================================================= */

function buscarDia() {

    const mes = adminMes.value;
    const dia = Number(adminDia.value);

    if (
        typeof contenidoLecturas === "undefined"
    ) {

        mostrarMensaje(
            "No se encontró la base de contenido.",
            "error"
        );

        return null;
    }


    return contenidoLecturas.find(function (lectura) {

        return (
            lectura.mes === mes &&
            lectura.dia === dia
        );

    }) || null;

}


/* =========================================================
   CARGAR DÍA
========================================================= */

function cargarDia() {

    limpiarFormulario();


    const lectura = buscarDia();


    if (!lectura) {

        mostrarMensaje(
            "No existe contenido para este día.",
            "error"
        );

        return;
    }


    /* ==============================================
       LECTURAS
    ============================================== */

    if (lectura.programacion[0]) {

        referencia1.value =
            lectura.programacion[0].referencia;

        version1.value =
            lectura.programacion[0].version;

        texto1.value =
            lectura.programacion[0].texto || "";

    }


    if (lectura.programacion[1]) {

        referencia2.value =
            lectura.programacion[1].referencia;

        version2.value =
            lectura.programacion[1].version;

        texto2.value =
            lectura.programacion[1].texto || "";

    }


    if (lectura.programacion[2]) {

        referencia3.value =
            lectura.programacion[2].referencia;

        version3.value =
            lectura.programacion[2].version;

        texto3.value =
            lectura.programacion[2].texto || "";

    }


    /* ==============================================
       VIDEO
    ============================================== */

    if (lectura.video) {

        videoDisponible.checked =
            lectura.video.disponible;

        youtubeId.value =
            lectura.video.youtubeId || "";

    }


    /* ==============================================
       MEDITACIÓN
    ============================================== */

    if (lectura.meditacion) {

        meditacionDisponible.checked =
            lectura.meditacion.disponible;

        autorMeditacion.value =
            lectura.meditacion.autor || "";

        contenidoMeditacion.value =
            lectura.meditacion.contenido || "";

        agradecimiento.value =
            lectura.meditacion.agradecimiento || "";


        /*
           La fecha se convertirá posteriormente
           al formato del input date.
        */

        if (
            lectura.meditacion.fechaPublicacion
        ) {

            const fecha =
                convertirFechaParaInput(
                    lectura.meditacion.fechaPublicacion
                );

            fechaMeditacion.value =
                fecha;

        }

    }


    mostrarMensaje(
        `Contenido del ${lectura.dia} de ${lectura.mes} cargado correctamente.`,
        "success"
    );

}


/* =========================================================
   CONVERTIR FECHA
========================================================= */

function convertirFechaParaInput(fecha) {

    if (!fecha) {
        return "";
    }


    const partes =
        fecha.split(" de ");


    if (partes.length !== 2) {
        return "";
    }


    const dia =
        partes[0].padStart(2, "0");


    const partesMes =
        partes[1].split(" ");


    if (partesMes.length !== 2) {
        return "";
    }


    const mesNombre =
        partesMes[0].toLowerCase();

    const año =
        partesMes[1];


    const meses = {

        enero: "01",
        febrero: "02",
        marzo: "03",
        abril: "04",
        mayo: "05",
        junio: "06",
        julio: "07",
        agosto: "08",
        septiembre: "09",
        octubre: "10",
        noviembre: "11",
        diciembre: "12"

    };


    const mes =
        meses[mesNombre];


    if (!mes) {
        return "";
    }


    return `${año}-${mes}-${dia}`;

}


/* =========================================================
   GUARDAR
========================================================= */

function guardarCambios() {

    const lectura = buscarDia();


    if (!lectura) {

        mostrarMensaje(
            "No existe este día en contenido.js.",
            "error"
        );

        return;
    }


    /*
       Por ahora solamente mostramos una
       vista previa de los datos.

       En el siguiente paso conectaremos
       el almacenamiento.
    */


    const datos = {

        dia: lectura.dia,

        mes: lectura.mes,

        programacion: [

            {
                referencia: referencia1.value,
                version: version1.value,
                texto: texto1.value
            },

            {
                referencia: referencia2.value,
                version: version2.value,
                texto: texto2.value
            },

            {
                referencia: referencia3.value,
                version: version3.value,
                texto: texto3.value
            }

        ],

        video: {

            disponible:
                videoDisponible.checked,

            youtubeId:
                youtubeId.value.trim()

        },

        meditacion: {

            disponible:
                meditacionDisponible.checked,

            autor:
                autorMeditacion.value.trim(),

            fechaPublicacion:
                fechaMeditacion.value,

            agradecimiento:
                agradecimiento.value.trim(),

            contenido:
                contenidoMeditacion.value

        }

    };


    console.log(
        "Datos preparados para guardar:",
        datos
    );


    mostrarMensaje(
        "Datos preparados correctamente. Todavía no se han guardado en la página.",
        "success"
    );

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
   CAMBIAR AUTOMÁTICAMENTE AL SELECCIONAR OTRO DÍA
========================================================= */

adminDia.addEventListener(
    "change",
    cargarDia
);


adminMes.addEventListener(
    "change",
    cargarDia
);

cargarDia();