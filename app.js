const STORAGE_KEY =
  "kairo-control-v4";

const campanhasPadrao = [

  {
    nome:"Vença",
    meta:375,
    valor:237
  },

  {
    nome:"Proteínas Nestlé",
    meta:5,
    valor:5
  },

  {
    nome:"Amor de Mãe Ninho",
    meta:9,
    valor:1
  },

  {
    nome:"Faz Bem Sua Casa",
    meta:86,
    valor:34
  },

  {
    nome:"Biscoitos Galáxia",
    meta:13,
    valor:8
  },

  {
    nome:"KitKat F1",
    meta:29,
    valor:22
  },

  {
    nome:"Mucilon",
    meta:14,
    valor:4
  }

];

let campanhas =
  JSON.parse(
    localStorage.getItem(
      STORAGE_KEY
    )
  ) || campanhasPadrao;

function salvarDados(){

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(campanhas)
  );

}

function abrirModal(){

  document
    .getElementById("modal")
    .classList.add("active");

}

function fecharModal(){

  document
    .getElementById("modal")
    .classList.remove("active");

}

function salvarCampanha(){

  const nome =
    document
      .getElementById(
        "nomeCampanha"
      )
      .value
      .trim();

  const meta =
    parseInt(
      document
        .getElementById(
          "metaCampanha"
        )
        .value
    );

  if(!nome || !meta){

    alert(
      "Preencha os campos."
    );

    return;

  }

  campanhas.unshift({

    nome,
    meta,
    valor:0

  });

  salvarDados();

  renderizar();

  fecharModal();

  document
    .getElementById(
      "nomeCampanha"
    )
    .value = "";

  document
    .getElementById(
      "metaCampanha"
    )
    .value = "";

}

function adicionar(index){

  campanhas[index].valor++;

  salvarDados();

  renderizar();

}

function remover(index){

  if(
    campanhas[index].valor > 0
  ){

    campanhas[index].valor--;

    salvarDados();

    renderizar();

  }

}

function excluirCampanha(index){

  const confirmar =
    confirm(
      "Excluir campanha?"
    );

  if(!confirmar) return;

  campanhas.splice(index,1);

  salvarDados();

  renderizar();

}

function renderizar(){

  const lista =
    document.getElementById(
      "listaCampanhas"
    );

  lista.innerHTML = "";

  campanhas.forEach(
    (campanha,index)=>{

      const atingiu =
        campanha.valor >=
        campanha.meta;

      const percentual =
        Math.min(
          (
            campanha.valor
            / campanha.meta
          ) * 100,
          100
        );

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "row"
        + (atingiu
          ? " done"
          : "");

      row.innerHTML = `

        <div class="info">

          <div class="name">
            ${campanha.nome}
          </div>

          <div class="meta">

            ${campanha.valor}
            de
            ${campanha.meta}
            fotos

          </div>

          <div class="progress">

            <div
              class="bar"
              style="
                width:
                ${percentual}%
              ">
            </div>

          </div>

        </div>

        <div class="count">

          ${campanha.valor}

        </div>

        <div class="actions">

          <button
            class="minus"
            onclick="
              remover(${index})
            ">

            −

          </button>

          <button
            class="plus"
            onclick="
              adicionar(${index})
            ">

            +

          </button>

          <button
            class="delete"
            onclick="
              excluirCampanha(${index})
            ">

            ×

          </button>

        </div>

      `;

      lista.appendChild(row);

    }
  );

}

renderizar();
