const express = require('express')
const app = express();
const path = require('path')
const async = require('async');
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
const giphy = require('giphy-api')('hQZZ5e4DdsdQqY4prZpckQetnyZZpbqP');
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))

app.use(express.json());

app.post('/slack', (req, res1) => 
{
    requestStr = String(req.body.text);
    var url_to_slack = new Array();
    async.waterfall([
        (callback) => {
        giphy.search({
            q: requestStr,
            limit: 3,
            offset: 0,
            rating: 'g',
            fmt: 'json'
            }, (err, res) => {
                for (i in res.data) {
                  var img_url = res.data[i].images.fixed_height_downsampled.url
                  let img = {
                      fallback: 'error',
                      title: img_url,
                      image_url: img_url,
                      actions: [{name:'test',
                                text:'Pick Gif!',
                                type:'button',
                                value:i
                  }]};
                  url_to_slack.push(img);
                  console.log(i, '\n', JSON.stringify(url_to_slack), '\n');
                }
                callback(null, url_to_slack)
            }
        )},
        (url_to_slack, callback) => {
            let data_to_slack = { 
                username: 'giphypick',
                icon_emoji: ':dog:',
                response_type: 'ephemeral', // not public
                text: 'giphypick text here', 
                attachments: url_to_slack};
            console.log('data sent to slack: \n'+ data_to_slack);
            res1.json(JSON.parse(JSON.stringify(data_to_slack)))
        },
    ]);
});

app.post('/slackresponse', (req, res) => {
  let data_to_slack = { 
    username: 'giphypick',
    icon_emoji: ':dog:',
    response_type: 'ephemeral', // not public
    text: 'giphypick text here', 
    attachments: url_to_slack};
  res1.json(JSON.parse(JSON.stringify(data_to_slack)))
});

app.get('/', (req, res1) => 
{
    giphy.search({
        q: 'doge',
        limit: 1,
        offset: Math.floor(Math.random() * Math.floor(100)),
        rating: 'g',
        fmt: 'json'
        }, (err, res) => {
            img_url = res.data[0].images.original.url
            console.log('GET finished: '+ img_url)
            res1.send('<body><h1>giphy pick! \n</h1><img src="' + img_url + '" alt="doge mfkn gifs"><body>')
        }
    )
});