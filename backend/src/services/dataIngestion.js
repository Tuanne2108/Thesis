const { PDFLoader } = require("@langchain/community/document_loaders/fs/pdf");
const { elasticClient } = require("../config/elasticDb");
const { generateEmbedding } = require("../services/embeddingService");
const path = require("path");

// Path to your PDF file
const pdfFilePath = path.join(__dirname, "../data/story.pdf");


async function ingestData(pdfFilePath) {
  try {
    const indexName = "pdf_docs";

    // Load PDF data using PDFLoader
    const loader = new PDFLoader(pdfFilePath);
    const docs = await loader.load(); 
    for (const doc of docs) {
      let content = doc.pageContent;

      console.log("Parsed document content:", content);

      const title = `PDF Document - Page ${doc.metadata.pageNumber || "Unknown"}`;

      const embedding = await generateEmbedding(content);

      if (!embedding) {
        console.error(`Failed to generate embedding for document: ${title}`);
        continue;
      }

      // Index in Elasticsearch with the document content
      await elasticClient.index({
        index: indexName,
        body: {
          title,
          content,
          embedding,
        },
      });

      console.log(`Ingested document: ${title}`);
    }

    console.log("Data ingestion complete");
  } catch (error) {
    console.error(`Error ingesting data from PDF ${pdfFilePath}:`, error);
  }
}

// Call the function with your PDF file path
ingestData(pdfFilePath);
