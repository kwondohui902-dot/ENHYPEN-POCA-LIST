const albumSelect = document.getElementById("albumSelect");
const albumContainer = document.getElementById("albumContainer");

let albums = JSON.parse(localStorage.getItem("albums")) || {};

function saveAlbums() {
  localStorage.setItem("albums", JSON.stringify(albums));
}

function renderAlbums() {
  albumContainer.innerHTML = "";

  Object.keys(albums).forEach(albumName => {
    const section = document.createElement("div");
    section.className = "album-section";

    const title = document.createElement("div");
    title.className = "album-title";
    title.textContent = "▶ " + albumName;

    const cards = document.createElement("div");
    cards.className = "card-container";
    cards.style.display = "none";

    title.onclick = () => {
      const open = cards.style.display === "grid";
      cards.style.display = open ? "none" : "grid";
      title.textContent = (open ? "▶ " : "▼ ") + albumName;
    };

    albums[albumName].forEach(card => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card";

      const img = document.createElement("img");
      img.src = card.img;

      const name = document.createElement("div");
      name.className = "card-name";
      name.textContent = card.name;

      cardDiv.appendChild(img);
      cardDiv.appendChild(name);
      cards.appendChild(cardDiv);
    });

    section.appendChild(title);
    section.appendChild(cards);
    albumContainer.appendChild(section);
  });

  albumSelect.innerHTML = "";
  Object.keys(albums).forEach(a => {
    const opt = document.createElement("option");
    opt.value = a;
    opt.textContent = a;
    albumSelect.appendChild(opt);
  });
}

function addAlbum() {
  const name = document.getElementById("newAlbum").value.trim();
  if (!name || albums[name]) return;
  albums[name] = [];
  saveAlbums();
  renderAlbums();
  document.getElementById("newAlbum").value = "";
}

function addCard() {
  const name = document.getElementById("cardName").value.trim();
  const imgInput = document.getElementById("cardImage");
  const album = albumSelect.value;

  if (!name || !imgInput.files[0]) return;

  const reader = new FileReader();
  reader.onload = () => {
    albums[album].push({ name, img: reader.result });
    saveAlbums();
    renderAlbums();
  };
  reader.readAsDataURL(imgInput.files[0]);

  document.getElementById("cardName").value = "";
  imgInput.value = "";
}

renderAlbums();
