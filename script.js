const albums = {};
const albumsDiv = document.getElementById("albums");
const albumSelect = document.getElementById("albumSelect");
const summary = document.getElementById("summary");

function updateSummary() {
  let total = 0;
  let owned = 0;
  Object.values(albums).forEach(cards => {
    total += cards.length;
    cards.forEach(c => c.owned && owned++);
  });
  summary.textContent = `보유 ${owned} / 전체 ${total}`;
}

function addAlbum() {
  const name = albumInput.value.trim();
  if (!name || albums[name]) return;
  albums[name] = [];
  albumInput.value = "";
  render();
}

function addCard() {
  const album = albumSelect.value;
  const name = cardName.value.trim();
  const file = cardImage.files[0];
  if (!album || !file) return;

  const reader = new FileReader();
  reader.onload = () => {
    albums[album].push({
      name,
      image: reader.result,
      owned: false
    });
    render();
  };
  reader.readAsDataURL(file);

  cardName.value = "";
  cardImage.value = "";
}

function render() {
  albumsDiv.innerHTML = "";
  albumSelect.innerHTML = "";

  Object.keys(albums).forEach(albumName => {
    // select
    const opt = document.createElement("option");
    opt.value = albumName;
    opt.textContent = albumName;
    albumSelect.appendChild(opt);

    const albumDiv = document.createElement("div");
    albumDiv.className = "album";

    const title = document.createElement("div");
    title.className = "album-title";
    title.textContent = albumName;

    const grid = document.createElement("div");
    grid.className = "card-grid";

    // 짧게 클릭 → 접기/펼치기
    title.onclick = () => {
      grid.style.display = grid.style.display === "none" ? "grid" : "none";
    };

    // 꾹 누르기 → 앨범 삭제
    let albumPress;
    title.addEventListener("touchstart", () => {
      albumPress = setTimeout(() => {
        if (confirm("앨범을 삭제할까요?")) {
          delete albums[albumName];
          render();
        }
      }, 600);
    });
    title.addEventListener("touchend", () => clearTimeout(albumPress));

    albums[albumName].forEach((card, i) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card" + (card.owned ? " owned" : "");

      const img = document.createElement("img");
      img.src = card.image;

      // 클릭 → 보유
      img.onclick = () => {
        card.owned = !card.owned;
        render();
      };

      // 꾹 누르기 → 포카 삭제
      let cardPress;
      img.addEventListener("touchstart", () => {
        cardPress = setTimeout(() => {
          if (confirm("포카를 삭제할까요?")) {
            albums[albumName].splice(i, 1);
            render();
          }
        }, 600);
      });
      img.addEventListener("touchend", () => clearTimeout(cardPress));

      const nameDiv = document.createElement("div");
      nameDiv.className = "card-name";
      nameDiv.textContent = card.name;

      cardDiv.appendChild(img);
      cardDiv.appendChild(nameDiv);
      grid.appendChild(cardDiv);
    });

    albumDiv.appendChild(title);
    albumDiv.appendChild(grid);
    albumsDiv.appendChild(albumDiv);
  });

  updateSummary();
}
