const axios = require("axios");

// Definieer de gegevens voor het nieuwe to-do item
const newTodo = {
  title: "Maak boodschappenlijstje",
  category: "Boodschappen",
  date: "2024-05-26",
};

// Verzend het POST-verzoek naar het eindpunt
axios
  .post("http://localhost:3000/todos", newTodo)
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
