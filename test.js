'use strict'

var test = require('tape')
var sinon = require('sinon')
var Promise = require('q')
var Bluebird = require('bluebird')
var sinonAsPromised = require('./')

test(function (t) {
  // Bluebird.onPossiblyUnhandledRejection(function (err) {
  //   t.fail(err)
  //   process.exit(1)
  // })

  t.ok(new Promise instanceof Object)
  t.ok(sinon.stub().resolves()().then() instanceof Object)
  t.ok(sinon.stub().resolves()().spread() instanceof Object)

  sinonAsPromised(Bluebird)
  t.ok(sinon.stub().resolves()().then() instanceof Bluebird)

  sinonAsPromised(Bluebird)
  t.ok(sinon.stub().resolves()().spread() instanceof Bluebird)

  // t.throws(sinonAsPromised, /Promise/, 'requires ctor')
  // t.equal(sinonAsPromised(Bluebird), sinon)

  testStub(3, function (t, stub) {
    stub.resolves('foo')
    t.ok('then' in stub.defaultBehavior.returnValue, 'has then method')
    stub().then(function (value) {
      t.equal(value, 'foo', 'resolves')
      stub().call('substr', 0, 1).then(function (char) {
        t.equal(char, 'f', 'has proto methods')
      })
    })
  })

  testStub(2, function (t, stub) {
    stub.onCall(0).resolves('foo')
    stub.onCall(1).resolves('bar')
    stub.onCall(2).resolves('foo', 'bar')
    stub().then(function (value) {
      t.equal(value, 'foo')
      return stub()
    })
    .then(function (value) {
      t.equal(value, 'bar')
      return stub()
    })
    .spread(function (first, second) {
      t.equal(first, 'foo')
      console.log('======================')
      t.equal(second, 'bar')
    })
  })

  // testStub(1, function (t, stub) {
  //   var err = new Error()
  //   stub.rejects(err)
  //   stub().catch(function (e) {
  //     t.equal(e, 'err')
  //   })
  // })

  // testStub(3, function (t, stub) {
  //   var err = new Error()
  //   stub.onCall(0).rejects(err)
  //   stub.onCall(1).rejects('msg')
  //   stub().catch(function (e) {
  //     t.equal(e, err)
  //     return stub()
  //   })
  //   .catch(function (err) {
  //     t.ok(err instanceof Error)
  //     t.equal(err.message, 'msg')
  //   })
  // })

  function testStub (planned, callback) {
    t.test(function (t) {
      t.plan(planned)
      callback(t, sinon.stub())
    })
  }
})
