ganimas.com
===========

source for the ganimas website


about
=====

![gani](https://github.com/iambumblehead/gani/raw/master/doc/ganimas-200x200.png)

gani renders documents using a JSON-formatted [design language][1] to define layout, appearance and behaviour. It passes JSON "patterns" through an [interpreter][2] and uses the result to complete a [graph][3] (graph is made with [facebook's immutable.js][4]). Each node in the graph corresponds to a page object in the application, such as a text field, a navigation list or an animated canvas. Updates to the application are applied quickly (real-time animation quick) using edges that connect data among nodes.


[0]: http://www.bumblehead.com "bumblehead"
[1]: http://www.jeffreynichols.com/papers/a17-nichols.pdf "nichols, uidl"
[2]: https://github.com/iambumblehead/specmob "specmob, interpreter"
[3]: https://github.com/iambumblehead/spectraph "spectraph, graph"
[4]: https://facebook.github.io/immutable-js/ "immutable-js"


getting started
===============

**Before starting**, set yourself up with a web-app that prints "hello world" to a browser console --we'll start adding gani in from there.

*main.js*

```bash
console.log('hello world');
```

------------------------------

**Let's use gani** to render a "hello world" document. To start, create a configuration script.

*main_cfg.js*

```javascript
const pglabel = require('gani/src/basic/pglabel');

module.exports = {
  lang : 'eng',
  locale : 'US',
  specpath : '',
  pages : [
    pglabel
  ],
  canvas : [
    'main'
  ]
}
```

Use the configuration start gani.

*main.js*

```javascript
const gani = require('gani'),
      main_cfg = require('./main_cfg');

gani.init(main_cfg, {
  baseurl   : window.location.origin,

  iso_getfn : (sess, cfg, isoname, fn) => {
    fn(null, {
      name : 'main',
      page : 'pglabel',
      subject : [{
        label : 'hello world'
      }]
    });
  }
});
```

See the application render "hello world" in a browser document!

**`gani.init` is called with two configuration objects**

 1. **The general configuration** in *main_cfg.js* defines an array of 'pages' available to the application runtime. Each 'page', here after called a 'page object', corresponds to a specific behaviour, such as a text field, a navigation list or an animated canvas.

 2. **The environment configuration**, seen as the second parameter, returns "patterns" to the application, which are used to populate and connect nodes associating with the page objects defined in the _general cofiguration_. Patterns may be returned from network requests (client) or filesystem reads (server).


------------------------------


<!--

To construct the document, gani needs a json file.

The JSON patterns gani uses are pre-processed and saved to an output directory using page-deploy.

the following directory and file structure is recommended (and used by _this_ web site):

-->

