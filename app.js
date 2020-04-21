//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.listen(process.env.PORT || 3000, function() {
  console.log("server is serving at 3000 port");
});

app.get("/", function(req, res) {

  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.fName;
  const secondName = req.body.lName;
  const email = req.body.email;

  console.log(firstName, secondName, email);
  const data = {
    members : [
      {
        email_address:email,
        status:"subscribed",
        merge_fields:{
          FNAME:firstName,
          LNAME:secondName
        }
      }
    ]
  };

  const JSONData = JSON.stringify(data);
  const options = {
    method :"POST",
//     auth:"Mohan:e04b1ca5370416bfd7f27b261a02b24b-us4"
  };

//   const mailChimpUrl = "https://us4.api.mailchimp.com/3.0/lists/68e7d5c53d";

  const postHttp = https.request(mailChimpUrl,options,function(response){
      console.log("status code : "+ response.statusCode);
      if(response.statusCode == 200){
        res.sendFile(__dirname + "/success.html");
      }
      else{
        res.sendFile(__dirname + "/failure.html");
      }
      response.on("data",function(data){
        console.log(JSON.parse(data));
      });
  });
  postHttp.write(JSONData);
  postHttp.end();



  // API KEY
  // e04b1ca5370416bfd7f27b261a02b24b-us4
  //list_id
  // 68e7d5c53d
});

app.post("/failure",function(req,res){
res.redirect("/");
});
