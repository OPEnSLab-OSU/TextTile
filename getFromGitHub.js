// This program illustrates a possible method for retrieving file content from the Loom github repo
// It is lightweight because it only pulls HTML content until the desired file is found.

// required modules
const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');

// This program uses Loom/src as the root folder
var baseUrl = 'https://github.com';
var url = new URL ('https://github.com/OPEnSLab-OSU/Loom/tree/master/Loom/src');
var fileToGet = 'Loom_Module.h';

getFileFromGitHub(url, fileToGet);




// ** functions ** //

// function to get file from Github and write to disk
function getFileFromGitHub(url, fileToGet){
  let content, fileUrl, rawFileUrl;

  // make a GET request to the above URL
  request(url.href, (error, response, body) => {
    var $ = cheerio.load(body); // load the body into a HTML parser (Cheerio)
    content = $('a','.content'); // content is a JSON of all files and directories in /src
    // console.log(content);
    for (var key in content){
      if(content[key].attribs){
        if(content[key].attribs.title == fileToGet){
          fileUrl = new URL (content[key].attribs.href, baseUrl);
          break;
        }
      }
    }

    // make a new GET request to the fileUrl page on github
    request(fileUrl.href, (error, response, body) => {
      var $ = cheerio.load(body);
      rawFileUrl = new URL ($('a#raw-url')[0].attribs.href, baseUrl); // in this case only 'a' tags with 'raw-url' id's are being selected

      // make a final GET request for the raw file data
      request(rawFileUrl.href, (error, response, body) => {
        // write the file to disk
        fs.writeFile(fileToGet, body, (err) => {
          if (err) throw err;
        });
      });
    });
  });
}
