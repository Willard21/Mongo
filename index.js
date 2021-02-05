const fetch = require("node-fetch")
const fs = require("fs")
const http = require("http")
const express = require("express")
const bodyParser = require("body-parser")
const {MongoClient} = require('mongodb');
const client = new MongoClient("mongodb://localhost:27017")

var cors = require('cors')
const app = express()

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(bodyParser.raw())
app.use(cors())
const server = http.createServer(app)

server.listen(process.env.PORT || 8080, () => {
	console.log(`Server started on port ${server.address().port} :)`)
});

async function test() {
	await client.connect()
	let dbo = client.db("test")
	let table = await dbo.collection("data")
	await table.updateOne({
		_id: 2
	}, { $set: {
		_id: 2,
		name: "Bob",
		age: 42
	}}, {
		upsert: true
	})
	console.log(await table.find({}).toArray())
	client.close()
}

test()

app.get("/", async function(req, res) {
	console.log(req.connection.remoteAddress)
    res.send(await fetch("https://google.com").then(r => r.text()))
})
// app.post("/", async function(req, res) {
//     console.log("Loading data from client!")
// 	let query = req.body.data

// 	res.send(eval(query))
// })