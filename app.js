const STORAGE_KEY = "kairo-control-v2";

const campanhasPadrao = [
  { nome: "Vença", meta: 375, valor: 237 },
  { nome: "Proteínas Nestlé", meta: 5, valor: 5 },
  { nome: "Amor de Mãe Ninho", meta: 9, valor: 1 },
  { nome: "Faz Bem Sua Casa", meta: 86, valor: 34 },
  { nome: "Biscoitos Galáxia", meta: 13, valor: 8 },
  { nome: "KitKat F1", meta: 29, valor: 22 },
  { nome: "Mucilon", meta: 14, valor: 4 }
];

let campanhas =
  JSON.parse(localStorage.getItem(STORAGE_KEY))
  || campanhasPadrao;

function salvar(){
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(campanhas)
  );
}

function vibrar(tipo="normal"){

  if(!navigator.vibrate) return;

  if(tipo === "meta"){
    navigator.vibrate([80,40,120]);
  }else{
    navigator.vibrate(25);
  }
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

function criarCampanha(){

  const nome =
    document.getElementById("nome").value.trim();

  const meta =
    parseInt(
      document.getElementById("meta").value
    );

  if(!nome || !meta){
    alert("Preencha os campos.");
    return;
  }

  campanhas.unshift({
    nome,
    meta,
    valor:0
  });

  salvar();
  render();
  fecharModal();

  document.getElementById("nome").value="";
  document.getElementById("meta").value="";
}

function excluir(index){

  const confirmar = confirm(
    "Excluir campanha?"
  );

  if(!confirmar) return;

  campanhas.splice(index,1);

  salvar();
  render();
}

function add(index){

  campanhas[index].valor++;

  if(
    campanhas[index].valor ===
    campanhas[index].meta
  ){

    vibrar("meta");

    setTimeout(()=>{
      alert(
        "🎯 Meta atingida: "
        + campanhas[index].nome
      );
    },100);

  }else{
    vibrar();
  }

  salvar();
  render();
}

function sub(index){

  if(campanhas[index].valor > 0){

    campanhas[index].valor--;

    vibrar();

    salvar();
    render();
  }
}

function render(){

  const app =
    document.getElementById("app");

  app.innerHTML = "";

  campanhas.forEach((c,index)=>{

    const atingiu =
      c.valor >= c.meta;

    const percentual =
      Math.min(
        (c.valor / c.meta) * 100,
        100
      );

    const row =
      document.createElement("div");

    row.className =
      "row" + (atingiu ? " done" : "");

    row.innerHTML = `
    
      <div class="info">

        <div class="name">
          ${c.nome}
        </div>

        <div class="meta">
          ${c.valor} de ${c.meta} fotos
        </div>

        <div class="progress">
          <div 
            class="bar"
            style="width:${percentual}%">
          </div>
        </div>

      </div>

      <div class="count">
        ${c.valor}
      </div>

      <div class="actions">

        <button
          class="minus"
          onclick="sub(${index})">
          −
        </button>

        <button
          class="plus"
          onclick="add(${index})">
          +
        </button>

      </div>

    `;

    row.addEventListener("contextmenu",(e)=>{
      e.preventDefault();
      excluir(index);
    });

    app.appendChild(row);

  });

}

render();
