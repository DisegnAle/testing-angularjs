exports.config = {
	seleniumAddress: 'http://localhost:4444/wd/hub',
	specs: ['e2e/example.spec.js'],
	browserName: "chrome",
	jasmineNodeOpts: {
		showColors: true, // use colors in the command line
		defaultTimeoutInterval: 30000
	}
};