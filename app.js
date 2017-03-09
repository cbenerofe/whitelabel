var express = require('express')
var stormpath = require('express-stormpath');
var request = require('request');

var app = express()

app.set('views', './views')
app.set('view engine', 'pug')

var server= "http://localhost:3000"
var user_enpoint = server + "api/user"
var group_id = "ec1c7d10-8bc8-4337-be60-944908236ae9"

app.use(express.static('public'));
app.use(stormpath.init(app, {
  client: {
    apiKey: {
      id: '163SGF4XDEZMLJEFTTIRCZ1OJ',
      secret: 'P9osZnu8sOEQb82iJJyu+aISpONzcT0OdJzd0AkfAKE',
    }
  },
  application: {
    href: 'https://api.stormpath.com/v1/applications/7I3YUrCjk5LPoesTXaCnBp'
  },
  expand: {
    customData: true,
  },

  postRegistrationHandler: function (account, req, res, next) {
    console.log('User:', account.email, 'just registered!');
    // console.log('account:', JSON.stringify(account) );

    // check if there is count.it user with that email 
     get_countit_token(account)

    
   /* 
    var resp1 = request.get( user_enpoint, {druser: uid, drauth: token}, function(  error, response, body ) {
     // user_data = data
      update()
      alert( "user data Loaded" );
    });
    */
    
    next();
  },

  postLoginHandler: function (account, req, res, next) {
    console.log('User:', account.email, 'just logged in!');

    // check if there is count.it user with that email 
    if (account.customData.countit_uid == undefined) {
      
      get_countit_token(account)
      
      
    } else {

      console.log ('countit token is ', account.customData.countit_uid)

      /*
      var resp1 = request.get( user_enpoint, {druser: uid, drauth: token}, function(  error, response, body ) {
       // user_data = data
        update()
        alert( "user data Loaded" );
      });
      */
      
    }

    next();
  }
}));


app.get('/', stormpath.authenticationRequired, function (req, res) {
  res.render('index')
})

app.on('stormpath.ready', function () {
  console.log('Stormpath Ready');
});

app.listen(4000, function () {
  console.log('Example app listening on port 4000!')
})


var get_countit_token = function(account) {

    console.log("getting countit token ")

    url = server + "/whitelabel/get_token"

    var resp1 = request( {url: url, qs: { email: account.email }}, function(  error, response, body ) {
     
      if (error) {

        return console.error('get token error', error)
      
      }

      if (response.statusCode != 200) {
        obj = JSON.parse(body)
        console.log(response.statusCode, obj.error)
        
        if (obj.error == 'no such user') {
            console.log('creating user in count.it')
            //console.log(account)
            url = server + "/whitelabel/create_user"
            // create user 
            formData = { 
              email: account.email, 
              firstname: account.givenName, 
              lastname: account.surname,
              group_id: group_id
            }

            var resp2 = request.post( {url: url, form: formData }, function(  error, response, body ) {

              console.log(body)

            });

        }

      } else {

        obj = JSON.parse(body)
        user_uid = obj["token"]
        console.log("got user token id ", user_uid)
        account.customData.countit_uid = user_uid 

        account.customData.save(function (err) {
          
          if (err) {
            console.log("error", err.userMessage)
            //res.status(400).end('Oops!  There was an error: ' + err.userMessage);
          } else {
            console.log("custom data saved")
            //res.end('Custom data was saved!');
          }
        });

      }
         
    });

  }