var express = require('express');

var request = require('request'); // "Request" library


var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.post('/get_token', function (req, res) {

  var getClientId = function(){
    var pr = new Promise(function(resolve, reject){
      var datos = {
        client_id : req.body.client_id, // Your client id
        client_secret : req.body.client_id, // Your secret
        grant_type : req.body.grant_type
      };
      if (datos.client_id && datos.client_secret && datos.grant_type)
      resolve(req.body);
    });
    return pr;
  };

  var solicitarToken = function(data){

    var pr = new Promise(function(resolve, reject){
      var datos = {
        client_id : req.body.client_id, // Your client id
        client_secret : req.body.client_id, // Your secret
        grant_type : req.body.grant_type
      };

      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Authorization': 'Basic ' + (new Buffer(data.client_id + ':' + data.client_secret).toString('base64'))
        },
        form: {
          grant_type: data.grant_type
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          // use the access token to access the Spotify Web API
          if (body.access_token)
            resolve(body.access_token);
        }
      });
    });
    return pr;
  };

  var devolverToken = function (data){
    console.log(data);
    res.send(data);

  };

  getClientId()
    .then(solicitarToken)
    .then(devolverToken);

});




var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
