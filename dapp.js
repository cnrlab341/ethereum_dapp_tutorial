var express = require("express");
var app = express();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
server.listen(8080);

app.use(express.static("front"));
app.get("/", function(req, res){
	res.sendFile(__dirname + "/front/html/index.html");
})

var Web3 = require("web3");
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

var proofContract = web3.eth.contract([
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "owner",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "fileHash",
				"type": "string"
			}
		],
		"name": "FileStatus",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "fileHash",
				"type": "string"
			}
		],
		"name": "get",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "owner",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "owner",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "fileHash",
				"type": "string"
			}
		],
		"name": "set",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]);
var proof = proofContract.at("0x90c429ED51152C53bCEb4aC0A635439743b933bE");

app.get("/submit", function(req, res) {
	var fileHash = req.query.hash;
	var owner = req.query.owner;

	proof.set.sendTransaction(owner, fileHash, {
		from: web3.eth.accounts[0],},
		function(error, transactionHash) {
		if (!error) {
			res.send(transactionHash);
		} else {
			res.send("Error");
		}
	})
})

app.get("/information", function(req, res) {
	var fileHash = req.query.hash;
	res.send(proof.get.call(fileHash));
})

proof.FileStatus().watch(function(error, result) {
	if(!error) {
		if(result.args.status == true) {
			io.send(result);
		}
	}
})
