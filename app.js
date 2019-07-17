const express = require('express');
const morgan = require('morgan');
const playstore =  require('./playstore');

const app=express();
app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  let filteredApps = [...playstore];
  const {sort, genres} = req.query;

  const validSorts = ['Rating', 'App'];
  if(sort && !validSorts.includes(sort)){
    return res.status(400).json({error: 'Sort must be either Rating or App.'});
  }

  if(sort==='Rating'){
    filteredApps.sort((a, b) => a[sort] > b[sort] ? -1 : 1);
  }

  if(sort === 'App'){
    filteredApps.sort((a, b) => a[sort] > b[sort] ? 1 : -1);
  }

  const validGenres = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card'];
  if(genres && !validGenres.includes(genres)){
    return res.status(400).json({error: 'Genres must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, Card'});
  }

  if (genres){
    filteredApps=filteredApps.filter(app => app.Genres.toLowerCase().includes(genres.toLowerCase()));
  }  

  res.json(filteredApps);
});

module.exports = app;