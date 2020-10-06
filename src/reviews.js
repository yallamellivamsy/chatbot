const request = require('request')

const fb_review_url = "https://www.facebook.com/Chat-Bot-Demo-102015441676862/reviews"
const google_review_url = "https://www.google.com/search?rlz=1C1GCEU_enIN854IN854&sxsrf=ALeKk01bLCG_DDUx0rZwMWEXnR7sqzsdTw:1602046459643&q=google+maps+l+and+t+bangalore&npsic=0&rflfq=1&rlha=0&rllag=12966857,77671341,10388&tbm=lcl&ved=2ahUKEwib2o-R2KHsAhXSgeYKHfZcCiQQtgN6BAgTEAc&rldoc=1#lrd=0x3bae175d958f9f0f:0xbea9efda472bf643,3,,,&rldoc=1&rlfi=hd:;si:13738775859046381123;mv:[[13.083535399999999,77.7333295],[12.8378485,77.5558885]]"

var generic_template = {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"generic",
        "elements":[
           {
            "title":"Thank You",
            "image_url":"https://www.lntvalves.com/media/37018/video-valves-noicon.jpg",
            "subtitle":"Please give Feedback on our service on below platforms",
            "default_action": {
              "type": "web_url",
              "url": fb_review_url,
              "webview_height_ratio": "tall",
            },
            "buttons":[
              {
                "type":"web_url",
                "url":fb_review_url,
                "title":"Facebook"
              },{
                "type":"web_url",
                "url":google_review_url,
                "title":"Google"
              }              
            ]      
          }
        ]
      }
    }
  }

function postReview(sender, token) {
	request({
		url: "https://graph.facebook.com/v2.6/me/messages",
		qs : {access_token: token},
		method: "POST",
		json: {
			recipient: {id: sender},
			"message":generic_template
		}
	}, function(error, response, body) {
		if (error) {
			console.log("sending error")
		} else if (response.body.error) {
			console.log("response body error")
		}
	})
}
  module.exports = { postReview }