const express = require('express');
const app = express();
const port = 3000;
const options = {
  root: __dirname
};

const dataController = require('./src/scripts/data.js');
const cryptoController = require('./src/scripts/crypto.js');

app.use(express.json());    // for parsing application/json
app.use(express.urlencoded({ extended: true }));    // for parsing application/x-www-form-urlencoded
app.use(express.static('src'));

app.get('/', (req, res) => {
  res.sendFile('index.html', options);
})

app.get('/admin', (req, res) => {
  res.sendFile('./src/pages/admin.html', options);
})

app.post('/validate-login', (req, res) => {
  const { id, pw } = req.body;

  const accountDataPath = './data/account.json';
  dataController.utilizeData(accountDataPath, json => {
    cryptoController.checkPassword(id, pw, json,
      () => {
        console.log(`Log-in succeeded. '${pw}' is a correct password! :)`);
        res.sendFile('./src/pages/data-manager.html', options);
      },
      () => {
        console.log(`Log-in failed! '${pw}' is INVALID password! :(`);
        res.redirect('/admin');
      },
      () => {
        console.log(`Log-in failed! There is no account with the ID of '${id}'`);
        res.redirect('/admin');
      });
  })
})

app.listen(port, () => console.log(`Port ${port} is listening!`));