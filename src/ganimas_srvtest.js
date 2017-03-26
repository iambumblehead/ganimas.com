// Filename: ganimas_srvtest.js
// Timestamp: 2017.03.25-13:55:46 (last modified)
// Author(s): Bumblehead (www.bumblehead.com)
// Requires: 

const ganimas_srvtest = module.exports = (o => {

  o.mget = (o, req, res, fn) => {
    fn(null, { mockdata : true });
  },
  
  // localpost...
  o.lpost = (o, req, res, fn) => {
    o.apiSend({
      req : req,
      path : '/api/1.0/test',
      method : 'POST',
      body : req.body
    }, fn);
  },

  o.lpost = (o, req, res, fn) => {
    o.mpost.apply(0, arguments);
  },

  o.mpost = (o, req, res, fn) => {
    if (req.body && 
        req.body.user === 'default@gmail.com') {
      fn(null, JSON.stringify({ 
        accounttypenum : 1,
        applicationid : 'appid',
        sesstoken : 'sesstoken'
      }));        
    } else {
      // need check for 'user_email_not_validated'
      res.status(403);
      res.setHeader('X-Status-Reason', 'Validation failed');
      fn(null, 'invalid request');
    }
  };

  return o;
  
})({});
