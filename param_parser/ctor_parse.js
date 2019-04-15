const fs = require('fs');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);


function read_header_files(dir) {
  let dir_contents = [];
  let promises = [];
  return readdir(dir)
    .then((contents) => {
      for (var tmp_file of contents){
        if(tmp_file.includes('.h')){
          promises.push(readFile(tmp_file, 'utf8'));
        }
      };
      return Promise.all(promises);
    });
};

function parse_params(files){
  var json_obj = {};

	// for each file split the file string into lines at newline
  for(var file of files){
		var params = [];
    var lines = file.split('\n');

		// if string "param\t is found push the string into params array"
	  for(var line of lines){
			var pos = line.search('param\t');
			if(pos >= 0)
				params.push(line.substr(pos + 'param\t'.length));
	  }

		// create a 'clean' array of each param item, ex: ['name', 'data type', 'decript']
		for(var i = 0; i < params.length; i++){
			var tmp = params.shift().split('\t');
			params.push(tmp);
		}

		// find the module name and assign it to the json_obj, and build structure of
		// child json object
		var module_name;
		for(var param of params){
			if(param[0] == 'module_name'){
				module_name = param[2];
				json_obj[module_name] = {};
				json_obj[module_name].description = 'Module name';
				json_obj[module_name].parameters = {};
				break;
			}
		}

		// populate the parameters key with key/value pairs taken from the params array
		for(var param of params){
			json_obj[module_name].parameters[param[0]] = param[1];
		}
	}

	return new Promise((resolve, reject) => {
		resolve(json_obj);
	});
};

// Main driver for ctor_parse program
function main() {
  const master_json = {};

	// first read all header files in local directory
	read_header_files('./')
  	.then(parse_params) // then for each header file found, look for and parse all '/param' values
		.then((json_data) => { // then add the resulting json_data to the master_json
			master_json['CommPlats'] = json_data;

			fs.writeFile('test.json', JSON.stringify(master_json), (err) => {
				if(err) throw err;
				console.log('data written to test.json');
				console.log(master_json.CommPlats);
			});
		});
};

main();
