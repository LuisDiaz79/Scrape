const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const router = express.Router();

// Import the model (cat.js) to use its database functions.
const article = require("../models/Article.js");
const Note = require("../models/Note.js");

router.get("/", function (req, res) {

    console.log('GETTING ARTICLES');
    // First, we grab the body of the html with axios
    let newArticles = [];
    axios.get("https://www.newegg.com/").then(function (response) {
        console.log('*');
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        let $ = cheerio.load(response.data);
        console.log('**');

        $('.item-container-grid').each((index, element) => {
            let tPrice = $(element).find('.price-current').text().trim();
            tPrice = tPrice.split('.');
            let total = parseInt(tPrice[0].substring(1, tPrice[0].length));
            let cents = (tPrice[1]) ? tPrice[1].substring(0, 2) : 0;
            let price = parseFloat(`${total}.${cents}`)
            if (!isNaN(price)) {
                console.log(index);
                let title = $(element).find('.item-title').text();
                let artlink = $(element).find('.item-img').attr('href');
                let img = 'https://'+$(element).find('img').attr('src').substr(2);
                newArticles.push({ title, artlink, price, img});
            }
        });
        if (newArticles) {
            article.create(newArticles)
                .then(dbArticle => {
                    newArticles=[];
                    console.log(dbArticle);
                    dbArticle.map((element) => {
                        newArticles.push({
                            id : element._id,
                            title : element.title,
                            artlink : element.artlink,
                            price : element.price,
                            img : element.img
                        });
                    });
                    console.log(newArticles);
                    return res.render('index', {
                        jsonData: newArticles
                      });
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json(err);
                });
        }
    });

});

router.get("/api/articles/:id", function (req, res) {
    console.log(`ID: ${req.params.id}`);
    article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    //.populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      console.log(err);
      res.json(err);
    });
});

router.post("/api/articles/:id", function (req, res) {
    console.log(`POST ID: ${req.body}`);
    
    
    Note.create(req.body.note)
    .then(function(dbNote) {
        console.log(dbNote);
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      //return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });

});

router.delete("/api/articles/:id", function (req, res) {


});

// Export routes for server.js to use.
module.exports = router;
