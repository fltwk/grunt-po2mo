/*
 * grunt-po2mo
 * https://github.com/fltwk/grunt-po2mo
 *
 * Copyright (c) 2013-2018 Michele Bertoli, floatwork_
 * Licensed under the MIT license.
 */

'use strict';

const { spawn } = require('child_process');

module.exports = function(grunt) {
  grunt.registerMultiTask('po2mo', 'Compiles .po files into binary .mo files with msgfmt.', function() {
    const options = this.options({
      alignment: 1,
      checkAccelerators: null,
      checkCompatibility: false,
      checkDomain: false,
      checkFormat: false,
      checkHeader: false,
      deleteSrc: false,
      endianness: null,
      noHash: false,
      useFuzzy: false,
    });

    this.files.forEach(function(file) {
      const src = file.src[0];
      let dest = file.dest;

      if (dest.indexOf('.po') > -1) {
        dest = dest.replace('.po', '.mo');
      }
      grunt.file.write(dest);

      // Default arguments
      const args = ['--output', dest, src];

      // Add custom arguments
      if (options.alignment && !isNaN(options.alignment)) args.unshift('--alignment', options.alignment);
      if (options.checkFormat) args.unshift('--check-format');
      if (options.checkHeader) args.unshift('--check-header');
      if (options.checkDomain) args.unshift('--check-domain');
      if (options.checkCompatibility) args.unshift('--check-compatibility');
      if (options.checkAccelerators) args.unshift('--check-accelerators', options.accelerators);
      if (options.endianness) args.unshift('--endianness', options.endianness);
      if (options.noHash) args.unshift('--no-hash');
      if (options.useFuzzy) args.unshift('--use-fuzzy');

      grunt.verbose.writeln('Executing:', 'msgfmt', args.join(' ').trim());
      const child = spawn('msgfmt', args);

      child.stdout.on('data', (line) => {
        grunt.verbose.writeln(line);
      });

      child.stderr.on('data', (line) => {
        grunt.log.error(line);
      });

      child.on('close', function(status) {
        grunt.verbose.writeln('Executed with status:', status);

        if (status === 0 && options.deleteSrc) {
          grunt.file.delete(src);
        }
      });
    });
  });
};
