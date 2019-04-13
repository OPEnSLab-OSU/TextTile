// This program illustrates a possible method for retrieving file content from the Loom github repo
/* It is lightweight and uses the github api to request JSON data. It is built using the
    request-promise-native module.

*/

// ** The only function available for export is getFile(), at the bottom of the page ***/
/* To use: import this module into your javascript with Ex: var loomgit = require(./loom-github)
    then use it by calling loomgit.getFile(<path/to/file>), where the path to file is read from stdin
    and is relative to the Loom master repo.
*/

// required modules
const rpn = require('request-promise-native');
const fs = require('fs');



// loom_github object with methods that use promises
var loom_github = {
  'getContents': function (options){
    return rpn(options);
  },

  'findFile': function (contents){
    return contents;
  },

  'print': function(file){
    // console.log(file);
  }
};


exports.auth = function(){
  return loom_github.auth;
};

exports.parse = (content) => {
  console.log(content);
};

exports.init = (params) => {
  loom_github.branch = params.branch;
  var options = {
    'uri': 'https://api.github.com/repos/OPEnSLab-OSU/Loom/branches/' + params.branch,
    'headers': {
      'User-Agent': 'Loom Configurator App'
    },
    'json': true,
  };
  return rpn(options).then((context) => {
    // console.log(context);
    loom_github.branch_sha = context.commit.sha;
    loom_github.tree_sha = context.commit.commit.tree.sha;
    console.log(loom_github);
  });
};

exports.buildTree = () => {
  var options = {
    'uri': 'https://api.github.com/repos/OPEnSLab-OSU/Loom/git/trees/' + loom_github.tree_sha + '?recursive=1',
    'headers': {
      'User-Agent': 'Loom Configurator App'
    },
    'json': true,
  };
  return rpn(options).then((context) => {
    loom_github.tree = context;
  });
};

exports.getTree = () => {
  // console.log(loom_github.tree);
  return loom_github.tree.tree;
}


exports.getFile = (params) => {
  // required for request-promise-native module
  var options = {
    'uri': 'https://api.github.com/repos/OPEnSLab-OSU/Loom/contents/Loom/src/' + params.file,
    'headers': {
      'User-Agent': 'Loom Configurator App'
    },
    'json': true,
  };
  return loom_github.getContents(options)
    .then(loom_github.findFile)
    // .then(loom_github.print)
};
