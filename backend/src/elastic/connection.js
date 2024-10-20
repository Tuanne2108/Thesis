const { Client } = require("@elastic/elasticsearch-serverless");
const client = new Client({
    node: "https://thesis-project-fb98ce.es.us-east-1.aws.elastic.cloud:443",
    auth: {
        apiKey: "bklhX2ZwSUIxOEhGUlRRek4zT0E6aFNDbzVnMk5Rd1dQRDg0VDRiN3ljZw==",
    },
});

async function prepare() {
    const response = await client.index({
        index: "my-index",
        id: "1",
        refresh: true,
        body: {
            content: "This is a sample document.",
        },
    });
    console.log(response);
    const response2 = await client.get({
        index: "my-index",
        id: "1",
    });
    console.log(response2);
}
prepare().catch((err) => {
    console.error("Error:", err);
    process.exit(1);
});
