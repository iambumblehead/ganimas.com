// Filename: express.js  
// Timestamp: 2017.03.25-13:55:20 (last modified)

var fs = require('fs'),
    pem = require('pem'),
    gani = require('gani'),
    path = require('path'),
    express = require('express'),
    scroungejs = require('scroungejs'),
    pagedeploy = require('page-deploy'),
    bodyParser = require('body-parser'),
    serveIndex = require('serve-index'),
    cookieParser = require('cookie-parser'),
    
    ganimas_cfg = require('./src/ganimas_cfg'),
    ganimas_srvtest = require('./src/ganimas_srvtest'),
    
    https = require('https'),
    http = require('http'),
    port = 3000,
    app = express(),
    cfgexpress = {
      name : 'localhost', 
      env : 'development',
      porthttp : 4343,
      porthttps : 4545 },
    cfgdataservice = {
      ismocked : true,
      port : "8000",
      addr : "192.168.180.190",
      token : "lskdjfos983eljf398fjls839jfls8jf"
    };


let build = (fn) => {
  scroungejs.build({
    iscompressed   : false,
    isconcatenated : false,
    ises2015       : false,
    
    inputpath      : './src/',
    outputpath     : './build/',

    basepagein     : './src/index.tpl.html',
    basepage       : './build/index.html',
    treearr : [
      'ganimas.js',
      'ganimas.css'
    ]
  }, (err, res) => {
    pagedeploy.convert({
      supportedLocaleArr : ['US'],
      supportedLangArr : ['eng-US'],
      publicPath : '/spec',
      inputDir   : './src/spec',
      outputDir  : './build/spec'
    }, fn);

  });
};


build((err, res) => {
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.get('/', (req, res, fn) => {
    fs.readFile('./build/index.html', 'utf-8', (err, content) => {    
      res.end(content);
    });    
  });

  app.use('/', express.static(__dirname + '/build/'));

  app.use('/spec', express.static(__dirname + '/spec'));
  app.use('/spec', serveIndex('test', {icons : true}));

  app.use('/src', express.static(__dirname + '/src'));
  app.use('/src', serveIndex('src', {icons : true}));

  app.use('/node_modules', express.static(__dirname + '/node_modules'));
  app.use('/node_modules', serveIndex('node_modules', {icons : true}));

  gani.start(ganimas_cfg, {
    baseurl : path.join(process.cwd(), '/src/'),
    dirs_path : path.join(process.cwd(), '/src/'),

    servicearr : [
      gani.srv('/test*', ganimas_srvtest, cfgdataservice)
    ],

    iso_getfn : () => {
      
    },

    sess_initfn : () => {
      
    },    
    
    srv_getfn : (method, path, data, token, fn, timeout) => {
      gani.srv_dispatch(method, path, data, token, fn, timeout);
    }
  }).attach(app, cfgdataservice);
  

  http.createServer(app).listen(cfgexpress.porthttp);

  pem.createCertificate({days:1, selfSigned:true}, (err, keys) => {
    https.createServer({
      key: keys.serviceKey,
      cert: keys.certificate
    }, app).listen(cfgexpress.porthttps);
  });

  console.log('[...] :env: https://:name::porthttps, http://:name::porthttp'
              .replace(/:env/, cfgexpress.env)
              .replace(/:name/gi, cfgexpress.name)
              .replace(/:porthttps/, cfgexpress.porthttps)
              .replace(/:porthttp/, cfgexpress.porthttp));
});
