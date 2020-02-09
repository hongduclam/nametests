/* eslint-disable */
module.exports = function (grunt) {
    'use strict';

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        myApp: {
            app: require('./bower.json').appPath || 'app',
            dist: 'dist',
            package: 'package'
        },

        server: {
            dev: grunt.file.readJSON('server.dev.json')
        },

        sftp: {
            release: {
                files: {
                    "./": "package/project.zip"
                },
                options: {
                    srcBasePath: '<%= myApp.package %>/',
                    path: 'dist/',
                    host: '<%= server.dev.host %>',
                    username: '<%= server.dev.username %>',
                    password: '<%= server.dev.password %>',
                    port: '<%= server.dev.port %>',
                    showProgress: true
                }
            }
        },

        html2js: {
            options: {
                base: '<%= myApp.app %>',
                module: 'lnc.template',
                singleModule: true,
                useStrict: true,
                htmlmin: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    removeAttributeQuotes: true,
                    removeComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                }
            },
            main: {
                src: ['<%= myApp.app %>/components/**/*.html'],
                dest: '<%= myApp.app %>/template.js'
            }
        },

        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            target: ['app/app.js', 'app/lnc.js', 'app/components/**/*.js']
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= myApp.dist %>/*',
                        '!<%= myApp.dist %>/.git*',
                        '<%= myApp.package %>/*'
                    ]
                }]
            },
            server: '.tmp'
        },

        compress: {
            main: {
                options: {
                    archive: '<%= myApp.package %>/project.zip',
                    pretty: true
                },
                expand: true,
                cwd: '<%= myApp.dist %>',
                src: ['**/*']
            }
        },

        /* Using for add CSS Style for browser
         * https://github.com/postcss/autoprefixer
         * */
        postcss: {
            options: {
                map: true,
                processors: [
                    require('autoprefixer')({browsers: ['last 2 version', 'Android 4']})
                ]
            },
            dist: {
                src: '.tmp/concat/css/main.css'
            }
        },

        wiredep: {
            app: {
                src: [
                    '<%= myApp.app %>/index.html'
                ],
                ignorePath: '<%= myApp.app %>/',
                exclude: ['google-open-sans']
            }
        },

        rev: {
            options: {
                algorithm: 'sha1',
                length: 16
            },
            dist: {
                files: {
                    src: [
                        '<%= myApp.dist %>/js/{,*/}*.js',
                        '<%= myApp.dist %>/css/{,*/}*.css',
                        '<%= myApp.dist %>/vendor/{,*/}*.css'
                    ]
                }
            }
        },

        useminPrepare: {
            html: '<%= myApp.app %>/index.html',
            options: {
                dest: '<%= myApp.dist %>'
            }
        },

        usemin: {
            html: ['<%= myApp.dist %>/{,*/}*.html'],
            css: ['<%= myApp.dist %>/css/{,*/}*.css', '<%= myApp.dist %>/vendor/{,*/}*.css'],
            options: {
                assetsDirs: ['<%= myApp.dist %>']
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= myApp.app %>/image',
                    src: '{,*/}*.{png,jpg,jpeg,gif,ico}',
                    dest: '<%= myApp.dist %>/image'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= myApp.app %>/image',
                    src: '{,*/}*.svg',
                    dest: '<%= myApp.dist %>/image'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= myApp.dist %>',
                    src: ['*.html', 'partials/{,*/}*.html'],
                    dest: '<%= myApp.dist %>'
                }]
            }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= myApp.app %>',
                    dest: '<%= myApp.dist %>',
                    src: [
                        '*.html'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: '<%= myApp.app %>/fonts/',
                    dest: '<%= myApp.dist %>/fonts',
                    src: [
                        '*.*'
                    ]
                }, {
                    expand: true,
                    flatten: true,
                    cwd: 'bower_components/',
                    src: [
                        'font-awesome/fonts/**',
                        'simple-line-icons/fonts/**',
                        'bootstrap/dist/fonts/**'
                    ],
                    dest: '<%= myApp.dist %>/fonts'
                }, {
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/iCheck/skins/minimal/',
                    dest: '<%= myApp.dist %>/vendor',
                    src: [
                        '*.png'
                    ]
                }, {
                    expand: true,
                    dot: true,
                    cwd: 'bower_components/jstree/dist/themes/default/',
                    dest: '<%= myApp.dist %>/vendor',
                    src: [
                        '*.png', '*.gif'
                    ]
                }]
            }
        },

        concurrent: {
            dist: [
                'copy:dist',
                'imagemin',
                'svgmin'
            ]
        },

        replace: {
            development: {
                options: {
                    patterns: [{
                        json: grunt.file.readJSON(
                            'config.development.json')
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['config.js'],
                    dest: '<%= myApp.app %>/js'
                }]
            },
            production: {
                options: {
                    patterns: [{
                        json: grunt.file.readJSON('config.production.json')
                    }]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['config.js'],
                    dest: '<%= myApp.app %>/js'
                }]
            }
        },

        karma: {
            unit: {
                configFile: './test/karma.conf.js',
                singleRun: true
            }
        },
        concat: {
            language: {
                options: {
                    banner: '{',
                    footer: '}',
                    separator: ',',
                    process: function (src, filepath) {
                        console.log(filepath);
                        try {
                            var modName = filepath.match(/(\w+).language.\w+.json/i)[1];
                            return '\n\t"' + modName + '": ' + src + '\n';
                        }
                        catch (e) {
                            console.log(e);
                        }
                        return '';
                    }
                },
                files: {
                    '<%= myApp.app %>/language/language-en.json': ['<%= myApp.app %>/components/**/*.language.en.json'],
                    '<%= myApp.app %>/language/language-vi.json': ['<%= myApp.app %>/components/**/*.language.vi.json']
                }
            }
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'wiredep',
            'concurrent:server',
            'postcss',
            'html2js:main',
            'connect:livereload',
            'replace:development',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn(
            'The `server` task has been deprecated. Use `grunt serve` to start a server.'
        );
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'newer:eslint',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'html2js:main',
        'concat:generated',
        'postcss',
        'cssmin:generated',
        'uglify:generated',
        'rev',
        'usemin',
        'htmlmin:dist',
        'compress',
        'sftp:release'
    ]);

    grunt.registerTask('default', [
        'newer:eslint',
        'test',
        'build'
    ]);
};
/* eslint-enable */
