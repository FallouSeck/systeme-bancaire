const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const customersRoutes = require('./Routes/customers');
const bankAccountsRoutes = require('./Routes/bankAccounts');

mongoose.connect('mongodb://127.0.0.1/systeme-bancaire', { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false }, (error, db) => {
    if(error) return (error);
    console.log('Connecté à la base de données !');
});

const app = express();

app.use(bodyParser.urlencoded({extended:false}));

app.use(bodyParser.json({}));

app.use('/customers', customersRoutes);
app.use('/bankAccounts', bankAccountsRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Serveur lancé sur le port ${port}.`));