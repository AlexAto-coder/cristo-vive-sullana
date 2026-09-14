const videosEvangelisticos = [
    {
        titulo: "¿Y si hoy fuera el momento de acercarte a Dios?",
        youtubeId: "GWDnMTexa9o",
        categoria: "Evangelístico",
        descripcion:
            "Un mensaje para recordar que Dios te ama, Cristo te llama y hoy puedes acercarte a Él."
    }
];


const videosPageContainer =
    document.getElementById("videosPageContainer");


function mostrarVideosEvangelisticos() {

    if (!videosPageContainer) {
        return;
    }

    videosPageContainer.innerHTML = "";

    videosEvangelisticos.forEach(video => {

        const card = document.createElement("article");

        card.className = "video-card";

        card.innerHTML = `

            <a
                href="https://www.youtube.com/watch?v=${video.youtubeId}"
                target="_blank"
                rel="noopener noreferrer"
                class="video-thumbnail"
                aria-label="Ver ${video.titulo} en YouTube"
            >

                <img
                    src="https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg"
                    alt="${video.titulo}"
                    loading="lazy"
                >

                <span class="video-play">
                    <i class="bx bx-play"></i>
                </span>

            </a>


            <div class="video-info">

                <span class="video-category">
                    ${video.categoria}
                </span>

                <h3>
                    ${video.titulo}
                </h3>

                <p>
                    ${video.descripcion}
                </p>

            </div>

        `;

        videosPageContainer.appendChild(card);

    });
}


mostrarVideosEvangelisticos();