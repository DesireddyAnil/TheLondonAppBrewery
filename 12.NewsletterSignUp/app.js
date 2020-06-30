//requiring our packages which are necessary for project (native and fom npm)

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https"); //from node.js native modules


const app = express();


app.use(bodyParser.urlencoded({
  extended: true
})); //to extract data from forms of html
app.use(express.static("public")); //specifying endpoint for static files



app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});


app.post("/", function(req, res) {

  //capturing data from user into server
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  //creating a json object for our data in a format specified by api
  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  //converting structured json data into flat pack string json object
  const jsonData = JSON.stringify(data);


  //pre-requisites for posting json object to mailchimp server
  const url = "https://us10.api.mailchimp.com/3.0/lists/c0c7b17286";
  const options = {
    method: "POST",
    auth: "anil:8c07e94b473015f64539d6102e65e66b-us10"
  }


  //posting jsonData to mailchimp server (this part to be done by reffering api documentation of mailchimp)
  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {});
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
  });
  request.write(jsonData);
  request.end();
});


app.post("/failure", function(req, res) {
  res.redirect("/");

});



app.listen(process.env.PORT, function() {
  console.log("server up and running on 3000");
});
//list id c0c7b17286
//apiKey 8c07e94b473015f64539d6102e65e66b-us10
