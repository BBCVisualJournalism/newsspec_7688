/*jshint es3: false */

// *************************************************************************
// DEBUGGING
// Setting debug to true will make the page use seperate .js files
// Setting whichEnv to 'vm' will make paths work inside your VM,
// default value is 'local'
// *************************************************************************

var debug = false;
var whichEnv = 'local';

// *************************************************************************
// REQUIRE PATHS
// Add any paths here you want shortened. Relative to the 'js' dir.
// *************************************************************************

var amdModulePaths = {
    'app':    './app',
    'pubsub': './lib/vendors/jquery/pubsub',
    'istats': './lib/vendors/istats/istats'
};

// *************************************************************************
// PROJECT FILES
// Make a list of templates you want converted to files
// *************************************************************************

var projectFiles = {
    'index.html': 'index.html.tmpl',
    'index.inc':  'index.inc.tmpl',
    'test.html':  'test.html.tmpl'
};

// *************************************************************************
// GRUNT CONFIG
// You shouldn't need to edit anything below here
// *************************************************************************

var path = require('path'),
    _    = require('lodash-node');

var requirePathsForJquery1build = _.merge({
        'jquery': './lib/vendors/jquery/jquery-1.9.1'
    }, amdModulePaths),
    requirePathsForJquery2build = _.merge({
        'jquery': './lib/vendors/jquery/jquery-2.0.3'
    }, amdModulePaths);


module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        env: grunt.file.readJSON('../../env.json'),
        watch: {
            js: {
                files: ['Gruntfile.js', './source/js/**/*', '!./source/js/lib/news_special/iframemanager__host.js'],
                tasks: ['js'],
                options: {
                    spawn: false
                }
            },
            css: {
                files: ['Gruntfile.js', './source/scss/**/*'],
                tasks: ['css'],
                options: {
                    spawn: false
                }
            },
            cssImg: {
                files: ['./source/scss/news_special/f/**/*'],
                tasks: ['copy:cssFurniture'],
                options: {
                    spawn: false
                }
            },
            html: {
                files: ['Gruntfile.js', './source/tmpl/**/*', './source/scss/news_special/inline.scss', './source/js/lib/news_special/iframemanager__host.js'],
                tasks: ['html'],
                options: {
                    spawn: false
                }
            },
            img: {
                files: ['./source/img/**/*'],
                tasks: ['responsive_images'],
                options: {
                    spawn: false
                }
            },
            options: {
                livereload: false
            }
        },
        requirejs: {
            jquery1: {
                options: {
                    baseUrl: './source/js',
                    paths: requirePathsForJquery1build,
                    optimize: 'uglify2',
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    name: './app',
                    out: './<%= multi_lang_site_generator.default.options.default_language_output_directory %>/js/all-legacyie.js'
                }
            },
            jquery2: {
                options: {
                    baseUrl: './source/js',
                    paths: requirePathsForJquery2build,
                    optimize: 'uglify2',
                    generateSourceMaps: true,
                    preserveLicenseComments: false,
                    name: './app',
                    out: './<%= multi_lang_site_generator.default.options.default_language_output_directory %>/js/all-html5.js'
                }
            }
        },
        copy: {
            js: {
                files: [{
                    expand: true,
                    cwd:    'source/js/lib/vendors/',
                    src:    ['require/require-2.1.0.js', 'legacy-ie-polyfills.js'],
                    dest:   '<%= multi_lang_site_generator.default.options.default_language_output_directory %>/js/lib/vendors/'
                }]
            },
            jsAll: {
                files: [{
                    expand: true,
                    cwd:    'source/js/',
                    src:    ['**'],
                    dest:   '<%= multi_lang_site_generator.default.options.default_language_output_directory %>/js/'
                }]
            },
            cssFurniture: {
                files: [{
                    expand: true,
                    cwd:    'source/scss/news_special/f/',
                    src:    ['*.*'],
                    dest:   '<%= multi_lang_site_generator.default.options.default_language_output_directory %>/css/f'
                }]
            },
            prepDeploy: {
                files: [
                    {expand: true, cwd: '<%= multi_lang_site_generator.default.options.default_language_output_directory %>', src: ['**'], dest: 'tmp'}
                ]
            },
            stageDeploy: {
                files: [
                    {expand: true, cwd: 'tmp', src: ['**'], dest: '<%= env.stage.mount %>/news/special/<%= pkg.year %>/newsspec_<%= pkg.project_number %>/content'}
                ]
            },
            liveDeploy: {
                files: [
                    {expand: true, cwd: 'tmp', src: ['**'], dest: '<%= env.live.mount %>/news/special/<%= pkg.year %>/newsspec_<%= pkg.project_number %>/content'}
                ]
            },
            standardImages: {
                files: [{
                    expand: true,
                    cwd: 'source/img',
                    src: '*.*',
                    dest: '<%= multi_lang_site_generator.default.options.default_language_output_directory %>/img'
                }]
            }
        },
        multi_lang_site_generator: {
            default: {
                options: {
                    vocabs:             ['english'],
                    vocab_directory:    'source/vocabs',
                    template_directory: 'source/tmpl/',
                    output_directory:   'content',
                    default_language_output_directory: 'content/english',
                    data: {
                        version:             '<%= pkg.version %>',
                        inlineStyleElm:      '<style><%= grunt.file.read(multi_lang_site_generator.default.options.default_language_output_directory + "/css/inline.css") %></style>',
                        inlineIframeManager: '<%= grunt.file.read("source/js/lib/news_special/iframemanager__host.js") %>',
                        path:                '<%= env.' + whichEnv + '.domain %>/news/special/<%= pkg.year %>/newsspec_<%= pkg.project_number %>/content',
                        pathStatic:          '<%= env.' + whichEnv + '.domainStatic %>/news/special/<%= pkg.year %>/newsspec_<%= pkg.project_number %>/content',
                        projectNumber:       '<%= pkg.project_number %>',
                        cpsId:               '<%= pkg.cps_id || pkg.project_number %>',
                        istatsName:          '<%= pkg.istatsName %>',
                        storyPageUrl:        '<%= pkg.storyPageUrl %>',
                        debug:               debug,
                        amdModulePaths:      JSON.stringify(amdModulePaths)
                    }
                },
                files: projectFiles
            },
            build_all_other_sites: {
                options: {
                    vocabs:             [],
                    vocab_directory:    'source/vocabs',
                    template_directory: 'source/tmpl/',
                    output_directory:   'content',
                    data: {
                        version:             '<%= pkg.version %>',
                        inlineStyleElm:      '<style><%= grunt.file.read(multi_lang_site_generator.default.options.default_language_output_directory + "/css/inline.css") %></style>',
                        inlineIframeManager: '<%= grunt.file.read("source/js/lib/news_special/iframemanager__host.js") %>',
                        path:                '<%= env.local.domain %>/news/special/<%= pkg.year %>/newsspec_<%= pkg.project_number %>/content',
                        pathStatic:          '<%= env.local.domainStatic %>/news/special/<%= pkg.year %>/newsspec_<%= pkg.project_number %>/content',
                        projectNumber:       '<%= pkg.project_number %>',
                        cpsId:               '<%= pkg.cps_id || pkg.project_number %>',
                        istatsName:          '<%= pkg.istatsName %>',
                        storyPageUrl:        '<%= pkg.storyPageUrl %>',
                        debug:               debug,
                        amdModulePaths:      JSON.stringify(amdModulePaths)
                    }
                },
                files: projectFiles
            }
        },
        cloudfile_to_vocab: {
            default: {
                options: {
                    output_directory:      'source/vocabs',
                    google_spreadsheet_id: '<%= pkg.vocabs.googleSpreadsheetId %>',
                    worksheet:             '<%= pkg.vocabs.worksheet %>',
                    username:              '<%= env.google.username %>',
                    password:              '<%= env.google.password %>'
                }
            }
        },
        sass: {
            main: {
                files: {
                    './<%= multi_lang_site_generator.default.options.default_language_output_directory %>/css/main.css':   './source/scss/main.scss',
                    './<%= multi_lang_site_generator.default.options.default_language_output_directory %>/css/legacy-ie.css': './source/scss/legacy-ie.scss',
                }
            },
            inline: {
                files: {
                    './<%= multi_lang_site_generator.default.options.default_language_output_directory %>/css/inline.css': './source/scss/news_special/inline.scss'
                }
            }
        },
        responsive_images: {
            main: {
                options: {
                    sizes: [{
                        width: 320
                    }, {
                        width: 640
                    }, {
                        width: 976
                    }]
                },
                files: [{
                    expand: true,
                    src: ['**.{jpg,gif,png}'],
                    cwd: 'source/img/responsive',
                    custom_dest: '<%= multi_lang_site_generator.default.options.default_language_output_directory %>/img/{%= width %}/'
                }]
            }
        },
        imagemin: {
            dist: {
                options: {
                    optimizationLevel: 3,
                    progressive: true
                },
                files: [
                    {
                        expand: true,
                        src: ['<%= multi_lang_site_generator.default.options.default_language_output_directory %>/img/**/*.*', '<%= multi_lang_site_generator.default.options.default_language_output_directory %>/css/f/**.*'],
                        dest: './'
                    }
                ]
            }
        },
        jshint: {
            options: {
                es3: true,
                indent: 4,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                quotmark: true,
                sub: true,
                boss: true,
                eqnull: true,
                trailing: true,
                white: true,
                force: true,
                ignores: ['source/js/lib/news_special/template_engine.js']
            },
            all: ['Gruntfile.js', 'source/js/lib/news_special/*.js', 'source/js/*.js', 'source/js/spec/*.js']
        },
        csslint: {
            options: {
                'known-properties'              : false,
                'box-sizing'                    : false,
                'box-model'                     : false,
                'compatible-vendor-prefixes'    : false,
                'regex-selectors'               : false,
                'duplicate-background-images'   : false,
                'gradients'                     : false,
                'fallback-colors'               : false,
                'font-sizes'                    : false,
                'font-faces'                    : false,
                'floats'                        : false,
                'star-property-hack'            : false,
                'outline-none'                  : false,
                'import'                        : false,
                'underscore-property-hack'      : false,
                'rules-count'                   : false,
                'qualified-headings'            : false,
                'shorthand'                     : false,
                'text-indent'                   : false,
                'unique-headings'               : false,
                'unqualified-attributes'        : false,
                'vendor-prefix'                 : false,
                'important'                     : false,
                'ids'                           : false,
                'force': true
            },
            src: ['./<%= multi_lang_site_generator.default.options.default_language_output_directory %>/css/main.css']
        },
        jasmine: {
            allTests: {
                src: 'source/js/newsspec_<%= pkg.project_number %>/*.js',
                options: {
                    keepRunner: false,
                    specs: 'source/js/spec/*Spec.js',
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: '<%= requirejs.jquery1.options.baseUrl %>',
                            paths: '<%= requirejs.jquery1.options.paths %>'
                        }
                    }
                }
            }
        },
        uglify: {
            options: {
                mangle: true
            },
            my_target: {
                files: {
                    '<%= multi_lang_site_generator.default.options.default_language_output_directory %>/js/lib/news_special/iframemanager__host.js': ['source/js/lib/news_special/iframemanager__host.js']
                }
            }
        },
        replace: {
            prepPreviewStageDeploy: {
                src: ['tmp/*/**.*'],
                overwrite: true,
                replacements: [{
                    from: '<%= env.local.domain %>',
                    to:   '<%= env.previewstage.domain %>'
                }, {
                    from: '<%= env.local.domainStatic %>',
                    to:   '<%= env.previewstage.domainStatic %>'
                }]
            },
            prepStageDeploy: {
                src: ['tmp/*/**.*'],
                overwrite: true,
                replacements: [{
                    from: '<%= env.local.domain %>',
                    to:   '<%= env.stage.domain %>'
                }, {
                    from: '<%= env.local.domainStatic %>',
                    to:   '<%= env.stage.domainStatic %>'
                }]
            },
            prepPreviewLiveDeploy: {
                src: ['tmp/*/**.*'],
                overwrite: true,
                replacements: [{
                    from: '<%= env.local.domain %>',
                    to:   '<%= env.previewlive.domain %>'
                }, {
                    from: '<%= env.local.domainStatic %>',
                    to:   '<%= env.previewlive.domainStatic %>'
                }]
            },
            prepLiveDeploy: {
                src: ['tmp/*/**.*'],
                overwrite: true,
                replacements: [{
                    from: '<%= env.local.domain %>',
                    to:   '<%= env.live.domain %>'
                }, {
                    from: '<%= env.local.domainStatic %>',
                    to:   '<%= env.live.domainStatic %>'
                }]
            }
        },
        clean: {
            beforeTranslate: ['<%= multi_lang_site_generator.default.options.output_directory%>'],
            main: ['<%= multi_lang_site_generator.default.options.default_language_output_directory%>/js/news_special', '<%= multi_lang_site_generator.default.options.default_language_output_directory %>/css/inline.css', 'tmp'],
            allJs: ['<%= multi_lang_site_generator.default.options.default_language_output_directory %>/js']
        },
        connect: {
            local: {
                options: {
                    hostname: '127.0.0.1',
                    port:     1031,
                    base:     '.',
                    directory: '<%= env.localhost %>',
                    middleware: function (connect, options) {
                        var middlewares = [];
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        var directory = options.directory || options.base[options.base.length - 1];
                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });
                        middlewares.push(connect.static(directory));
                        middlewares.push(connect.directory(directory));
                        return middlewares;
                    }
                }
            },
            localStatic: {
                options: {
                    hostname: '127.0.0.1',
                    port:     1033,
                    base:     '.',
                    directory: '<%= env.localhost %>',
                    middleware: function (connect, options) {
                        var middlewares = [];
                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }
                        var directory = options.directory || options.base[options.base.length - 1];
                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });
                        middlewares.push(connect.static(directory));
                        middlewares.push(connect.directory(directory));
                        return middlewares;
                    },
                    keepalive: true
                }
            }
        },
        shell: {
            checkMounts: {
                command: 'ls -ls /Volumes | if grep --quiet "tmp"; then echo "OK"; else echo "WARNING"; fi',
                options: {
                    stdout: true,
                    callback: function (err, stdout, stderr) {

                        done = this.async();

                        if (stdout.match(/WARNING/)) {
                            grunt.log.warn('You need to mount your network drives before you can deploy to other environments.');
                            done(false);
                        } else {
                            grunt.log.writeln('Drives appear to be mounted.');
                            done();
                        }
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-rename');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-multi-lang-site-generator');
    grunt.loadNpmTasks('grunt-cloudfile-to-vocab');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('default',     ['clean:allJs', 'jshint', 'css', 'jasmine', 'requirejs', 'uglify', 'multi_lang_site_generator:default', 'copy:jsAll', 'copy:cssFurniture', 'clean:main']);
    grunt.registerTask('css',         ['sass:main', 'sass:inline', 'csslint']);
    grunt.registerTask('html',        ['sass:inline', 'uglify', 'multi_lang_site_generator:default', 'clean:main']);
    grunt.registerTask('js',          ['jshint', 'jasmine', 'requirejs', 'copy:jsAll']);
    grunt.registerTask('test',        ['jasmine']);
    grunt.registerTask('images', [], function () {
        grunt.loadNpmTasks('grunt-responsive-images');
        grunt.loadNpmTasks('grunt-contrib-imagemin');
        grunt.task.run('copy:standardImages', 'responsive_images', 'imagemin');
    });

    grunt.registerTask('prep',         ['prepDeploy']);
    grunt.registerTask('previewstage', ['shell:checkMounts', 'stage_checklist', 'prep', 'replace:prepPreviewStageDeploy', 'copy:stageDeploy', 'clean:main']);
    grunt.registerTask('stage',        ['shell:checkMounts', 'stage_checklist', 'prep', 'replace:prepStageDeploy',        'copy:stageDeploy', 'clean:main']);
    grunt.registerTask('previewlive',  ['shell:checkMounts', 'live_checklist',  'prep', 'replace:prepPreviewLiveDeploy',  'copy:liveDeploy',  'clean:main']);
    grunt.registerTask('live',         ['shell:checkMounts', 'live_checklist',  'prep', 'replace:prepLiveDeploy',         'copy:liveDeploy',  'clean:main']);
    grunt.registerTask('server',       ['connect']);
    grunt.registerTask('translate',    ['clean:beforeTranslate', 'default', 'sass:inline', 'uglify', 'multi_lang_site_generator:build_all_other_sites', 'clean:main', 'images', 'copy_source']);
    grunt.registerTask('make_vocabs',  ['cloudfile_to_vocab']);

    grunt.registerTask('copy_source',  [], function () {

        var wrench             = require('wrench'),
            fs                 = require('fs'),
            default_vocab_dir  = grunt.config.get('multi_lang_site_generator.default.options.vocabs'),
            rest_of_vocabs_dir = grunt.config.get('multi_lang_site_generator.build_all_other_sites.options.vocabs');

        rest_of_vocabs_dir.forEach(function (vocab_dir) {
            grunt.log.writeln('Copying ' + default_vocab_dir + ' source into ' + vocab_dir + '...');
            wrench.copyDirSyncRecursive('content/' + default_vocab_dir + '/js/', 'content/' + vocab_dir + '/js/');
            wrench.copyDirSyncRecursive('content/' + default_vocab_dir + '/css/', 'content/' + vocab_dir + '/css/');
            try {
                if (fs.lstatSync('content/' + default_vocab_dir + '/img').isDirectory()) {
                    wrench.copyDirSyncRecursive('content/' + default_vocab_dir + '/img/', 'content/' + vocab_dir + '/img/');
                }
            } catch (e) {}
        });

    });
    grunt.registerTask('prepDeploy', [], function () {

        var wrench = require('wrench'),
            fs     = require('fs'),
            env    = grunt.config.get('env'),
            pkg    = grunt.config.get('pkg'),
            usr    = grunt.config.get('usr'),
            vocabs = grunt.config.get('multi_lang_site_generator.default.options.vocabs').concat(grunt.config.get('multi_lang_site_generator.build_all_other_sites.options.vocabs'));

        fs.mkdir('tmp');
        vocabs.forEach(function (vocab) {
            try {
                vocab_dir = fs.lstatSync(env.localhost + '/news/special/' + pkg.year + '/newsspec_' + pkg.project_number + '/content/' + vocab);
                if (vocab_dir.isDirectory()) {
                    wrench.copyDirSyncRecursive('content/' + vocab, 'tmp/' + vocab);
                    grunt.log.writeln(vocab + ' is ready for deployment');
                }
            } catch (e) {
                grunt.log.warn(vocab + ' will not be deployed as it has not yet been build');
            }
        });
    });
    grunt.registerTask('live_checklist', ['stage_checklist', 'checkStage']);
    grunt.registerTask('checkStage', ['Checking content on stage'], function () {
        var path = require('path'),
            env  = grunt.config.get('env'),
            pkg  = grunt.file.readJSON('package.json'),
            done = this.async(),
            fs   = require('fs');

        try {
          // Query the entry
            stats = fs.lstatSync(env.stage.mount + '/news/special/' + pkg.year + '/newsspec_' + pkg.project_number + '/content/' + grunt.config.get('multi_lang_site_generator.default.options.vocabs'));
          // Is it a directory?
            if (stats.isDirectory()) {
                grunt.log.writeln('This content is on stage - OK');
                done();
            }
        } catch (e) {
            done(false);
            grunt.log.writeln('This content has not been staged - Fail');
        }
    });
    grunt.registerTask('stage_checklist', [], function () {

        if (debug) {
            grunt.log.warn('"debug" in gruntfile.js is set to true, do not deploy to live with this setting!');
        }

        var pkg = grunt.config.get('pkg');

        propertiesToCheck = [
            {
                value:         pkg.project_number,
                invalidValues: ['', '0000'],
                errMessage:    '"project_number" in package.json not set!'
            },
            {
                value:         pkg.cpsId,
                invalidValues: ['', '--REPLACEME--'],
                errMessage:    '"cpsId" in package.json not set, istats will not work properly!'
            },
            {
                value:         pkg.istatsName,
                invalidValues: ['', '--REPLACEME--'],
                errMessage:    '"istatsName" in package.json not set, istats will not work properly!'
            },
            {
                value:         pkg.storyPageUrl,
                invalidValues: ['', '--REPLACEME--'],
                errMessage:    '"storyPageUrl" in package.json not set, istats will not work properly!'
            }
        ];

        propertiesToCheck.forEach(function (property) {
            checkProperty(
                property.value,
                property.invalidValues,
                property.errMessage
            );
        });

        function checkProperty(value, invalidValues, errMessage) {
            if (valueIsInvalid(value, invalidValues)) {
                grunt.log.warn(errMessage);
            }
        }
        function valueIsInvalid(value, invalidValues) {
            return invalidValues.indexOf(value) > -1;
        }
    });
};
