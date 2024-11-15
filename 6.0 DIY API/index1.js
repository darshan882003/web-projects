import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

let jokes = [
  { id: 1, jokeText: "Why don't scientists trust atoms? Because they make up everything.", jokeType: 'Science' },
  { id: 2, jokeText: 'Why did the scarecrow win an award? Because he was outstanding in his field.', jokeType: 'Puns' },
  { id: 3, jokeText: 'I told my wife she was drawing her eyebrows too high. She looked surprised.', jokeType: 'Puns' },
  { id: 4, jokeText: 'What did one ocean say to the other ocean? Nothing, they just waved.', jokeType: 'Wordplay' },
  { id: 5, jokeText: 'Why do we never tell secrets on a farm? Because the potatoes have eyes and the corn has ears.', jokeType: 'Wordplay' },
  { id: 6, jokeText: 'How do you organize a space party? You planet!', jokeType: 'Science' },
  { id: 7, jokeText: "Why don't some couples go to the gym? Because some relationships don't work out.", jokeType: 'Puns' },
  { id: 8, jokeText: 'Parallel lines have so much in common. It’s a shame they’ll never meet.', jokeType: 'Math' },
  { id: 10, jokeText: 'What do you call fake spaghetti? An impasta!', jokeType: 'Food' },
  { id: 10, jokeText: 'Why did the tomato turn red? Because it saw the salad dressing!', jokeType: 'Food' }
];

// 1. GET a random joke
app.get('/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * jokes.length);
  res.json(jokes[randomIndex]);
});

// 2. GET a specific joke
app.get('/jokes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const foundJoke = jokes.find((joke) => joke.id === id);
  if (foundJoke) {
    res.json(foundJoke);
  } else {
    res.status(404).send('Joke not found');
  }
});

// 3. GET jokes by filtering on multiple query parameters
app.get('/filter', (req, res) => {
  const query = req.query; // Get all query parameters

  const filteredActivities = jokes.filter((joke) => {
    return Object.keys(query).every((key) => {
      if (joke[key] === undefined) return false;
      return joke[key].toString().toLowerCase().includes(query[key].toString().toLowerCase());
    });
  });

  res.json(filteredActivities);
});

// Start the server
app.listen(port, () => {
  console.log(`Successfully started server on port ${port}.`);
});
