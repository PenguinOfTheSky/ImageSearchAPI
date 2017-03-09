var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var https=require('https')



var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
  let    cache = []
app.use(function(req, res, next) {
  'use strict'
  let url = req.url,
      latest = /^(latest)/,
      api = /^(api\/)/,
      readable = /,+/;
      let key = 'AIzaSyAmV2RbTRonWHtZ5HVhDiYl1TQXNCfCoxg'

        url = url.slice(1)
              if (url.length == '') {
      res.end(`type /api/latest at end of url to see recent searches or /api/ + your search terms to search for stuff`)
      } else {

        if (api.test(url) == true) {
          url = url.slice(4)
          if (latest.test(url) == true) {

            res.end(JSON.stringify(cache))
            } else {
            let response = ``
            let now = new Date
              cache.unshift({'url' : url, 'date' : now})
                         //start ajax
              var options = {
                host: 'https://www.googleapis.com/customsearch/v1?',
                path: 'key=' + key + '&cx=011202598822239108100:svgwg_nsq6u&q=lolcats'
              };
          let offset = ''

            let loc = url.search(/(\?offset=)/)
                        if (loc != -1) {
                        offset = url.slice(loc)
                        url = url.slice(0, loc)
                offset = 'start=' + offset.slice(8) + '&'
              }
                        let path = 'https://www.googleapis.com/customsearch/v1?key=' + key + '&cx=011202598822239108100:svgwg_nsq6u&searchType=image&'+ offset + 'q=' + url
              var req = https.get(path, function(result) {
        //        console.log('STATUS: ' + result.statusCode);
            //    console.log('HEADERS: ' + JSON.stringify(result.headers));


                // Buffer the body entirely for processing as a whole.
                var bodyChunks = [];
                result.on('data', function(chunk) {
                  // You can process streamed parts here...
                  bodyChunks.push(chunk);
                }).on('end', function() {
                  var body = Buffer.concat(bodyChunks);

                  body = (JSON.parse(body.toString('utf8')).items);
                  console.log(body[0])
                  for (let i = 0; i < 10; i++) {
                  var arr1 = `{
  url : ${body[i].link}
  snippet : ${body[i].title}
  thumnail : ${body[i].image.thumbnailLink}
  context : ${body[i].image.contextLink}
}

                  `
                  response += arr1;
                }

                  // ...and/or process the entire body here.
                  res.end(response)
                })
              });

              req.on('error', function(e) {
                console.log('ERROR: ' + e.message);
              });


          }

        } else {
          res.redirect('/')
        }

      }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
