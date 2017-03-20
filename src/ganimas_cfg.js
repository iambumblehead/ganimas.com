// Filename: ganimas_cfg.js  
// Timestamp: 2017.03.20-02:36:22 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>


const pglabel = require('gani/src/basic/pglabel'),
      pgls = require('gani/src/basic/pgls'),

      ganimas_fn = require('./ganimas_fn');

module.exports = {
  lang : 'eng',
  locale : 'US',
  //specpath : './spec/view/',
  specpath : '',
  
  specfn : ganimas_fn,
  
  pages : [
    pglabel,
    pgls
  ],
  canvas : [
    'root'
  ]
};
