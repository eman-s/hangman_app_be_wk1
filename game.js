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
  res.render('content', {randomWordLetters})
});


app.post('/', function(req,res){

if (req.body.letterInput.split('').length === 1 && guessedLetters.includes(req.body.letterInput) === false ){
  guessedLetters.push(req.body.letterInput);
  console.log(req.body.letterInput.split(''));
  }


  let correctLetters = randomWordLetters.map(function(letter){
    if(guessedLetters.includes(letter)){
      return letter;
    }else{
      return '_';
    }
  });
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
      res.render('content', {
        letters: correctLetters,
        guessed: guessedLetters
      });
      // console.log(guessedLetters)
    } else {
      res.render('content', {
        letters: correctLetters,
        guessed: guessedLetters,
        errors: results.array()
      });
    }
  });
});




app.listen(3000, function() {
  console.log("I want to play a game");
  // console.log(randomWord);
  console.log(randomWordLetters);

});
