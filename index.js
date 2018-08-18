const express = require('express')
const path = require('path')
const express = require('express');
const async = require('async');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
const giphy = require('giphy-api')
const PORT = process.env.PORT || 5000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

  app.post('/slack', (req, res1) => 
{
    requestStr = parseInt(req.body.text);
    var url_to_slack = new Array();
    async.waterfall([
        (callback) => {
        var giphy = require('giphy-api')('hQZZ5e4DdsdQqY4prZpckQetnyZZpbqP');
        giphy.search({
            q: requestStr,
            limit: 5,
            offset: 0,
            rating: 'g',
            fmt: 'json'
            }, (err, res) => {
                for (i in res.data) {
                    var img_url = res.data[i].images.fixed_height_downsampled.url
                    let img = {
                        fallback: 'error',
                        title: 'img',
                        image_url: img_url};
                    url_to_slack.push(img);
                    console.log(i, '\n', JSON.stringify(url_to_slack), '\n');
                }
                callback(null, url_to_slack)
            }
        )},
        (url_to_slack, callback) => {
            console.log('test \n', url_to_slack);
            let data_to_slack = { 
                username: 'giphypick',
                icon_emoji: ':dog:',
                response_type: 'in_channel', // public to the channel 
                text: 'giphypick text here', 
                attachments: url_to_slack};
            console.log(data_to_slack);
            res1.json(JSON.parse(JSON.stringify(data_to_slack)))
        },
    ]);
});

app.get('/', (req, res1) => 
{

    var giphy = require('giphy-api')('hQZZ5e4DdsdQqY4prZpckQetnyZZpbqP');
    giphy.search({
        q: 'doge',
        limit: 1,
        offset: Math.floor(Math.random() * Math.floor(100)),
        rating: 'g',
        fmt: 'json'
        }, (err, res) => {
            img_url = res.data[0].images.original.url
            console.log(img_url)
            res1.send('<body><h1>welcome to dogegifs</h1><img src="' + img_url + '" alt="doge mfkn gifs"><h2>refresh page for moar</h2><body>')
        }
    )
});