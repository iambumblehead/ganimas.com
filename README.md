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
hello world
===========

**Use gani to render a "hello world" document.** To start, create a configuration script, then use the configuration in the *main.js* script. Copy-paste the sources below.

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

 1. **The general configuration** in *main_cfg.js* defines an array of 'pages' available to the application runtime. Each 'page' ( called 'page object' from here forward), corresponds to a specific behaviour, such as a text field, a navigation list or an animated canvas. [A set of 'basic' page objects is included w/ gani][41] and new page objects can be defined and used.

 2. **The environment configuration**, seen as the second parameter, returns "patterns" to the application. [Patterns][40] are used to construct and connect nodes associated with the page objects defined in the _general cofiguration_. Patterns are usually json files returned from network requests (client) or filesystem reads (server). The example above returns an object literal for simplification.


[40]: https://github.com/iambumblehead/specmob "specmob"
[41]: https://github.com/iambumblehead/gani/tree/master/src/basic "basic page objects"


------------------------------
node childs, pattern functions, inspecting the graph
====================================================

**Use gani to render dynamic content to the document.** Create a new script to export functions and name it *"main_fn.js"*. Update the configuration in *main_cfg.js* to include the functions in *main_fn.js* and to include a new page object called "pgls". Update the pattern returned by *main.js* to use the functions and new page object.


*main_fn.js*

```javascript
let main_fn = {};

main_fn.getclientwidth = () =>
  window.innerWidth + 'px';

main_fn.getdate = ([], opts) =>
  opts.type === 'now' ? Date.now() : 'later';

module.exports = main_fn;
```

*main_cfg.js*

```javascript
const pglabel = require('gani/src/basic/pglabel'),
      pgls = require('gani/src/basic/pgls'),

      main_fn = require('./main_fn');

module.exports = {
  lang : 'eng',
  locale : 'US',
  specpath : '',
  specfn : main_fn, // functions
  pages : [
    pglabel,
    pgls     // list type page node
  ],
  canvas : [
    'main'
  ]
}
```

*main.js*

```javascript
const gani = require('gani'),
      main_cfg = require('./main_cfg');

gani.init(main_cfg, {
  baseurl   : window.location.origin,

  iso_getfn : (sess, cfg, isoname, fn) => {
    fn(null, {
      page : "pgls", // list type page node
      name : "main",
      child : [{
        page : "pglabel",
        name : "statictitle",
        subject : [{
          label : 'hello world'
        }]
      },{
        page : "pglabel",
        name : "date",
        subject : [{
          type : "fn",
          fnname : "getdate",
          options : { type : 'now' },
          name : "label"
        }]
      },{
        page : "pglabel",
        name : "width",
        subject : [{
          type : "fn",
          fnname : "getclientwidth",
          name : "label"
        }]
      }]
    });
  }
});
```

The application now renders a list with three label nodes: 1) "hello world", 2) a timestamp and 3) the browser width!

**patterns defined in the "child" array of another pattern become childs of that pattern**. To see this in the data used by the application, open a browser console and enter `_cfg._rgraph.toJS()` --see that child nodes are named with keys corresponding to the parent-child relationship.

```javascript
_gcfg._rgraph.toJS();

  {
    "/main" : { ... },
    "/main/date" : { ... },
    "/main/statictitle" : { ... },
    "/main/width" : { ... }
  }
```

**the graph containing the state of the entire application can inspected in the console at any time**, `_cfg._rgraph.toJS()`.

**patterns defined in the "subject" namespace, with "type" : "fn", resolve to the value returned by calling the "fnname" function**. Functions defined in *main_fn.js* may return client details such as device, session or location. Notice how the "getdata" function takes an options object and passes it to the function.


------------------------------
using more patterns, managing patterns
======================================

tbd

the subject namespace, callbacks and dynamic options
====================================================

tbd

data nodes
==========

tbd

updating data nodes, the fuid namespace, patching the graph
===========================================================

tbd

other init and base namespaces
==============================

tbd

advanced, datals nodes and pattern mapping
==========================================

tbd

<!--

To construct the document, gani needs a json file.

The JSON patterns gani uses are pre-processed and saved to an output directory using page-deploy.

the following directory and file structure is recommended (and used by _this_ web site):

-->

