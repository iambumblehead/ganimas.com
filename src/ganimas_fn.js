// Filename: ganimas_fn.js  
// Timestamp: 2017.03.20-10:56:32 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>  


let main_fn = {};

main_fn.getclientwidth = ([], opts) =>
  window.innerWidth + 'px';

main_fn.getdate = ([], opts) =>
  opts.type === 'now' ? Date.now() : 'later';

module.exports = main_fn;
