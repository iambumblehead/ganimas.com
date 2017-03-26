// Filename: ganimas_cb.js  
// Timestamp: 2017.03.26-04:36:10 (last modified)
// Author(s): bumblehead <chris@bumblehead.com>

let main_cb = {};

// returns userid
main_cb.getuserid = ([], opts, fn) => {
  fn(null, 'userid');
};

main_cb.getusername = ([userid], opts, fn, sess) => {
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
