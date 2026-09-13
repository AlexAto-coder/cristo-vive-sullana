/* =========================================================
   CRISTO VIVE – SULLANA
   JAVASCRIPT PRINCIPAL
========================================================= */


/* =========================================================
   MENÚ MÓVIL
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

if (menuToggle && nav) {

    menuToggle.addEventListener("click", function () {

        nav.classList.toggle("show");

        const icon = menuToggle.querySelector("i");

        if (nav.classList.contains("show")) {

            icon.classList.remove("bx-menu");
            icon.classList.add("bx-x");

        } else {

            icon.classList.remove("bx-x");
            icon.classList.add("bx-menu");

        }

    });


    /* Cerrar el menú al hacer clic en un enlace */

    const navLinks = nav.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            nav.classList.remove("show");

            const icon = menuToggle.querySelector("i");

            icon.classList.remove("bx-x");
            icon.classList.add("bx-menu");

        });

    });

}


/* =========================================================
   VIDEOS DE YOUTUBE
========================================================= */

const videos = [

    {
        titulo: "La fe de Abraham",
        youtubeId: "FNzb4LlO08Y",
        categoria: "Reflexión",
        descripcion: "Una reflexión sobre el camino de fe de Abraham y su confianza en Dios."
    },

    {
        titulo: "Cuando Dios parece guardar silencio",
        youtubeId: "MlNRCYRfm7E",
        categoria: "Reflexión",
        descripcion: "Una palabra de esperanza para aprender a confiar en Dios en tiempos difíciles."
    },

    {
        titulo: "Cuando la gracia se encuentra con la verdad",
        youtubeId: "c76rtCLcUhI",
        categoria: "Predicación",
        descripcion: "Una enseñanza donde Dios te ofrece perdón, una nueva oportunidad y una vida transformada."
    }

];


/* =========================================================
   CONTENEDOR DE VIDEOS
========================================================= */

const videosContainer = document.getElementById("videosContainer");


/* =========================================================
   MOSTRAR VIDEOS
========================================================= */

function mostrarVideos() {

    if (!videosContainer) {
        return;
    }

    videosContainer.innerHTML = "";


    videos.forEach(function (video) {

        const article = document.createElement("article");

        article.classList.add("video-card");


        const enlace = document.createElement("a");

        enlace.href = "https://www.youtube.com/watch?v=" + video.youtubeId;
        enlace.target = "_blank";
        enlace.rel = "noopener noreferrer";
        enlace.classList.add("video-thumbnail");


        const imagen = document.createElement("img");

        imagen.src = "https://img.youtube.com/vi/" + video.youtubeId + "/hqdefault.jpg";
        imagen.alt = video.titulo;
        imagen.loading = "lazy";


        const botonPlay = document.createElement("span");

        botonPlay.classList.add("video-play");

        botonPlay.innerHTML = '<i class="bx bx-play"></i>';


        enlace.appendChild(imagen);
        enlace.appendChild(botonPlay);


        const informacion = document.createElement("div");

        informacion.classList.add("video-info");


        const categoria = document.createElement("span");

        categoria.classList.add("video-category");
        categoria.textContent = video.categoria;


        const titulo = document.createElement("h3");

        titulo.textContent = video.titulo;


        const descripcion = document.createElement("p");

        descripcion.textContent = video.descripcion;


        informacion.appendChild(categoria);
        informacion.appendChild(titulo);
        informacion.appendChild(descripcion);


        article.appendChild(enlace);
        article.appendChild(informacion);


        videosContainer.appendChild(article);

    });

}


/* =========================================================
   INICIAR
========================================================= */

mostrarVideos();