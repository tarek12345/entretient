const express = require('express');
const axios = require('axios');
const app = express();

const API_BASE_URL = 'https://geo.api.gouv.fr/communes?codePostal=';

// Middleware pour parser le corps de la requête en JSON
app.use(express.json());

// Route GET /cities
app.get('/cities', async (req, res) => {
  try {
    // Valider la présence et le type du paramètre zipcode
    const zipcode = req.query.zipcode;

    if (!zipcode || typeof zipcode !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Le paramètre "zipcode" est obligatoire et doit être une chaîne de caractères.',
      });
    }

    // Appel à l'API tierce pour obtenir les villes
    const response = await axios.get(`${API_BASE_URL}${zipcode}`);

    // Extraire les noms des villes à partir de la réponse
    const cities = response.data.map(city => city.nom);

    // Répondre avec le résultat en JSON
    res.json({
      success: true,
      cities,
    });
  } catch (error) {
    // Gérer les erreurs lors de l'appel à l'API
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des villes.',
    });
  }
});

// Port sur lequel le serveur écoutera
const port = 3000;

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
