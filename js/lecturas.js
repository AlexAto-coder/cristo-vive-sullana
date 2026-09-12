/* =========================================================
   CRISTO VIVE – SULLANA
   LECTURAS DIARIAS
========================================================= */

const lecturas = [
    {
        fecha: "2026-09-12",
        titulo: "LECTURA 12 DE SEPTIEMBRE",
        youtubeId: "2uAWAl8CJas",
        categoria: "Lectura diaria",
        descripcion: "Lectura diaria de la Palabra de Dios."
    }
];


/* =========================================================
   MOSTRAR LECTURAS
========================================================= */

const lecturasContainer = document.getElementById("lecturasContainer");


function mostrarLecturas() {

    if (!lecturasContainer) {
        return;
    }

    lecturasContainer.innerHTML = "";


    lecturas.forEach(function (lectura) {

        const article = document.createElement("article");

        article.classList.add("video-card");


        /* Enlace al video */

        const enlace = document.createElement("a");

        enlace.href =
            "https://www.youtube.com/watch?v=" + lectura.youtubeId;

        enlace.target = "_blank";

        enlace.rel = "noopener noreferrer";

        enlace.classList.add("video-thumbnail");


        /* Miniatura */

        const imagen = document.createElement("img");

        imagen.src =
            "https://img.youtube.com/vi/" +
            lectura.youtubeId +
            "/hqdefault.jpg";

        imagen.alt = lectura.titulo;

        imagen.loading = "lazy";


        /* Botón de reproducción */

        const botonPlay = document.createElement("span");

        botonPlay.classList.add("video-play");

        botonPlay.innerHTML =
            '<i class="bx bx-play"></i>';


        enlace.appendChild(imagen);

        enlace.appendChild(botonPlay);


        /* Información */

        const informacion = document.createElement("div");

        informacion.classList.add("video-info");


        const categoria = document.createElement("span");

        categoria.classList.add("video-category");

        categoria.textContent = lectura.categoria;


        const titulo = document.createElement("h3");

        titulo.textContent = lectura.titulo;


        const descripcion = document.createElement("p");

        descripcion.textContent = lectura.descripcion;


        informacion.appendChild(categoria);

        informacion.appendChild(titulo);

        informacion.appendChild(descripcion);


        article.appendChild(enlace);

        article.appendChild(informacion);


        lecturasContainer.appendChild(article);

    });

}


mostrarLecturas();