// server.js
// load the things we need
var express = require('express');
var cookieParser = require('cookie-parser')
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
// set public directory for static files
app.use(express.static(__dirname + '/public'));
app.use(cookieParser('secret'));

// use res.render to load up an ejs view file
// index page
app.get('/', function(req, res) {
    // test data
    var course = [
        { name: 'Advanced Internet Programming', code: 'ACS-3909', prof: 'Dan Slack', room: '3D04', time: '6:00 - 9:00', days: [3] },
        { name: 'Human Computer Interaction', code: 'ACS-3916', prof: 'Sergio Camorlinga', room: '3D04', time: '10:00 - 11:15', days: [2,4] },
        { name: 'Technical Communications in ICT Professions', code: 'ACS-3923', prof: 'Eugene Kaluzniacky', room: '3C13', time: '11:30 - 12:45', days: [2,4] },
        { name: 'Modern East Asian Culture', code: 'EALC-2734', prof: 'Lenore Szekely', room: '3M63', time: '2:30 - 3:45', days: [1,3] }
    ];

    res.render('index', {
        course: course // passes course as course to index.ejs??
    });
});

// login page
app.get('/login', function(req, res) {
    res.cookie('defUser', '').send(res.render('login')); // sends cookie defUser
});

app.listen(8080);
console.log('localhost:8080');
