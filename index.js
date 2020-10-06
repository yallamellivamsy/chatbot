'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const reviews = require("./src/reviews")

const app = express()
const port = 5000
let welcome_message = 0;

app.set('port', (port))

// Allows us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES

app.get('/', function(req, res) {
	res.send("Hi I am a chatbot")
})
app.get('/vamsy', function(req, res) {
	res.send("")
})

let token = "EAAE9AzGbSZBoBABeuyZAivZCHmVJXoZCVw7EcZBdJfgsajZB82YEGuOFbAZCNlJHsyincSYECUcFxidTY1SfqnsaQqU6ndZATnHdYbdhSeZB4EMMMdeLTfbPZCvR9tTy2rREZCWaC6rJ9r1CnQziZAZAhnc81HX3AvOZC1CYRHh45Ou1QXdlrZCf6F6hA4RXrLtWLP47WAZD"

// Facebook 

app.get('/webhook/', function(req, res) {
	if (req.query['hub.verify_token'] === "FBChatBot") {
		res.send(req.query['hub.challenge'])
	}
	res.send("Wrong token")
})

app.post('/webhook/', function(req, res) {
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++) {
		let event = messaging_events[i]
		let sender = event.sender.id
		if (event.message && event.message.text) {
			let text = event.message.text
			if(welcome_message == 0){
				sendText(sender, "Hi \n" + "Thanks for reaching us... \nHow may I help you")
				welcome_message = 1;
			}else if (welcome_message == 1){
				sendText(sender, "We will provide information regarding education\n"
						+ " 1. When our schools will open \n"
						+ " 2. Fees \n" 
						+ " 3. Finish Conversation \n")
				welcome_message = 2;
			}else if( text == "1"){
				sendText(sender, "Our Schools will starts from 15th Nov-2020 ")
			}else if( text == "2"){
				sendText(sender, "Due to COVID-19 situation, 15% off fee will be reduced...")
			}else if( text == "3"){
				welcome_message = 0;
				reviews.postReview(sender,token)
			}
			else{
				sendText(sender, "Please choose options from 1 to 3")
			}
			//sendText(sender, "" + text.substring(0, 100))
			//sendText(sender, "https://www.facebook.com/chatbotvamsy/reviews/?ref=page_internal")
		}
	}
	res.sendStatus(200)
})

function sendText(sender, text) {
	let messageData = {text: text}
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			"message":messageData
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}

app.listen(app.get('port'), function() {
	console.log("running: port - " + port)
})
