var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    //pg = require('pg'),
    app = express();
 
// DB Connect String
const connect = "postgress://user1:user1@localhost:5432/BeritaDatabase";
const {Pool, Client} = require('pg');
const client = new Client({
    connectionString: connect
})
client.connect();
 
// Assign Dust Engine To .dust Files
app.engine('dust', cons.dust);
 
// Set Default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
 
// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));
 
// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
 
app.get('/', function(req, res){
    client.query('SELECT * FROM berita', function(err, result){
        if(err){
            return console.error('error running query', err);
        }
        console.log(result.rows);
        res.render('index', {berita: result.rows})
    })
});

app.post('/add',function(req, res){
    client.query("SELECT setval('berita_id_seq', COALESCE((SELECT MAX(id)+1 FROM Berita), 1), false)");
    client.query('INSERT INTO Berita(title, content) VALUES($1, $2)',
        [req.body.title, req.body.content]);
        res.redirect('/');
})

app.delete('/delete/:id', function(req, res){
    client.query('DELETE FROM berita WHERE id = $1',
        [req.params.id]);
})

app.post('/edit', function(req, res) {
    client.query('UPDATE berita SET title=$1, content=$2 WHERE id=$3',
        [req.body.title, req.body.content, req.body.id]);
        res.redirect('/');
})
 
// Server
app.listen(3000, function(){
    console.log('Server Started On Port 3000');
});