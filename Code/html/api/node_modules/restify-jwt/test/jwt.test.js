var jwt = require('jsonwebtoken');
var assert = require('assert');

var restifyjwt = require('../lib');
var restify = require('restify');

describe('failure tests', function () {
  var req = {};
  var res = {};

  it('should throw if options not sent', function() {
    try {
      restifyjwt();
    } catch(e) {
      assert.ok(e);
      assert.equal(e.message, 'secret should be set');
    }
  });

  it('should throw if no authorization header and credentials are required', function() {
    restifyjwt({secret: 'shhhh', credentialsRequired: true})(req, res, function(err) {
      assert.ok(err);
      assert.equal(err.message, 'No authorization token was found');
    });
  });

  it('support unless skip', function() {
    req.originalUrl = '/index.html';
    restifyjwt({secret: 'shhhh'}).unless({path: '/index.html'})(req, res, function(err) {
      assert.ok(!err);
    });
  });

  it('should skip on CORS preflight', function() {
    var corsReq = {};
    corsReq.method = 'OPTIONS';
    corsReq.headers = {
      'access-control-request-headers': 'sasa, sras,  authorization'
    };
    restifyjwt({secret: 'shhhh'})(corsReq, res, function(err) {
      assert.ok(!err);
    });
  });

  it('should throw if authorization header is malformed', function() {
    req.headers = {};
    req.headers.authorization = 'wrong';
    restifyjwt({secret: 'shhhh'})(req, res, function(err) {
      assert.ok(err);
      assert.equal(err.message, 'Format is Authorization: Bearer [token]');
    });
  });

  it('should throw if authorization header is not Bearer', function() {
    req.headers = {};
    req.headers.authorization = 'Basic foobar';
    restifyjwt({secret: 'shhhh'})(req, res, function(err) {
      assert.ok(err);
      assert.equal(err.body.code, 'InvalidCredentials');
    });
  });

  it('should throw if authorization header is not well-formatted jwt', function() {
    req.headers = {};
    req.headers.authorization = 'Bearer wrongjwt';
    restifyjwt({secret: 'shhhh'})(req, res, function(err) {
      assert.ok(err);
      assert.equal(err.body.code, 'InvalidCredentials');
    });
  });

  it('should throw if authorization header is not valid jwt', function() {
    var secret = 'shhhhhh';
    var token = jwt.sign({foo: 'bar'}, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    restifyjwt({secret: 'different-shhhh'})(req, res, function(err) {
      assert.ok(err);
      assert.equal(err.body.code, 'InvalidCredentials');
      assert.equal(err.we_cause.message, 'invalid signature');
    });
  });

  it('should throw if audience is not expected', function() {
    var secret = 'shhhhhh';
    var token = jwt.sign({foo: 'bar', aud: 'expected-audience'}, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    restifyjwt({secret: 'shhhhhh', audience: 'not-expected-audience'})(req, res, function(err) {
      assert.ok(err);
      assert.equal(err.body.code, 'InvalidCredentials');
      assert.equal(err.we_cause.message, 'jwt audience invalid. expected: not-expected-audience');
    });
  });

  it('should throw if token is expired', function() {
    var secret = 'shhhhhh';
    var token = jwt.sign({foo: 'bar', exp: 1382412921 }, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    restifyjwt({secret: 'shhhhhh'})(req, res, function(err) {
      assert.ok(err);
      assert.equal(err.body.code, 'InvalidCredentials');
      assert.equal(err.we_cause.message, 'jwt expired');
    });
  });

  it('should throw if token issuer is wrong', function() {
    var secret = 'shhhhhh';
    var token = jwt.sign({foo: 'bar', iss: 'http://foo' }, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    restifyjwt({secret: 'shhhhhh', issuer: 'http://wrong'})(req, res, function(err) {
      assert.ok(err);
      assert.equal(err.body.code, 'InvalidCredentials');
      assert.equal(err.we_cause.message, 'jwt issuer invalid. expected: http://wrong');
    });
  });

  it('should use errors thrown from custom getToken function', function() {
    var secret = 'shhhhhh';
    var token = jwt.sign({foo: 'bar'}, secret);

    function getTokenThatThrowsError() {
      throw new restify.errors.InvalidCredentialsError('Invalid token!');
    }

    restifyjwt({
      secret: 'shhhhhh',
      getToken: getTokenThatThrowsError
    })(req, res, function(err) {
      assert.ok(err);
      assert.equal(err.message, 'Invalid token!');
    });
  });


  it('should throw error when signature is wrong', function() {
      var secret = "shhh";
      var token = jwt.sign({foo: 'bar', iss: 'http://www'}, secret);
      // manipulate the token
      var newContent = new Buffer("{foo: 'bar', edg: 'ar'}").toString('base64');
      var splitetToken = token.split(".");
      splitetToken[1] = newContent;
      var newToken = splitetToken.join(".");

      // build request
      req.headers = [];
      req.headers.authorization = 'Bearer ' + newToken;
      restifyjwt({secret: secret})(req,res, function(err) {
        assert.ok(err);
        assert.equal(err.body.code, 'InvalidCredentials');
        assert.equal(err.we_cause.message, 'invalid token');
      });
  });

});

describe('work tests', function () {
  var req = {};
  var res = {};

  it('should work if authorization header is valid jwt', function() {
    var secret = 'shhhhhh';
    var token = jwt.sign({foo: 'bar'}, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    restifyjwt({secret: secret})(req, res, function() {
      assert.equal('bar', req.user.foo);
    });
  });

  it('should work if authorization header is valid with a buffer secret', function() {
    var secret = new Buffer('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', 'base64');
    var token = jwt.sign({foo: 'bar'}, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    restifyjwt({secret: secret})(req, res, function() {
      assert.equal('bar', req.user.foo);
    });
  });

  it('should set userProperty if option provided', function() {
    var secret = 'shhhhhh';
    var token = jwt.sign({foo: 'bar'}, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    restifyjwt({secret: secret, userProperty: 'auth'})(req, res, function() {
      assert.equal('bar', req.auth.foo);
    });
  });

  it('should work if no authorization header and credentials are not required', function() {
    req = {};
    restifyjwt({secret: 'shhhh', credentialsRequired: false})(req, res, function(err) {
      assert(typeof err === 'undefined');
    });
  });

  it('should work if token is expired and credentials are not required', function() {
    var secret = 'shhhhhh';
    var token = jwt.sign({foo: 'bar', exp: 1382412921}, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    restifyjwt({ secret: secret, credentialsRequired: false })(req, res, function(err) {
      assert(typeof err === 'undefined');
      assert(typeof req.user === 'undefined')
    });
  });

  it('should not work if no authorization header', function() {
    req = {};
    restifyjwt({ secret: 'shhhh' })(req, res, function(err) {
      assert(typeof err !== 'undefined');
    });
  });

  it('should work with a custom getToken function', function() {
    var secret = 'shhhhhh';
    var token = jwt.sign({foo: 'bar'}, secret);

    req.headers = {};
    req.query = {};
    req.query.token = token;

    function getTokenFromQuery(req) {
      return req.query.token;
    }

    restifyjwt({
      secret: secret,
      getToken: getTokenFromQuery
    })(req, res, function() {
      assert.equal('bar', req.user.foo);
    });
  });

  it('should work with a secretCallback function that accepts header argument', function() {
    var secret = 'shhhhhh';
    var secretCallback = function(req, headers, payload, cb) {
      assert.equal(headers.alg, 'HS256');
      assert.equal(payload.foo, 'bar');
      process.nextTick(function(){ return cb(null, secret); });
    };
    var token = jwt.sign({foo: 'bar'}, secret);

    req.headers = {};
    req.headers.authorization = 'Bearer ' + token;
    restifyjwt({secret: secretCallback})(req, res, function() {
      assert.equal('bar', req.user.foo);
    });
  });
});
