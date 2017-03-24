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

**Use gani to render a "hello world" document.** To start, 1) create a configuration script, 2) then use the configuration in the *main.js* script. Copy-paste the sources below.

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

**Use gani to render dynamic content to the document.** 1) Create a new script to export functions and name it *"main_fn.js"*. 2) Update the configuration in *main_cfg.js* to include the functions in *main_fn.js* and to include a new page object called "pgls". 3) Update the pattern returned by *main.js* to use the functions and new page object.


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

**patterns defined in the "child" array of another pattern describe child patterns**. Open a browser console and enter `_cfg._rgraph.toJS()` in order to see how child nodes are named with keys corresponding to the parent-child relationship.

```bash
_gcfg._rgraph.toJS();

  {
   ▶ "/main" : { ... },
   ▶ "/main/date" : { ... },
   ▶ "/main/statictitle" : { ... },
   ▶ "/main/width" : { ... }
  }
```

**the graph containing the state of the entire application can inspected in the console any time**: `_cfg._rgraph.toJS()`.

**patterns defined in the "subject" namespace, with "type" : "fn", resolve to the value returned by calling the "fnname" function**. Functions defined in *main_fn.js* may return client details such as device, session or location. Notice how the "getdata" function takes an options object and passes it to the function.


------------------------------
using pattern a file
======================================

**Use patterns from JSON files.** 1) Copy the pattern returned by *main.js* to a web-available JSON file at *"/spec/view/main/US.json"*. 2) Add the path to *main_cfg.js*. 3) Update *main.js* to return the JSON file at the path using an HTTP request.

*/spec/view/main/US.json*

```json
{
  "page" : "pgls",
  "name" : "main",
  "child" : [{
    "page" : "pglabel",
    "name" : "statictitle",
    "subject" : [{
      "label" : "hello world"
    }]
  },{
    "page" : "pglabel",
    "name" : "date",
    "subject" : [{
      "type" : "fn",
      "fnname" : "getdate",
      "options" : { "type" : "now" },
      "name" : "label"
    }]
  },{
    "page" : "pglabel",
    "name" : "width",
    "subject" : [{
      "type" : "fn",
      "fnname" : "getclientwidth",
      "name" : "label"
    }]
  }]
}
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
  specfn : main_fn,
  pages : [
    pglabel,
    pgls
  ],
  canvas : [
    '/spec/view/main' // path to root JSON pattern
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
    let request = new XMLHttpRequest();

    request.open('GET', cfg.iso_getonpath(isoname), true);
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        fn(null, JSON.parse(request.responseText));
      }
    };
    request.send();
  }
});
```

See the application run using the JSON file at */spec/view/main/US.json*. 

**Session (or "sess") values found on "lang" and "locale" properties are used to construct corresponding json paths that are requested**.

Obtaining patterns from JSON files enables one to begin pre-processing, merging, localising, authorizing and lazy-requesting patterns.


------------------------------
managing pattern files
======================================

**Manage patterns files in the large.** A tool called "page-deploy" is made to manage gani's pattern files. Let's avoid analysing this tool now but begin using it to manage our pattern files. 1) Break the json pattern file into smaller files and 2) use page-deploy to generate a single file from the smaller "source" files.

Currently the application uses this file:

```
./spec/view/main/US.json
```

Create three new files in the following directories:

```
./patterns/spec/view/main/spec-baseLocale.json
./patterns/spec/view/main-date/spec-baseLocale.json
./patterns/spec/view/main-statictitle/spec-baseLocale.json
./patterns/spec/view/main-width/spec-baseLocale.json
```

Use the below contents for each file.

*/patterns/spec/view/main/spec-baseLocale.json*

```json
{
  "page" : "pgls",
  "name" : "main",
  "child" : [{
    "type" : "local-ref",
    "path" : "../main-statictitle"
  },{
    "type" : "local-ref",
    "path" : "../main-date"
  },{
    "type" : "local-ref",
    "path" : "../main-width"
  }]
}
```

*/patterns/spec/view/main-date/spec-baseLocale.json*

```json
{
  "page" : "pglabel",
  "name" : "date",
  "subject" : [{
    "type" : "fn",
    "fnname" : "getdate",
    "options" : { "type" : "now" },
    "name" : "label"
  }]
}
```

*/patterns/spec/view/main-statictitle/spec-baseLocale.json*

```json
{
  "page" : "pglabel",
  "name" : "statictitle",
  "subject" : [{
    "label" : "hello world"
  }]
}
```

*/patterns/spec/view/main-width/spec-baseLocale.json*

```json
{
  "page" : "pglabel",
  "name" : "width",
  "subject" : [{
    "type" : "fn",
    "fnname" : "getclientwidth",
    "name" : "label"
  }]
}
```

Setup page-deploy to read files in "./patterns/spec/" and generate/save files in "./spec". Do it with javascript:

```javascript
pagedeploy.convert({
  supportedLocaleArr : ['US'],
  supportedLangArr : ['eng-US'],
  publicPath : '/spec',
  inputDir   : './path/to/spec',
  outputDir  : './path/to/patterns/spec'
}, (err, res) => {
  console.log('done.');
});
```

**_page-deploy_ uses each directory's "spec-baseLocale.json" file as the default file** for defining each supported Language and/or Locale file. For more information about localisation with page-deploy see page-deploy's github page.

See the application run using the JSON file, created by page-deploy, at */spec/view/main/US.json*. 


------------------------------
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


