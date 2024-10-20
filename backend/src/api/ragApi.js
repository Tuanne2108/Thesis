const express = require('express');
const { retrieveRelevantDocuments } = require('../services/retrievalService');
const { generateResponse } = require('../services/generationService');

const router = express.Router();

router.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    const relevantDocs = await retrieveRelevantDocuments(query);
    const response = await generateResponse(query, relevantDocs);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
