const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');

describe('Google Play Apps', () => {
  it('GET /apps should return a list of app', ()=> {
    return request(app)
      .get('/apps')
      .expect(200)
      .expect('Content-type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
      });
  });

  context('Query Parameters', ()=> {
    it('should be 400 if sort is incorrect', () => {
      return request(app)
        .get('/apps')
        .query({sort: 'MISTAKE'})
        .expect(400, {error: 'Sort must be either Rating or App.'});
    });
  
    it('should be 400 if genres is incorrect', () => {
      return request(app)
        .get('/apps')
        .query({genres: 'MISTAKE'})
        .expect(400, {error: 'Genres must be one of the following: Action, Puzzle, Strategy, Casual, Arcade, Card'});
    });
  });

  context('Sorting', () =>{
    it('should sort by rating', ()=> {
      return request(app)
        .get('/apps')
        .query({sort: 'Rating'})
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.be.an('array');
          let i=1;
          let correctOrder = true; 
          while(correctOrder && i<res.body.length){
            if(res.body[i-1].Rating < res.body[i].Rating){
              correctOrder = false;
            }
            i++;
          }
          expect(correctOrder).to.be.true;
        });
    });

    it('should sort by app', () => {
      return request(app)
        .get('/apps')
        .query({sort: 'App'})
        .expect(200)
        .expect(res => {
          expect(res.body).to.be.an('array');
          let i=1;
          let correctOrder = true; 
          while(correctOrder && i<res.body.length){
            if(res.body[i-1].App > res.body[i].App){
              correctOrder = false;
            }
            i++;
          }
          expect(correctOrder).to.be.true;
        });
    });
  });

  context('Filtering', ()=> {
    it('should filter based on input and return an array of objects', () => {
      const expected = [{
        'App': 'Solitaire',
        'Category': 'GAME',
        'Rating': 4.7,
        'Reviews': '254258',
        'Size': '23M',
        'Installs': '10,000,000+',
        'Type': 'Free',
        'Price': '0',
        'Content Rating': 'Everyone',
        'Genres': 'Card',
        'Last Updated': 'August 1, 2018',
        'Current Ver': '2.137.0',
        'Android Ver': '4.1 and up'
      }];
      return request(app)
        .get('/apps')
        .query({genres: 'Card'})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.eql(expected);
          expect(res.body).to.have.lengthOf(1);
          const app = res.body[0];
          expect(app).to.include.all.keys('App', 'Category', 'Rating', 'Reviews', 'Size', 'Installs', 'Type', 'Price', 'Content Rating', 'Genres', 'Last Updated', 'Current Ver', 'Android Ver');
        });
    });
  });
});