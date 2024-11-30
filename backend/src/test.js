import { indexDocuments } from './services/elasticsearchService.js';

(async () => {
    const sources = [
        './data/story.pdf',
    ];

    await indexDocuments(sources);
    console.log('Documents indexed successfully!');
})();