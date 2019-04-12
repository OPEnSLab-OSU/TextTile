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

  'setBranch': function (branch){

  },

  'findFile': function (contents){
    return contents;
    // for (var key in contents){
    //   if(contents[key]){
    //     if(contents[key].type == 'dir'){
    //       console.log(contents[key].name + '/');
    //     }
    //     else{
    //       console.log(contents[key].name);
    //     }
    //   }
    // }
    // console.log(contents);
    // if(options.file.includes('/')){
    //   options.file = options.file.split('/');
    //   contents.forEach((file) => {
    //     if(file.type == 'dir' && file.name == options.file[0]){
    //       options.uri = new URL (file.url).href;
    //     }
    //   });
    // }
    // else{
    //   contents.forEach((file) => {
    //     if(file.name == options.file){
    //       options.uri = new URL (file.download_url).href;
    //     }
    //   });
    // }
    // return rpn(options);
  },

  'print': function(file){
    // console.log(file);
  }
};


exports.getFile = function(params){
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
