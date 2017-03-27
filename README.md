ganimas.com
===========

source for the ganimas website


about
=====

![gani](https://github.com/iambumblehead/gani/raw/master/doc/ganimas-200x200.png)

gani renders documents using a JSON-formatted [design language][1] to define layout, appearance and behaviour. It passes JSON "patterns" through an [interpreter][2] to complete a [graph][3] (graph is made with [facebook's immutable.js][4]). Each graph node corresponds to a page object, such as a text field, a navigation list or an animated canvas. Updates to the application are applied quickly (real-time animation quick) using edges that connect data among nodes.


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

**child patterns are defined in the "child" array of the parent pattern**. Open a browser console and enter `_cfg._rgraph.toJS()` in order to see how child nodes are named with keys corresponding to the parent-child relationship.

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

**_page-deploy_ uses the file "spec-baseLocale.json" as the default file** for defining each supported Language and/or Locale file. For more information about localisation with page-deploy see page-deploy's github page.

See the application run using the JSON file, created by page-deploy, at */spec/view/main/US.json*. 

_the rest of this guide assumes page-deploy is being used._

------------------------------
the subject namespace, callbacks
================================

**For each node, the subject namespace is the primary data container.** Let's add a new pattern which develop's the subject namespace in more interesting ways. 1) Update the configuration in *main_cfg.js* to include a new page object called "pgtext", 2) create a new script to export callbacks and name it *"main_cb.js"*. 3) add a new pattern file and describing a text node and 3) use a callback to construct the subject namespace.


*main_cfg.js*

```javascript
const pglabel = require('gani/src/basic/pglabel'),
      pgtext = require('gani/src/basic/pgtext'),
      pgls = require('gani/src/basic/pgls'),

      main_cb = require('./main_cb');
      main_fn = require('./main_fn');

module.exports = {
  lang : 'eng',
  locale : 'US',
  specpath : '',
  specfn : main_fn,
  speccb : main_cb, // add callbacks
  pages : [
    pglabel,
    pgtext, // add text page object
    pgls
  ],
  canvas : [
    '/spec/view/main'
  ]
}
```


*main_cb.js*

```javascript
let main_cb = {};

// returns a username
main_cb.getusername = ([userid], opts, fn) => {
  if (userid) {
    if (opts.part === 'first') {
      fn(null, 'chuck');
    } else if (opts.part === 'last') {
      fn(null, 'jones');
    } else {
      fn(null, 'chuck jones');
    }
  } else {
    fn(null, 'no user id');
  }
};

module.exports = main_cb;
```


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
  },{
    "note" : "add name pattern here",
    "type" : "local-ref",
    "path" : "../main-nameinput"
  }]
}
```


*/patterns/spec/view/main-nameinput/spec-baseLocale.json*

```json
{
  "page" : "pgtext",
  "name" : "nameinput",
  "subject" : [{
    "labelprimary" : "user name"
  },{
    "type" : "cb",
    "cbname" : "getusername",
    "name" : "value"
  }]
}
```

**Each page object script uses _specifically_ named values.** Rebuild the application to see a text field labelled "user name" and populated with "no user id". Open the "pgtext.js" script and see its `getvnode` function (`getvnode` is defined for all 'dom' type page nodes).

_labelprimary_ and _value_ are two subject properties used by pgtext's `getvnode`. Inspect the node in the browser console to see the corresponding named properties.

```bash
_cfg._rgraph.get('/main/nameinput').toJS()

  {
   ▶ childarr : [],
   ▶ datainarr : [],
   ▶ dataoutarr : [],
   ▶ domchilduid : {},
   ▶ domchilduidarr : [],
     isdom : true,
     name : "nameinput",
     page : "pgtext",
   ▼ subject : [{
      labelprimary : "user name"
     },{
      type : "cb",
      cbname : "getusername",
      name : "value"
     }],
   ▼ subjecthydrated : [{
      labelprimary : "user name"
      value : "no user id"
     }]
  }
```

**Namespace patterns are resolved to values defined on a 'hydrated' namespace.** For example, the 'subject' pattern resolves to values found on 'subjecthydrated'. The 'getvnode' function adds hydrated subject values to the document.

**Patterns map data values to properties used by a page object.** For example, consider that "getusername()" (mapped to "value") could instead be mapped to "labelprimary" or "labelsecondary". Other page objects such as pgnav, pgimg, pgdropdown, or pglink... may map this or other values to subject properties they would use.


------------------------------
more namespaces and dynamic parameters
======================================

We'll begin gradually updating the text node with more complex behaviour. 1) Send parameters to the `getusername` callback using the "init" namespace, 2) send dynamic "options" to the callback.


*/patterns/spec/view/main-nameinput/spec-baseLocale.json*

```json
{
  "page" : "pgtext",
  "name" : "nameinput",
  "init" : [{
    "name" : "userid",
    "type" : "cb",
    "cbname" : "getuserid"
  }],
  "subject" : [{
    "labelprimary" : "user name"
  },{
    "type" : "cb",
    "cbname" : "getusername",
    "name" : "value",
    "argprops" : ["init.userid"],
    "options" : {
      "part" : "first"
    }
  }]
}
```

*main_cb.js*

```javascript
let main_cb = {};

// returns userid
main_cb.getuserid = ([], opts, fn) => {
  fn(null, 'userid');
};

// returns a username
main_cb.getusername = ([userid], opts, fn) => {
  if (userid) {
    if (opts.part === 'first') {
      fn(null, 'chuck');
    } else if (opts.part === 'last') {
      fn(null, 'jones');
    } else {
      fn(null, 'chuck jones');
    }
  } else {
    fn(null, 'no user id');
  }
};

module.exports = main_cb;
```

Rebuild the application and see the text input populated with 'chuck'.

**The init namespace is hydrated _before_ the subject namespace.** Hydrated init values can be referenced by the subject pattern. Other namespaces which may be defined and hydrated are described later --there are seven namespaces in total.

**_All namespaces_ are hydrated in the same _ordered_ sequence.** If a namespace pattern is not defined on the node, no hydrated definition is created.

**Hydration sequence** _more information on namespaces further below_

 1. **fuid**,
 2. **init**,
 3. **maplist**,
 4. **child**,
 5. **base**,
 6. **subject**,
 7. **partial**


**Before moving on,** let's use the "sess" object (short for "session") with our "nameinput" subject pattern. 1) return a modified session object in *main.js* and 2) use 'sess' to construct the options param passed to "getusername()".


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
  },
  // modify and return session
  sess_initfn : (sess, cfg, fn) => {
    sess.token = 'mytoken1234';
    sess.namefirst = 'jim';
    sess.namelast = 'jones';
    
    fn(null, sess);
  }
});
```

*/patterns/spec/view/main-nameinput/spec-baseLocale.json*

```json
{
  "page" : "pgtext",
  "name" : "nameinput",
  "init" : [{
    "name" : "userid",
    "type" : "cb",
    "cbname" : "getuserid"
  }],
  "subject" : [{
    "labelprimary" : "user name"
  },{
    "type" : "cb",
    "cbname" : "getusername",
    "name" : "value",
    "argprops" : ["init.userid"],
    "optarr" : [{
      "note" : "the result of this pattern becomes 'opts' passed to 'getusername'",
      "name" : "part",
      "type" : "literal",
      "value" : "last"
    }]
  }]
}
```

*main_cb.js*

```javascript
let main_cb = {};

// returns userid
main_cb.getuserid = ([], opts, fn, sess, cfg, graph, node) => {
  fn(null, 'userid');
};

// returns a username
main_cb.getusername = ([userid], opts, fn, sess, cfg, graph, node) => {
  if (userid) {
    if (opts.part === 'first') {
      fn(null, sess.namefirst);
    } else if (opts.part === 'last') {
      fn(null, sess.namelast);
    } else {
      fn(null, sess.namefirst + ' ' + sess.namelast);
    }
  } else {
    fn(null, 'no user id');
  }
};

module.exports = main_cb;
```

Rebuild the application and see the text field populated with the value "jones".

**The `sess` object, always defined by gani, is a userland object, modified by the application in whatever way is needed.** `sess` properties may be defined at the start of the application using the configuration function "sess_initfn".

**callbacks and functions are always called with the same parameters.** Passing these params to each call allows data to be constructed or returned from any parts of the application, including the session, configuration and graph. The associated pattern's node is the one given with each call. For example, the "/main/nameinput" node is given to `getusername()` above.

 * **cb( [args], opts, fn, sess, cfg, graph, node ) {...}**,
 * **fn( [args], opts, sess, cfg, graph, node ) {...}**

**the `opts` object may be defined literally or as a pattern.**



data nodes and filtered subject values
======================================

1) Update the configuration in *main_cfg.js* to include a new page object called "pgdata" and 2) add one data node now for discussion. Later, in the next section, we'll connect the data and the document.


*main_cfg.js*

```javascript
const gani = require('gani'),
      pglabel = require('gani/src/basic/pglabel'),
      pgtext = require('gani/src/basic/pgtext'),
      pgls = require('gani/src/basic/pgls'),

      main_cb = require('./main_cb');
      main_fn = require('./main_fn');

module.exports = {
  lang : 'eng',
  locale : 'US',
  specpath : '',
  specfn : main_fn,
  speccb : main_cb,
  pages : [
    gani.pgdata, // added pgdata node
    pglabel,
    pgtext,
    pgls
  ],
  canvas : [
    '/spec/view/main'
  ]
}
```


*/patterns/spec/view/main/spec-baseLocale.json*

```json
{
  "page" : "pgls",
  "name" : "main",
  "child" : [{
    "note" : "the data user node",
    "type" : "local-ref",
    "path" : "../main-datauser"
  },{
    "type" : "local-ref",
    "path" : "../main-statictitle"
  },{
    "type" : "local-ref",
    "path" : "../main-date"
  },{
    "type" : "local-ref",
    "path" : "../main-width"
  },{
    "type" : "local-ref",
    "path" : "../main-nameinput"
  }]
}
```

*/patterns/spec/view/main-datauser/spec-baseLocale.json*

```json
{
  "page" : "pgdata",
  "name" : "datauser",

  "subject" : [{
    "namefirst" : "kim",
    "namelast" : "jones"
  }]
}
```


Rebuild the application and use the browser console to inspect the node.

```bash
_cfg._rgraph.get('/main/datauser').toJS()

  {
   ▶ childarr : [],
   ▶ datainarr : [],
   ▶ dataoutarr : [],
     isdata : true,
     name : "datauser",
     page : "pgdata",
   ▶ subject : [...],
   ▶ subjecthydrated : [...],
     uid : "/main/datauser"
  }
```

**Data page nodes, named 'pgdata' and 'pgdatals', are used to coordinate data between nodes.** "Data" nodes are similar to "dom" nodes; they are hydrated and constructed through the same system, using the same pattern resolution.

**"Data" nodes do not return a vnode for the document. They are handled in a special way by the graph patching process.** Gani applications use data nodes to store and distribute data as shown below.

*diagram, data to dom node relationship*

```bash
 ┌─────────────────────┐
 │ data node           │
 ├─────────────────────┤
 │ userdata            │
 └┬───┬───┬────────────┘
  │   │   │ 
  ▼   ▼   ▼ ┌──────────────────────┐
  │   │   └─┤ dom node             │
  │   │     ├──────────────────────┤
  │   │     │ userdata.username    │
  │   │     └──────────────────────┘
  │   │     ┌──────────────────────┐
  │   └─────┤ dom node             │
  │         ├──────────────────────┤
  │         │ userdata.username    │
  │         └──────────────────────┘
  │         ┌──────────────────────┐
  └─────────┤ dom node             │
            ├──────────────────────┤
            │ userdata.username    │
            └──────────────────────┘
```

Notice there are dom-to-data node connections, _but no dom-to-dom node connections._ Gani's patching process requires data-to-data and data-to-dom connections. Dom-to-dom connections are possible, but standardising on data-to-dom simplifies some operations, like coordinating the state of list data across nodes.

**Because patterns are resolved in-order** it is necessary to define any data node patterns "before" any patterns that reference them. For example, "datauser" above is defined before the label and text nodes.


connecting data nodes, filtering data
=====================================

Let's connect dom nodes to the data node.

1) Update the pgls node's pattern to list the datauser node, one label node and one text node. 2) Connect the dom nodes to the data node. 3) Rebuild the application and see the label update as we change the value of the text field.


*/patterns/spec/view/main/spec-baseLocale.json*

```json
{
  "page" : "pgls",
  "name" : "main",
  "child" : [{
    "note" : "the data user node",
    "type" : "local-ref",
    "path" : "../main-datauser"
  },{
    "type" : "local-ref",
    "path" : "../main-namelabel"
  },{
    "type" : "local-ref",
    "path" : "../main-nameinput"
  }]
}
```


*/patterns/spec/view/main-namelabel/spec-baseLocale.json*

```json
{
  "page" : "pglabel",
  "name" : "namelabel",
  "subject" : [{
    "type" : "subjprop",
    "path" : "/main/datauser",
    "propname" : "namefirst",
    "name" : "label"
  }]
}
```


*/patterns/spec/view/main-nameinput/spec-baseLocale.json*

```json
{
  "page" : "pgtext",
  "name" : "nameinput",
  "subject" : [{
    "labelprimary" : "user name"
  },{
    "type" : "subjprop",
    "path" : "/main/datauser",
    "propname" : "namefirst",
    "name" : "labelsecondary",
    "filterarr" : [{
      "type" : "fn",
      "fnname" : "touppercase",
      "argprops" : ["this"]
    }]
  },{
    "type" : "subjprop",
    "path" : "/main/datauser",
    "propname" : "namefirst",
    "name" : "value"
  }]
}
```


*main_fn.js*

```javascript
let main_fn = {};

main_fn.getclientwidth = () =>
  window.innerWidth + 'px';

main_fn.getdate = ([], opts) =>
  opts.type === 'now' ? Date.now() : 'later';

// added touppercase function for filterarr
main_fn.touppercase = ([val]) =>
  String(val).toUpperCase();

module.exports = main_fn;
```

Rebuild the application and begin typing into the text field and see the text field label and the label-node's label update with each key press. Each time a key is pressed a new value is "published" to the graph.

**When values are published to the graph, a patch is generated and applied to create a new graph with updated values.** The patch is created by following "edges" stored on each node.

Use the browser console to inspect the edges


```bash
_cfg._rgraph.get('/main/namelabel').toJS()

  {
   ▶ childarr : [],
   ▼ datainarr : [
     ▼ {
          refname : "namefirst",
          type : "subjprop",
          uid : "/main/datauser"
       }
     ]
   ▶ dataoutarr : [],
   ▶ domchilduid : {},
   ▶ domchilduidarr : [],
     isdom : true,
     name : "namelabel",
     page : "pgtext",
   ▶ subject : [...],
   ▶ subjecthydrated : [...],
     uid : "/main/namelabel"
  }
```


```bash
_cfg._rgraph.get('/main/datauser').toJS()

  {
   ▶ childarr : [],
   ▶ datainarr : [],
   ▼ dataoutarr : [
     ▼ {
          meta : {...},
          refname : "namefirst",
          type : "subjprop",
          uid : "/main/namelabel"
       },
     ▼ {
          meta : {...},
          refname : "namefirst",
          type : "subjprop",
          uid : "/main/nameinput"
       },
     ▼ {
          meta : {...},
          refname : "namefirst",
          type : "subjprop",
          uid : "/main/nameinput"
       }
     ],
     isdata : true,
     name : "datauser",
     page : "pgdata",
   ▶ subject : [...],
   ▶ subjecthydrated : [...],
     uid : "/main/datauser"
  }
```

As nodes are added or removed from the graph during the application lifecycle, edges related those nodes are added and removed with them.



lists and base namespaces
=========================

tbd


advanced, layout page nodes and custom page nodes
=================================================

advanced, datals nodes and pattern mapping
==========================================

advanced, routing
=================

tbd


