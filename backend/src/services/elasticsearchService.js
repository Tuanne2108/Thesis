import elasticClient from '../config/elasticDb.js';
import { generateEmbeddings } from './embeddingService.js';
import DocumentLoader from './documentLoader.js';

export const indexDocuments = async (sources) => {
    const loader = new DocumentLoader();

    for (const source of sources) {
        let documents;

        if (source.startsWith('http://') || source.startsWith('https://')) {
            documents = [await loader.loadFromWeb(source)];
        } else {
            documents = await loader.loadDocuments(source);
        }

        const texts = documents.map(doc => doc.pageContent);
        const embeddings = await generateEmbeddings(texts);

        for (let i = 0; i < documents.length; i++) {
            const doc = documents[i];
            await elasticClient.index({
                index: 'book',
                body: {
                    text: doc.pageContent,
                    embedding: embeddings[i],
                    metadata: doc.metadata,
                },
            });
        }
    }
};

export const retrieveDocuments = async (query) => {
    const { body } = await elasticClient.search({
        index: 'book',
        body: {
            query: {
                match: {
                    text: query
                }
            }
        }
    });

    return body.hits.hits.map(hit => hit._source);
};