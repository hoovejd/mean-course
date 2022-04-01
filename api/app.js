import express from 'express';

export const app = express();

app.use((req, res, next) => {
  console.log('First middleware!');
  next();
});

app.use((req, res, next) => {
  res.send('Hello from express!');
});
