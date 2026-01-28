let albums = {};

// 앨범 추가
function addAlbum() {
  const albumName = document.getElementById("newAlbum").value.trim();
  if (!albumName || albums[albumName]) return;

  albums[albumName] = [];
  document.getElementById("newAlbum").value = "";
  renderAlbums();
  updateAlbumSelect();
}

// 앨범 선택창 업데이트
function updateAlbumSelect() {
  const select = document.getElementById("albumSelect");
  select.innerHTML = `<option value="">앨범 선택</option>`;
  Object.keys(albums).forEach(album => {
    const option = document.createElement("option");
    option.value = album;
    option.textContent = album;
    select.appendChild(option);
  });
}

// 포카 추가
function addCard() {
  const album = document.getElementById("albumSelect").value;
  const name = document.getElementById("cardName").value.trim();
  const file = document.getElementById("cardImage").files[0];

  if (!album || !name || !file) return;

  const reader = new FileReader();
  reader.onload = function () {
    albums[album].push({
      name,
      image: reader.result,
      owned: false
    });
    renderAlbums();
  };
  reader.readAsDataURL(file);

  document.getElementById("cardName").value = "";
  document.getElementById("cardImage").value = "";
}

// 앨범 & 포카 렌더링
function renderAlbums() {
  const container = document.getElementById("albumContainer");
  container.innerHTML = "";

  Object.keys(albums).forEach(albumName => {
    const albumDiv = document.createElement("div");
    albumDiv.className = "album";

    const title = document.createElement("div");
    title.className = "album-title";
    title.textContent = albumName;

    const grid = document.createElement("div");
    grid.className = "card-grid";

    title.onclick = () => {
      grid.style.display = grid.style.display === "none" ? "grid" : "none";
    };

    albums[albumName].forEach(card => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card" + (card.owned ? " owned" : "");

      const img = document.createElement("img");
      img.src = card.image;
      img.title = card.name;

      img.onclick = () => {
        card.owned = !card.owned;
        cardDiv.classList.toggle("owned");
      };

      cardDiv.appendChild(img);
      grid.appendChild(cardDiv);
    });

    albumDiv.appendChild(title);
    albumDiv.appendChild(grid);
    container.appendChild(albumDiv);
  });
}
