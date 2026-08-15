/* =========================================================
   CRISTO VIVE – SULLANA
   PANEL DE ADMINISTRACIÓN
   CONEXIÓN CON SUPABASE
========================================================= */

/* =========================================================
   AUTENTICACIÓN DEL ADMINISTRADOR
========================================================= */

const adminLogin = document.getElementById("adminLogin");
const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const loginMessage = document.getElementById("loginMessage");

const adminHeader = document.querySelector(".admin-header");
const adminPanel = document.querySelector(
    ".admin-content.section:not(#adminLogin)"
);


/* =========================================================
   MOSTRAR / OCULTAR PANEL
========================================================= */

function mostrarPanelAdmin() {

    if (adminLogin) {
        adminLogin.style.display = "none";
    }

    if (adminHeader) {
        adminHeader.style.display = "";
    }

    if (adminPanel) {
        adminPanel.style.display = "";
    }
}


function mostrarLogin() {

    if (adminLogin) {
        adminLogin.style.display = "";
    }

    if (adminHeader) {
        adminHeader.style.display = "none";
    }

    if (adminPanel) {
        adminPanel.style.display = "none";
    }
}


/* =========================================================
   COMPROBAR SESIÓN
========================================================= */

async function comprobarSesion() {

    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {

        console.error(
            "Error comprobando sesión:",
            error
        );

        mostrarLogin();

        return;
    }

    if (data.session) {

        console.log(
            "Administrador autenticado:",
            data.session.user.email
        );

        mostrarPanelAdmin();

    } else {

        mostrarLogin();

    }
}


/* =========================================================
   INICIAR SESIÓN
========================================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            loginMessage.textContent =
                "Iniciando sesión...";

            loginMessage.className =
                "admin-message";


            const email =
                loginEmail.value.trim();

            const password =
                loginPassword.value;


            const { data, error } =
                await supabaseClient.auth.signInWithPassword({
                    email: email,
                    password: password
                });


            if (error) {

                console.error(
                    "Error iniciando sesión:",
                    error
                );

                loginMessage.textContent =
                    "Correo o contraseña incorrectos.";

                loginMessage.className =
                    "admin-message error";

                return;
            }


            console.log(
                "Sesión iniciada:",
                data.user.email
            );

            loginMessage.textContent =
                "Acceso correcto.";

            loginMessage.className =
                "admin-message success";


            mostrarPanelAdmin();

        }
    );

}


/* =========================================================
   INICIAR COMPROBACIÓN
========================================================= */

comprobarSesion();

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
    function () {

        actualizarDias();

        cargarDia();

    }
);


/* =========================================================
   INICIO
========================================================= */

if (comprobarSupabase()) {

    actualizarDias();

    cargarDia();

}

/* =========================================================
   IMPORTADOR DE PROGRAMACIONES XLSX
========================================================= */

const archivoProgramaciones =
    document.getElementById("archivoProgramaciones");

const btnAnalizarExcel =
    document.getElementById("btnAnalizarExcel");

const btnImportarExcel =
    document.getElementById("btnImportarExcel");

const resultadoImportacion =
    document.getElementById("resultadoImportacion");

let programacionesExcel = [];


/* =========================================================
   MESES PERMITIDOS
========================================================= */

const mesesExcel = [
    "agosto",
    "septiembre",
    "octubre",
    "noviembre"
];


/* =========================================================
   MOSTRAR RESULTADO
========================================================= */

function mostrarResultadoImportacion(texto, tipo = "success") {

    if (!resultadoImportacion) {
        return;
    }

    resultadoImportacion.textContent = texto;

    resultadoImportacion.className =
        `admin-message ${tipo}`;
}


/* =========================================================
   DÍAS DEL MES
========================================================= */

function obtenerDiasDelMes(mes) {

    const dias = {
        agosto: 31,
        septiembre: 30,
        octubre: 31,
        noviembre: 30
    };

    return dias[mes] || 0;
}


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(valor) {

    if (
        valor === null ||
        valor === undefined
    ) {
        return "";
    }

    return String(valor)
        .trim()
        .replace(/\s+/g, " ");
}


/* =========================================================
   BUSCAR ENCABEZADOS
========================================================= */

function encontrarFilaEncabezados(filas) {

    for (let i = 0; i < filas.length; i++) {

        const fila = filas[i] || [];

        const textos =
            fila.map(function (celda) {

                return normalizarTexto(celda)
                    .toUpperCase();

            });


        const tieneDia =
            textos.includes("DÍA") ||
            textos.includes("DIA");

        const tieneLect1 =
            textos.includes("LECT 01");

        const tieneLect2 =
            textos.includes("LECT 02");

        const tieneLect3 =
            textos.includes("LECT 03");


        if (
            tieneDia &&
            tieneLect1 &&
            tieneLect2 &&
            tieneLect3
        ) {

            return {
                indice: i,

                columnas: {

                    dia:
                        textos.findIndex(
                            x =>
                                x === "DÍA" ||
                                x === "DIA"
                        ),

                    lect1:
                        textos.indexOf("LECT 01"),

                    lect2:
                        textos.indexOf("LECT 02"),

                    lect3:
                        textos.indexOf("LECT 03")
                }
            };
        }
    }

    return null;
}


/* =========================================================
   ANALIZAR UNA HOJA
========================================================= */

function analizarHoja(nombreHoja, hoja) {

    const filas =
        XLSX.utils.sheet_to_json(
            hoja,
            {
                header: 1,
                defval: ""
            }
        );


    const encabezados =
        encontrarFilaEncabezados(filas);


    if (!encabezados) {

        throw new Error(
            `La hoja "${nombreHoja}" no tiene los encabezados esperados.`
        );
    }


    const mes =
        nombreHoja
            .trim()
            .toLowerCase();


    if (!mesesExcel.includes(mes)) {

        throw new Error(
            `La hoja "${nombreHoja}" no corresponde a un mes permitido.`
        );
    }


    const diasEsperados =
        obtenerDiasDelMes(mes);


    const registros = [];

    const diasEncontrados = new Set();


    for (
        let i = encabezados.indice + 1;
        i < filas.length;
        i++
    ) {

        const fila = filas[i] || [];

        const diaValor =
            fila[encabezados.columnas.dia];


        if (
            diaValor === "" ||
            diaValor === null ||
            diaValor === undefined
        ) {
            continue;
        }


        const dia =
            Number(diaValor);


        if (
            !Number.isInteger(dia) ||
            dia < 1 ||
            dia > diasEsperados
        ) {

            throw new Error(
                `Día inválido en ${mes}: ${diaValor}`
            );
        }


        if (diasEncontrados.has(dia)) {

            throw new Error(
                `El día ${dia} aparece más de una vez en ${mes}.`
            );
        }


        diasEncontrados.add(dia);


        const referencia1 =
            normalizarTexto(
                fila[encabezados.columnas.lect1]
            );

        const referencia2 =
            normalizarTexto(
                fila[encabezados.columnas.lect2]
            );

        const referencia3 =
            normalizarTexto(
                fila[encabezados.columnas.lect3]
            );


        if (
            !referencia1 ||
            !referencia2 ||
            !referencia3
        ) {

            throw new Error(
                `El día ${dia} de ${mes} tiene una o más lecturas vacías.`
            );
        }


        registros.push({

            mes: mes,

            dia: dia,

            referencia_1:
                referencia1,

            version_1:
                "RVR1960",

            referencia_2:
                referencia2,

            version_2:
                "RVR1960",

            referencia_3:
                referencia3,

            version_3:
                "RVR1960"
        });
    }


    if (
        registros.length !== diasEsperados
    ) {

        throw new Error(
            `La hoja "${nombreHoja}" debería tener ${diasEsperados} días, pero tiene ${registros.length}.`
        );
    }


    registros.sort(function (a, b) {

        return a.dia - b.dia;

    });


    return registros;
}


/* =========================================================
   ANALIZAR ARCHIVO EXCEL
========================================================= */

async function analizarArchivoExcel() {

    if (!archivoProgramaciones.files.length) {

        mostrarResultadoImportacion(
            "Selecciona primero un archivo Excel.",
            "error"
        );

        return;
    }


    if (typeof XLSX === "undefined") {

        mostrarResultadoImportacion(
            "No se pudo cargar SheetJS.",
            "error"
        );

        return;
    }


    const archivo =
        archivoProgramaciones.files[0];


    mostrarResultadoImportacion(
        "Analizando archivo...",
        "success"
    );


    btnImportarExcel.disabled = true;


    try {

        const buffer =
            await archivo.arrayBuffer();


        const workbook =
            XLSX.read(
                buffer,
                {
                    type: "array"
                }
            );


        console.log(
            "Hojas encontradas:",
            workbook.SheetNames
        );


        const hojasEncontradas =
            workbook.SheetNames.map(
                function (nombre) {

                    return nombre
                        .trim()
                        .toLowerCase();

                }
            );


        /* -----------------------------------------
           COMPROBAR LAS 4 HOJAS
        ----------------------------------------- */

        for (
            const mes of mesesExcel
        ) {

            if (
                !hojasEncontradas.includes(mes)
            ) {

                throw new Error(
                    `Falta la hoja "${mes}".`
                );
            }
        }


        programacionesExcel = [];


        /* -----------------------------------------
           PROCESAR CADA HOJA
        ----------------------------------------- */

        for (
            const nombreHoja of workbook.SheetNames
        ) {

            const mes =
                nombreHoja
                    .trim()
                    .toLowerCase();


            if (
                !mesesExcel.includes(mes)
            ) {

                continue;
            }


            const hoja =
                workbook.Sheets[nombreHoja];


            const registros =
                analizarHoja(
                    nombreHoja,
                    hoja
                );


            programacionesExcel =
                programacionesExcel.concat(
                    registros
                );
        }


        /* -----------------------------------------
           COMPROBAR TOTAL
        ----------------------------------------- */

        if (
            programacionesExcel.length !== 122
        ) {

            throw new Error(
                `Se esperaban 122 programaciones y se encontraron ${programacionesExcel.length}.`
            );
        }


        mostrarResultadoImportacion(
            `✅ Archivo correcto: ${programacionesExcel.length} programaciones encontradas en 4 hojas.`,
            "success"
        );


        btnImportarExcel.disabled = false;


        console.log(
            "Programaciones listas para importar:",
            programacionesExcel
        );


    } catch (error) {

        console.error(
            "Error analizando Excel:",
            error
        );


        programacionesExcel = [];


        mostrarResultadoImportacion(
            `❌ ${error.message}`,
            "error"
        );


        btnImportarExcel.disabled = true;
    }
}


/* =========================================================
   IMPORTAR A SUPABASE
========================================================= */

async function importarProgramacionesExcel() {

    if (
        !programacionesExcel.length
    ) {

        mostrarResultadoImportacion(
            "Primero analiza un archivo Excel válido.",
            "error"
        );

        return;
    }


    if (!comprobarSupabase()) {
        return;
    }


    /* -----------------------------------------
       COMPROBAR SESIÓN
    ----------------------------------------- */

    const {
        data: sessionData,
        error: sessionError
    } =
        await supabaseClient.auth.getSession();


    if (
        sessionError ||
        !sessionData.session
    ) {

        mostrarResultadoImportacion(
            "Tu sesión ha expirado. Inicia sesión nuevamente.",
            "error"
        );

        mostrarLogin();

        return;
    }


    btnImportarExcel.disabled = true;


    mostrarResultadoImportacion(
        "Importando programaciones a Supabase...",
        "success"
    );


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("programacion_lecturas")
                .upsert(
                    programacionesExcel,
                    {
                        onConflict: "mes,dia"
                    }
                )
                .select();


        if (error) {

            console.error(
                "Error importando programaciones:",
                error
            );

            throw new Error(
                error.message
            );
        }


        mostrarResultadoImportacion(
            `✅ Importación completada. ${data.length} programaciones procesadas.`,
            "success"
        );


        console.log(
            "Programaciones importadas:",
            data
        );


    } catch (error) {

        console.error(
            "Error durante la importación:",
            error
        );


        mostrarResultadoImportacion(
            `❌ No se pudo completar la importación: ${error.message}`,
            "error"
        );


    } finally {

        btnImportarExcel.disabled = false;
    }
}

/* =========================================================
   ACTUALIZAR DÍAS SEGÚN EL MES
========================================================= */

function actualizarDias() {

    const mes = adminMes.value;

    const diasPorMes = {
        agosto: 31,
        septiembre: 30,
        octubre: 31,
        noviembre: 30
    };

    const cantidadDias =
        diasPorMes[mes] || 0;

    const nombreMes =
        mes.charAt(0).toUpperCase() +
        mes.slice(1);


    /* Limpiar días actuales */

    adminDia.innerHTML = "";


    /* Crear días */

    for (
        let dia = 1;
        dia <= cantidadDias;
        dia++
    ) {

        const opcion =
            document.createElement("option");

        opcion.value = dia;

        opcion.textContent =
            `${dia} de ${nombreMes}`;

        adminDia.appendChild(opcion);
    }


    /* Seleccionar el primer día */

    if (cantidadDias > 0) {

        adminDia.value = "1";

    }
}

/* =========================================================
   EVENTOS DEL IMPORTADOR
========================================================= */

if (btnAnalizarExcel) {

    btnAnalizarExcel.addEventListener(
        "click",
        analizarArchivoExcel
    );
}


if (btnImportarExcel) {

    btnImportarExcel.addEventListener(
        "click",
        importarProgramacionesExcel
    );
}