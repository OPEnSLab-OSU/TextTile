const loomify = require('loomify')

loomify.parse('loomify_tests/test_files', (data) => {
	console.log(data);
})
