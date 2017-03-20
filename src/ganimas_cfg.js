// Filename: ganimas_cfg.js  
// Timestamp: 2017.03.20-01:04:16 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>


const pglabel = require('gani/src/basic/pglabel');

module.exports = {
  lang : 'eng',
  locale : 'US',
  //specpath : './spec/view/',
  specpath : '',
  pages : [
    pglabel
  ],
  canvas : [
    //'root'
    'root', {
      pagearr : []
      //pagearr : [[
        //'/'  // path
        //'examples' // rule?
      //]]
    }
  ]
}
