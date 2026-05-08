const STORAGE_KEY = "kairo-control-final";

const defaultCampaigns = [

  {
    name:"Vença",
    goal:375,
    value:237
  },

  {
    name:"Proteínas Nestlé",
    goal:5,
    value:5
  },

  {
    name:"Amor de Mãe Ninho",
    goal:9,
    value:1
  },

  {
    name:"Faz Bem Sua Casa",
    goal:86,
    value:34
  },

  {
    name:"Biscoitos Galáxia",
    goal:13,
    value:8
  },

  {
    name:"KitKat F1",
    goal:29,
    value:22
  },

  {
    name:"Mucilon",
    goal:14,
    value:4
  }

];

let campaigns =
  JSON.parse(
    localStorage.getItem(
      STORAGE_KEY
    )
  ) || defaultCampaigns;

function saveData(){

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(campaigns)
  );

}

function openModal(){

  document
    .getElementById("modal")
    .classList.add("active");

}

function closeModal(){

  document
    .getElementById("modal")
    .classList.remove("active");

}

function saveCampaign(){

  const name =
    document
      .getElementById("campaignName")
      .value
      .trim();

  const goal =
    parseInt(
      document
        .getElementById("campaignGoal")
        .value
    );

  if(!name || !goal){

    alert(
      "Preencha os campos."
    );

    return;

  }

  campaigns.unshift({

    name,
    goal,
    value:0

  });

  saveData();

  render();

  closeModal();

  document
    .getElementById("campaignName")
    .value = "";

  document
    .getElementById("campaignGoal")
    .value = "";

}

function add(index){

  campaigns[index].value++;

  saveData();

  render();

}

function remove(index){

  if(
    campaigns[index].value > 0
  ){

    campaigns[index].value--;

    saveData();

    render();

  }

}

function deleteCampaign(index){

  const confirmDelete =
    confirm(
      "Excluir campanha?"
    );

  if(!confirmDelete) return;

  campaigns.splice(index,1);

  saveData();

  render();

}

function render(){

  const campaignsDiv =
    document.getElementById(
      "campaigns"
    );

  campaignsDiv.innerHTML = "";

  campaigns.forEach(
    (campaign,index)=>{

      const done =
        campaign.value >=
        campaign.goal;

      const percent =
        Math.min(
          (
            campaign.value
            / campaign.goal
          ) * 100,
          100
        );

      const row =
        document.createElement(
          "div"
        );

      row.className =
        "row"
        + (done
          ? " done"
          : "");

      row.innerHTML = `

        <div class="info">

          <div class="name">

            ${campaign.name}

          </div>

          <div class="meta">

            ${campaign.value}
            de
            ${campaign.goal}
            fotos

          </div>

          <div class="progress">

            <div
              class="bar"
              style="
                width:${percent}%
              ">
            </div>

          </div>

        </div>

        <div class="count">

          ${campaign.value}

        </div>

        <div class="actions">

          <button
            class="minus"
            onclick="
              remove(${index})
            ">

            −

          </button>

          <button
            class="plus"
            onclick="
              add(${index})
            ">

            +

          </button>

          <button
            class="delete"
            onclick="
              deleteCampaign(${index})
            ">

            ×

          </button>

        </div>

      `;

      campaignsDiv.appendChild(row);

    }
  );

}

render();
