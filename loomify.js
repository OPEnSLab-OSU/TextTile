// This program illustrates a possible method for retrieving file content from the Loom github repo
/* It is lightweight and uses the github api to request JSON data. It is built using the
    request-promise-native module.

*/

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







// ========================================================================== //
// ===																																		=== //
// ===							sourcefile to json parser															=== //
// ========================================================================== //
/*
* This program demos a possible implementation for reading/parsing
* C header files. It looks for the doxygen /param syntax and uses
* tabs (\t) as a delimiter for each parameter property. This demo
* only uses the provided OLED_ctor.h file provided, although it may
* be modified to handle any header file with doxygen syntax.
*
* Use: there are no dependencies as this commit. run with:
*		>$ node ctor_parse.js
*/

const {promisify} = require('util');
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const path = require('path');


// ============================================================
// ===						read_header_files()												===
// ============================================================
/*
*	Params: dir is a string representing the directory to read. It will
* look for all .h files in dir.
*	Returns: A promise once all readFile() operations have completed
*	for every header file found in dir.
*/

function read_header_files(dir) {
	console.log(dir);
  let dir_contents = [];
  let promises = [];
  return readdir(dir)
    .then((contents) => {
      for (var tmp_file of contents){
        if(tmp_file.includes('.h')){
          promises.push(readFile(dir + '/' + tmp_file, 'utf8'));
        }
      };
      return Promise.all(promises);
    });
};

// ============================================================
// ===								parse_params()												===
// ============================================================
/*
*	Params: files is an array of strings, where each string is the entire
* contents of the *.h file found by the previously called
* read_header_files().
*/

function parse_params(files){
	let promises = [];

	for(file of files){	// for each file find param tags and build json
		promises.push(
			find_param_tags(file)
			.then(build_module_json)
		);
	}

	return Promise.all(promises);

};


function find_param_tags(file){
	return new Promise((resolve, reject) => {
		var params = [];

		// split the file string at newline chars
	  var lines = file.split('\n');

	  for(var line of lines){

			if(line.search('///') > 0){
				// look for the \param tag and save substring to param_line, else param_line is null
				var param_line = (line.search('\\param') > 0) ? line.substr(line.search('param')).trim() : null;

				if(param_line){
					// find end of the 'param[in]' tag
					param_line = param_line.substring(param_line.search(']') +1).trim();
					// insert a bar after key name to add a string.split() point
					param_line = param_line.replace(/[\s]/, '|');
					params.push(param_line);
				}
			}
	  }

		// create a 'clean' array of each param item, ex: ['key', 'data type/range', 'desc']
		for(var i = 0; i < params.length; i++){
			params[i] = params[i].split('|');

			for(var j = 0; j < params[i].length; j++){
				params[i][j] = params[i][j].trim(); // remove all leading/trailing whitespace from each element
			}
		}

		// resolve the promise with the params array
		resolve(params);
	});
};


function build_module_json(param_array){
	return new Promise((resolve, reject) => {
		var json_obj = {};

		// find the module name and assign it to the json_obj, and build structure of
		// child json object
		for(var param of param_array){
			if(param[0] == 'module_name'){
				var module_name = param[1].substring(param[1].indexOf('<"')+2, param[1].indexOf('">'));
				json_obj[module_name] = {};
				json_obj[module_name].description = 'Module description';
				json_obj[module_name].parameters = {};
				break;
			}
		}

		// populate the parameters key with key/value pairs taken from the params array
		for(var param of param_array){
			json_obj[module_name].parameters[param[0]] = {
				'type': param[1],
				'value': param[1].substring(param[1].indexOf('<')+1, param[1].indexOf('>')),
				'description': param[2],
			}
		}

		resolve(json_obj);
	});
}




// ================================================================
// 								Main function for the json parse program			===
// ================================================================

exports.parse = function(dir) {
  const master_json = {
		'general': {},
		'components': []
	};

	// first read all header files in local directory
	read_header_files(dir)
  	.then(parse_params) // then for each header file found, look for and parse all '/param' values
		.then((json_data_array) => { // then add the resulting json_data to the master_json
			for(var module of json_data_array){
				var key = Object.keys(module);
				master_json.components.push(module);
				console.log(module);
			}

			console.log(master_json);

			fs.writeFile('test.json', JSON.stringify(master_json), (err) => {
				if(err) throw err;
				console.log('data written to test.json');
			});
			return master_json;
		});
};

// parse('test_files');
