// fetch("http://localhost:3000/api/restaurants")
//   .then(response => response.json()) 
//   .then(data => console.log(data.uzenet)) 
//   .catch(err => console.error("Hiba a fetch során:", err));




fetch("http://localhost:3000/api/restaurants")
  .then(response => response.json())
  .then(data => {
    console.log(data);

    const container = document.createElement("div");
    container.innerHTML = "<h2>Foglalások</h2>";

    const table = document.createElement("table");
    table.border = "1";

  
    const header = Object.keys(data[0]).map(key => `<th>${key}</th>`).join("");
    table.innerHTML = `<tr>${header}</tr>`;

    
    data.forEach(row => {
      const tr = Object.values(row).map(val => `<td>${val}</td>`).join("");
      table.innerHTML += `<tr>${tr}</tr>`;
    });

    container.appendChild(table);
    document.body.appendChild(container);
  })
  .catch(err => console.error("Hiba a fetch során:", err));
