/*
* Loom module dependencies
*/
const loom = require('./loom-github');

/*
* Nodejs module dependencies
*/
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

/*
*   NPM module dependencies
*/
const express = require('express');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const app = express();
const port = 3000;

/*
*  Express declarations
*/
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.json());


// route for index GET request
app.get('/', (req, res, next) => {
  var tree = loom.getTree();
  console.log(tree[0]);
  res.status(200).render('directory', tree);
});

// app.get('/', (req, res, next) => {
//   var filePath = '';
//   loom.getFile({'file': filePath}).then((context) => {
//     res.status(200).render('directory', context);
//   });
// });


app.get('/Loom/src', (req, res, next) => {
  var filePath = '';
  loom.getFile({'file': filePath}).then((context) => {
    res.status(200).render('directory', context);
  });
});

app.get('/Loom/src/:file', (req, res, next) => {
  var filePath = req.params.file;
  loom.getFile({'file': filePath}).then((context) => {
    if(Array.isArray(context)){
      context.forEach((entry) => {
        entry.path = entry.path.replace('Loom/src/', '');
      });
      res.status(200).render('directory', context);
    }
    else{
      var buff = Buffer.from(context.content, 'Base64');
      context.content = buff.toString('ascii');
      loom.parse(context.content);
      res.status(200).render('file', context);
    }
  });
});

app.get('/Loom/src/:dir/:file', (req, res, next) => {

  var filePath = `${req.params.dir}/${req.params.file}`;

  loom.getFile({'file': filePath}).then((context) => {
    var buff = Buffer.from(context.content, 'Base64');
    context.content = buff.toString('ascii');
    res.status(200).render('file', context);
  });
});

//****************************************************************************//
//*********             Begin script              ****************************//
//** loom.init takes an object with at least one member called 'branch',    **//
//** and saves the branch_sha and the latest commit sha to memory. Then     **//
//** then loom.buildTree GET's the repo tree recursively and saves to mem.  **//

loom.init({'branch': 'develop'})
  .then(loom.buildTree)

app.listen(port, () => console.log('Example app listening on port ' + port + '!'));
