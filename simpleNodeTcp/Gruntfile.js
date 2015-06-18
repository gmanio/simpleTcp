module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				jshintrc: true,
				reporter: require('jshint-stylish')
			},
			all: ['Gruntfile.js', 'dist/*.js']
		},
		ts: {
			gman: {
				src: ["src/*.ts"],
				out:"dist/out.ts"
			}
		},
		watch: {
			scripts: {
				files: ['src/*.ts'],
				tasks: ['ts']
			},
		}
	});

	// Load the plugin that provides the "uglify" task.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks("grunt-ts");

	// Default task(s).
	grunt.registerTask('default', ['ts:gman']);
};