exports.DATABASE_URL = process.env.DATABASE_URL || global.DATABASE_URL || 'mongodb://localhost/glappy';

exports.TEST_DATABASE_URL = (
	process.env.TEST_DATABASE_URL ||'mongodb://localhost/test-glappy');
exports.PORT = process.env.PORT || 8080;