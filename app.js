const STORAGE_KEY = "kairo_control_campanhas_v2";

const campanhasPadrao = [
  { id: 1, nome: "Vença", meta: 375, valor: 237 },
  { id: 2, nome: "Proteínas Nestlé", meta: 5, valor: 5 },
  { id: 3, nome: "Amor de Mãe Ninho", meta: 9, valor: 1 },
  { id: 4, nome: "Faz Bem Sua Casa", meta: 86, valor: 33 },
  { id: 5, nome: "Biscoitos Galáxia", meta: 13, valor: 8 },
  { id: 6, nome: "KitKat F1", meta: 29, valor: 22 },
  { id: 7, nome: "Mucilon", meta: 14, valor: 4 }
];

let campanhas = JSON.parse(localStorage.getItem(STORAGE_KEY)) || campanhasPadrao;

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(campanhas));
}

function vibrar(tipo = "normal") {
  if (!navigator.vibrate) return;

  if (tipo === "meta") {
    navigator.vibrate([80, 50, 120]);
  } else {
    navigator.vibrate(25);
  }
}

function renderizar() {
  const lista = document.getElementById("listaCampanhas");

  if (!campanhas.length) {
    lista.innerHTML = `
      <div class="empty">
        Nenhuma campanha cadastrada.<br>
        Toque em <strong>+ Nova campanha</strong> para começar.
      </div>
    `;
    return;
  }

  lista.innerHTML = campanhas.map((c) => {
    const atingiu = Number(c.valor) >= Number(c.meta);
    const percentual = c.meta > 0 ? Math.min((c.valor / c.meta) * 100, 100) : 0;

    return `
      <div class="row ${atingiu ? "done" : ""}">
        <div class="info">
          <div class="name">${c.nome}</div>
          <div class="meta">${c.valor} de ${c.meta} fotos</div>
          <div class="progress">
            <div class="bar" style="width:${percentual}%"></div>
          </div>
        </div>

        <div class="count">${c.valor}</div>

        <div class="actions">
          <button class="btn-small minus" onclick="diminuir(${c.id})">−</button>
          <button class="btn-small plus" onclick="somar(${c.id})">+</button>

          <div class="menu-wrap">
            <button class="btn-small more" onclick="abrirMenu(${c.id})">⋯</button>
            <div class="menu" id="menu-${c.id}">
              <button onclick="editarCampanha(${c.id})">Editar</button>
              <button class="delete" onclick="excluirCampanha(${c.id})">Excluir</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function somar(id) {
  campanhas = campanhas.map(c => {
    if (c.id === id) {
      const novoValor = Number(c.valor) + 1;

      if (novoValor === Number(c.meta)) {
        vibrar("meta");
        setTimeout(() => {
          alert("🎯 Meta atingida: " + c.nome);
        }, 100);
      } else {
        vibrar();
      }

      return { ...c, valor: novoValor };
    }

    return c;
  });

  salvar();
  renderizar();
}

function diminuir(id) {
  campanhas = campanhas.map(c => {
    if (c.id === id) {
      return {
        ...c,
        valor: Math.max(Number(c.valor) - 1, 0)
      };
    }

    return c;
  });

  vibrar();
  salvar();
  renderizar();
}

function abrirMenu(id) {
  document.querySelectorAll(".menu").forEach(menu => {
    if (menu.id !== `menu-${id}`) {
      menu.classList.remove("open");
    }
  });

  document.getElementById(`menu-${id}`).classList.toggle("open");
}

function abrirModal() {
  document.getElementById("modalTitulo").textContent = "Nova campanha";
  document.getElementById("campanhaId").value = "";
  document.getElementById("nomeCampanha").value = "";
  document.getElementById("metaCampanha").value = "";
  document.getElementById("valorCampanha").value = "0";

  document.getElementById("modal").classList.add("open");
}

function fecharModal() {
  document.getElementById("modal").classList.remove("open");
}

function salvarCampanha() {
  const id = document.getElementById("campanhaId").value;
  const nome = document.getElementById("nomeCampanha").value.trim();
  const meta = Number(document.getElementById("metaCampanha").value);
  const valor = Number(document.getElementById("valorCampanha").value);

  if (!nome) {
    alert("Digite o nome da campanha.");
    return;
  }

  if (!meta || meta <= 0) {
    alert("Digite uma meta válida.");
    return;
  }

  if (valor < 0) {
    alert("O valor inicial não pode ser negativo.");
    return;
  }

  if (id) {
    campanhas = campanhas.map(c => {
      if (c.id === Number(id)) {
        return { ...c, nome, meta, valor };
      }

      return c;
    });
  } else {
    campanhas.push({
      id: Date.now(),
      nome,
      meta,
      valor
    });
  }

  salvar();
  fecharModal();
  renderizar();
}

function editarCampanha(id) {
  const campanha = campanhas.find(c => c.id === id);
  if (!campanha) return;

  document.getElementById("modalTitulo").textContent = "Editar campanha";
  document.getElementById("campanhaId").value = campanha.id;
  document.getElementById("nomeCampanha").value = campanha.nome;
  document.getElementById("metaCampanha").value = campanha.meta;
  document.getElementById("valorCampanha").value = campanha.valor;

  document.querySelectorAll(".menu").forEach(menu => menu.classList.remove("open"));
  document.getElementById("modal").classList.add("open");
}

function excluirCampanha(id) {
  const campanha = campanhas.find(c => c.id === id);
  if (!campanha) return;

  const confirmar = confirm(`Excluir a campanha "${campanha.nome}"?`);

  if (confirmar) {
    campanhas = campanhas.filter(c => c.id !== id);
    salvar();
    renderizar();
  }
}

document.getElementById("modal").addEventListener("click", function(e) {
  if (e.target.id === "modal") {
    fecharModal();
  }
});

document.addEventListener("click", function(e) {
  if (!e.target.closest(".menu-wrap")) {
    document.querySelectorAll(".menu").forEach(menu => menu.classList.remove("open"));
  }
});

renderizar();
