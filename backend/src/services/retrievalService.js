const {
    ElasticVectorSearch,
} = require("@langchain/community/vectorstores/elasticsearch");
const { vectorStore } = require("../config/elasticDb");
const filter = [
    {
        operator: "match",
    },
];

const retriever = vectorStore.asRetriever({
    filter: filter,
    k: 2,
});
retriever.invoke("lời lẽ khó chịu");

console.log(retriever.invoke("lời lẽ khó chịu"));
