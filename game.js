const express = require('express');
const session = require('express-session');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');

const app = express();
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

//configure mustache
app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//config public to be served statically
app.use(express.static('public'));

//config Express Validator
app.use(expressValidator());


app.use(session({
  secret: '1C44-4D44-WppQ38S',
  resave: false,
  saveUninitialized: true
}));



let randomWord = words[parseInt(Math.random() * 100000)];
let randomWordLetters = randomWord.split("");
let guessedLetters = [];

app.get('/', function(req, res) {
  res.render('content', {spaces : randomWordLetters});

});

app.post('/', function(req,res){
  var schema = {
    'letterInput': {
      notEmpty: true,
      isLength: {
        options: [{
          max: 1
        }],
        errorMessage: 'one letter at a time please'
      },
      errorMessage: 'please guess a letter'
    },
  };
  req.assert(schema);
  req.getValidationResult().then(function(results) {
    if (results.isEmpty()) {

      let id = parseInt(Math.random() * 1000);
      newGuessObject = {
        letter: req.body.letterInput,
        id: id
      }
      guessedLetters.push(newGuessObject);
      console.log(guessedLetters)
      res.render('content', {
        spaces: randomWordLetters,
        guessed: guessedLetters
      });
    } else {
      res.render('content', {
        spaces: randomWordLetters,
        guessed: guessedLetters,
        errors: results.array()
      });
    }
  });
});



app.listen(3000, function() {
  console.log("I want to play a game");
  // console.log(randomWord);
  // console.log(randomWordLetters);

});
