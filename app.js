var express = require('express')
var stormpath = require('express-stormpath');
var request = require('request');

var app = express()

app.set('views', './views')
app.set('view engine', 'pug')

var server= "http://localhost:3000"
var user_enpoint = server + "api/user"

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

  postRegistrationHandler: function (account, req, res, next) {
    console.log('User:', account.email, 'just registered!');
    // console.log('account:', JSON.stringify(account) );
    // check if have count.it id & token saved
    if (account.customData.countit_uid == undefined) {
      // check if already registered on count.it
      // register in count.it or check
      var resp2 = request.post( user_enpoint + "/login", {email: email, password: password},function( error, response, body ) {
        /*
        uid = data.ident
        token = data.ident
      
        var resp3 = request.get( url, {druser: uid, drauth: token}, function( data ) {
            user_data = data
            update()
            alert( "user data Loaded" );
          });
        resp2.fail(function ( data) {
          alert( "second get fail:" + JSON.stringify(data));
        });
        */
      });
      
    } else {
      
      
    }
    
    
    var resp1 = request.get( user_enpoint, {druser: uid, drauth: token}, function(  error, response, body ) {
     // user_data = data
      update()
      alert( "user data Loaded" );
    });
    
    
    next();
  },

  postLoginHandler: function (account, req, res, next) {
    console.log('User:', account.email, 'just logged in!');
    //console.log('account:', JSON.stringify(account) );


    // check if have count.it id & token saved
    if (account.customData.countit_uid == undefined) {
      // check if already registered on count.it
      // register in count.it or check

      url = server + "/whitelabel/get_token"
      var resp2 = request.post( {url: url, formData: { email: account.email }}, function(  error, response, body ) {
       

        if (error) {
          return console.error('get token error', error)
        }
        console.log("success", body)
    
        
      });
      
      
    } else {

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

