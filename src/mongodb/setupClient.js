const { MongoClient, ServerApiVersion } = require('mongodb');

const user = process.env.MONGODB_USER;
const pass = process.env.MONGODB_PASSWORD;

const uri = `mongodb+srv://${user}:${pass}@cluster0.fnp4bka.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

module.exports = { client };
