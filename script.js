const albumsDiv = document.getElementById("albums");
const albumSelect = document.getElementById("albumSelect");
const summary = document.getElementById("summary");

document.getElementById("addAlbumBtn").onclick = addAlbum;
document.getElementById("addCardBtn").onclick = addCard;

let albums = JSON.parse(localStorage.getItem("albums")) || {};

// 최초 렌더
render();

function save() {
  localStorage.setItem("albums", JSON.stringify(albums));
}

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
  const input = document.getElementById("albumInput");
  const name = input.value.trim();
  if (!name || albums[name]) return;

  albums[name] = [];
  input.value = "";
  save();
  render();
}

function addCard() {
  const album = albumSelect.value;
  const name = document.getElementById("cardName").value.trim();
  const file = document.getElementById("cardImage").files[0];
  if (!album || !file) return;

  const reader = new FileReader();
  reader.onload = () => {
    albums[album].push({
      name,
      image: reader.result,
      owned: false
    });
    save();
    render();
  };
  reader.readAsDataURL(file);

  document.getElementById("cardName").value = "";
  document.getElementById("cardImage").value = "";
}

function render() {
  albumsDiv.innerHTML = "";
  albumSelect.innerHTML = "";

  Object.keys(albums).forEach(albumName => {
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

    let folded = false;
    let pressTimer;

    title.addEventListener("touchstart", () => {
      pressTimer = setTimeout(() => {
        if (confirm("앨범을 삭제할까요?")) {
          delete albums[albumName];
          save();
          render();
        }
      }, 600);
    });

    title.addEventListener("touchend", () => {
      clearTimeout(pressTimer);
      folded = !folded;
      grid.style.display = folded ? "none" : "grid";
    });

    albums[albumName].forEach((card, index) => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card" + (card.owned ? " owned" : "");

      const img = document.createElement("img");
      img.src = card.image;

      img.onclick = () => {
        card.owned = !card.owned;
        save();
        render();
      };

      let cardTimer;
      img.addEventListener("touchstart", () => {
        cardTimer = setTimeout(() => {
          if (confirm("포카를 삭제할까요?")) {
            albums[albumName].splice(index, 1);
            save();
            render();
          }
        }, 600);
      });
      img.addEventListener("touchend", () => clearTimeout(cardTimer));

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
