'use strict';

process.stdout.write('Second');
process.stdout.write('\u001b[2KFirst\n');
process.stdout.write('This gets\u001b[2KReplaced\n');
process.stdout.write('This as ');
process.stdout.write('well\u001b[2KSup?\n');
