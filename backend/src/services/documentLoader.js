import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import axios from 'axios';
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

class DocumentLoader {
    async loadCSV(filePath) {
        const results = [];
        return new Promise((resolve, reject) => {
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (data) => results.push({ text: JSON.stringify(data) }))
                .on('end', () => resolve(results))
                .on('error', (error) => reject(error));
        });
    }

    async loadPDF(filePath) {
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();
        return docs.map(doc => ({
            text: doc.pageContent,
            metadata: doc.metadata || {},
        }));
    }

    async loadWeb(url) {
        const response = await axios.get(url);
        const loader = new CheerioWebBaseLoader(url);
        const docs = await loader.load();
        return docs.map(doc => ({
            text: doc.text,
            metadata: { url },
        }));
    }

    async loadText(filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return [{ text: fileContent, metadata: { filePath } }];
    }

    async loadDocuments(source) {
        const ext = path.extname(source).toLowerCase();
        if (!fs.existsSync(source)) {
            throw new Error(`File not found: ${source}`);
        }
        switch (ext) {
            case '.csv':
                return await this.loadCSV(source);
            case '.pdf':
                return await this.loadPDF(source);
            case '.txt':
                return await this.loadText(source);
            default:
                throw new Error(`Unsupported file type: ${ext}`);
        }
    }

    async loadFromWeb(url) {
        return await this.loadWeb(url);
    }
}

export default DocumentLoader;