// Filename: ganimas_fn.js  
// Timestamp: 2017.03.27-00:42:24 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  


let main_fn = {};

main_fn.getclientwidth = ([], opts) =>
  window.innerWidth + 'px';

main_fn.getdate = ([], opts) =>
  opts.type === 'now' ? Date.now() : 'later';

main_fn.touppercase = ([val]) =>
  String(val).toUpperCase();

module.exports = main_fn;
