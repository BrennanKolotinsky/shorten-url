const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shortUrl = require('./models/shortUrl.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//connect the database -- the use new url parser is required to work for the setup
mongoose.connect("mongodb+srv://test:root@cluster0-wn2ar.mongodb.net/test?retryWrites=true", { useNewUrlParser: true });

// this will load the html
app.use(express.static(__dirname + '/public'));

app.get("/new/:urlToShorten(*)", (req, res, next) => {
    var urlToShorten = req.params.urlToShorten; // deconstruction, the key will be the name of the parameter (urlToShorten), the value entered will be the value
    console.log(urlToShorten);
    var regex = /[-a-zA-Z0-9@:%_/+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_/+.~#?&\/=]*)?/gi;
    if(regex.test(req.params.urlToShorten) === true) {
        
        // grab a random number
        var short = Math.floor(Math.random()*100000).toString();

        // create a new piece of data using the short schema
        var data = new shortUrl( { 
            "originalUrl" : urlToShorten, 
            "shorterUrl": short 
        });

        // saves the new object in the database
        data.save(err=>{
            if(err) {
                return res.send('Error saving to database');
            }
        });

        return res.json(data);

    } else {
        return res.json( { "urlToShorten" : "failed" } );
    }
});

// this route will listen for numbers
app.get("/:number", (req, res, next) => {
    // res.json({'shorterUrl' : req.params.number});
    
    shortUrl.findOne({'shorterUrl' : req.params.number}, (err,data) => {
        // console.log("hi");
        if (err) {
            return res.send("Error reading database");
        } else {
            // console.log("oRhere");
            // return res.send(data.originalUrl);
            var redirectUrl = "https://" + data.originalUrl; // needs the https to redirect
            res.redirect(301, redirectUrl);
        }
    });
});

app.listen(process.env.PORT || 3000, ()=> {
    console.log("working");
});