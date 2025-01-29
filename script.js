// html
const cancionesListaReproduccion = document.getElementById("canciones-lista-reproduccion");
const botonReproducir = document.getElementById("reproducir");
const botonPausar = document.getElementById("pausar");
const botonSiguiente = document.getElementById("siguiente");
const botonAnterior = document.getElementById("anterior");
const botonAleatorio = document.getElementById("aleatorio");

// Lista de todas las canciones
const todasLasCanciones = [
  {
    id: 0,
    title: "Scratching The Surface",
    artist: "Quincy Larson",
    duration: "4:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/scratching-the-surface.mp3",
  },
  {
    id: 1,
    title: "Can't Stay Down",
    artist: "Quincy Larson",
    duration: "4:15",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/can't-stay-down.mp3",
  },
  {
    id: 2,
    title: "Still Learning",
    artist: "Quincy Larson",
    duration: "3:51",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/still-learning.mp3",
  },
  {
    id: 3,
    title: "Cruising for a Musing",
    artist: "Quincy Larson",
    duration: "3:34",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cruising-for-a-musing.mp3",
  },
  {
    id: 4,
    title: "Never Not Favored",
    artist: "Quincy Larson",
    duration: "3:35",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/never-not-favored.mp3",
  },
  {
    id: 5,
    title: "From the Ground Up",
    artist: "Quincy Larson",
    duration: "3:12",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/from-the-ground-up.mp3",
  },
  {
    id: 6,
    title: "Walking on Air",
    artist: "Quincy Larson",
    duration: "3:25",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/walking-on-air.mp3",
  },
  {
    id: 7,
    title: "Can't Stop Me. Can't Even Slow Me Down.",
    artist: "Quincy Larson",
    duration: "3:52",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/cant-stop-me-cant-even-slow-me-down.mp3",
  },
  {
    id: 8,
    title: "The Surest Way Out is Through",
    artist: "Quincy Larson",
    duration: "3:10",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/the-surest-way-out-is-through.mp3",
  },
  {
    id: 9,
    title: "Chasing That Feeling",
    artist: "Quincy Larson",
    duration: "2:43",
    src: "https://cdn.freecodecamp.org/curriculum/js-music-player/chasing-that-feeling.mp3",
  },
];

// Crear objeto de audio y datos del usuario
const audio = new Audio();

let datosUsuario = {
  canciones: [...todasLasCanciones],    //copia del directorio de canciones
  cancionActual: null,                  // ausencia de valor no 0
  tiempoActualCancion: 0,
};

// para reproducir una canción
const reproducirCancion = (id) => {
  const cancion = datosUsuario?.canciones.find((cancion) => cancion.id === id);
  audio.src = cancion.src;
  audio.title = cancion.title;

  if (datosUsuario?.cancionActual === null || datosUsuario?.cancionActual.id !== cancion.id) {
    audio.currentTime = 0;
  } else {
    audio.currentTime = datosUsuario?.tiempoActualCancion;
  }
  datosUsuario.cancionActual = cancion;
  botonReproducir.classList.add("reproduciendo");

  resaltarCancion();
  pantallaReproductor();
  textAccesBotonRep();
  audio.play();
};

// para pausar la canción
const pausarCancion = () => {
  datosUsuario.tiempoActualCancion = audio.currentTime;
  botonReproducir.classList.remove("reproduciendo");
  audio.pause();
};

// para reproducir la siguiente canción
const reprodSigCancion = () => {
  if (datosUsuario?.cancionActual === null) {
    reproducirCancion(datosUsuario?.canciones[0].id);
  } else {
    const indiceCancionActual = indiceCancionActual();
    const siguienteCancion = datosUsuario?.canciones[indiceCancionActual + 1];
    reproducirCancion(siguienteCancion.id);
  }
};

// para reproducir la canción anterior
const reprodCancionAnte = () => {
  if (datosUsuario?.cancionActual === null) return;
  else {
    const indiceCancionActual = indiceCancionActual();
    const cancionAnterior = datosUsuario?.canciones[indiceCancionActual - 1];
    reproducirCancion(cancionAnterior.id);
  }
};

// para reproducir canciones en orden aleatorio
const aleatorio = () => {
  datosUsuario?.canciones.sort(() => Math.random() - 0.5);
  datosUsuario.cancionActual = null;
  datosUsuario.tiempoActualCancion = 0;

  renderizarCanciones(datosUsuario?.canciones);
  pausarCancion();
  pantallaReproductor();
  textAccesBotonRep();
};

// para eliminar una canción de la lista
const eliminarCancion = (id) => {
  if (datosUsuario?.cancionActual?.id === id) {
    datosUsuario.cancionActual = null;
    datosUsuario.tiempoActualCancion = 0;

    pausarCancion();
    pantallaReproductor();
  }

  datosUsuario.canciones = datosUsuario?.canciones.filter((cancion) => cancion.id !== id);
  renderizarCanciones(datosUsuario?.canciones);
  resaltarCancion();
  textAccesBotonRep();

  if (datosUsuario?.canciones.length === 0) {
    const botonReiniciar = document.createElement("button");
    const textoReiniciar = document.createTextNode("Reiniciar Lista");

    botonReiniciar.id = "reiniciar";
    botonReiniciar.ariaLabel = "Reiniciar lista";
    botonReiniciar.appendChild(textoReiniciar);
    cancionesListaReproduccion.appendChild(botonReiniciar);

    botonReiniciar.addEventListener("click", () => {
      datosUsuario.canciones = [...todasLasCanciones];

      renderizarCanciones(ordenarCanciones());
      textAccesBotonRep();
      botonReiniciar.remove();
    });
  }
};

// para establecer la pantalla del reproductor
const pantallaReproductor = () => {
  const tituloCancionReproductor = document.getElementById("titulo-cancion-reproductor");
  const artistaCancionReproductor = document.getElementById("artista-cancion-reproductor");
  const tituloActual = datosUsuario?.cancionActual?.title;
  const artistaActual = datosUsuario?.cancionActual?.artist;

  tituloCancionReproductor.textContent = tituloActual ? tituloActual : "";
  artistaCancionReproductor.textContent = artistaActual ? artistaActual : "";
};

// para resaltar la canción actual en la lista
const resaltarCancion = () => {
  const elementosCancionLista = document.querySelectorAll(".cancion-lista-reproduccion");
  const cancionAResaltar = document.getElementById(`cancion-${datosUsuario?.cancionActual?.id}`);

  elementosCancionLista.forEach((cancionEl) => {
    cancionEl.removeAttribute("aria-current");
  });

  if (cancionAResaltar) cancionAResaltar.setAttribute("aria-current", "true");
};

// para renderizar las canciones en la lista
const renderizarCanciones = (array) => {
  const cancionesHTML = array
    .map((cancion) => {
      return `
      <li id="cancion-${cancion.id}" class="cancion-lista-reproduccion">
      <button class="info-cancion-lista-reproduccion" onclick="reproducirCancion(${cancion.id})">
          <span class="titulo-cancion-lista-reproduccion">${cancion.title}</span>
          <span class="artista-cancion-lista-reproduccion">${cancion.artist}</span>
          <span class="duracion-cancion-lista-reproduccion">${cancion.duration}</span>
      </button>
      <button onclick="eliminarCancion(${cancion.id})" class="eliminar-cancion-lista-reproduccion" aria-label="Eliminar ${cancion.title}">
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="8" fill="#4d4d62"/>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M5.32587 5.18571C5.7107 4.90301 6.28333 4.94814 6.60485 5.28651L8 6.75478L9.39515 5.28651C9.71667 4.94814 10.2893 4.90301 10.6741 5.18571C11.059 5.4684 11.1103 5.97188 10.7888 6.31026L9.1832 7.99999L10.7888 9.68974C11.1103 10.0281 11.059 10.5316 10.6741 10.8143C10.2893 11.097 9.71667 11.0519 9.39515 10.7135L8 9.24521L6.60485 10.7135C6.28333 11.0519 5.7107 11.097 5.32587 10.8143C4.94102 10.5316 4.88969 10.0281 5.21121 9.68974L6.8168 7.99999L5.21122 6.31026C4.8897 5.97188 4.94102 5.4684 5.32587 5.18571Z" fill="white"/></svg>
        </button>
      </li>
      `;
    }).join("");

  cancionesListaReproduccion.innerHTML = cancionesHTML;
};

// para establecer el texto accesible del botón de reproducir
const textAccesBotonRep = () => {
  const cancion = datosUsuario?.cancionActual || datosUsuario?.canciones[0];

  botonReproducir.setAttribute(
    "aria-label",
    cancion?.title ? `Reproducir ${cancion.title}` : "Reproducir"
  );
};

// para obtener el índice de la canción actual
const indiceCancionActual = () => datosUsuario?.canciones.indexOf(datosUsuario?.cancionActual);

// Agregar eventos a los botones
botonReproducir.addEventListener("click", () => {
  if (datosUsuario?.cancionActual === null) {
    reproducirCancion(datosUsuario?.canciones[0].id);
  } else {
    reproducirCancion(datosUsuario?.cancionActual.id);
  }
});

botonPausar.addEventListener("click", pausarCancion);

botonSiguiente.addEventListener("click", reprodSigCancion);

botonAnterior.addEventListener("click", reprodCancionAnte);

botonAleatorio.addEventListener("click", aleatorio);

// Evento para cuando termina una canción
audio.addEventListener("ended", () => {
  const indiceCancionActual = indiceCancionActual();
  const existeSiguienteCancion = datosUsuario?.canciones[indiceCancionActual + 1] !== undefined;

  if (existeSiguienteCancion) {
    reprodSigCancion();
  } else {
    datosUsuario.cancionActual = null;
    datosUsuario.tiempoActualCancion = 0;
    pausarCancion();
    pantallaReproductor();
    resaltarCancion();
    textAccesBotonRep();
  }
});

// para ordenar las canciones a-z
const ordenarCanciones = () => {
  datosUsuario?.canciones.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }

    if (a.title > b.title) {
      return 1;
    }

    return 0;
  });

  return datosUsuario?.canciones;
};

// Renderizar las canciones y establecer el texto accesible del botón de reproducir
renderizarCanciones(ordenarCanciones());
textAccesBotonRep();