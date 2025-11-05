QUnit.module('Generic', {
	beforeEach: function() {
		HeO2.Server.prototype._currentLocation = serverUrl + 'dev';
	}
});

QUnit.test('Server public interface is: execute', function (assert) {
	assert.ok(jQuery.isFunction(HeO2.Server.prototype.execute), 'execute is present');
});

QUnit.test('execute returns a Deferred', function (assert) {
	var server = new HeO2.Server({testGet: {method: 'get'}});
	assert.ok(jQuery.isFunction(server.execute('testGet').promise), 'execute returned a Deferred');
});

QUnit.test('configuration is successfully prepared', function (assert) {
	var server = new HeO2.Server({
		testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
	});

	assert.equal(server._serverConfig.testGet.url, serverUrl + 'dev/testGet', 'testGet url is ok');
	assert.equal(server._serverConfig.testGet.method, 'get', 'testGet method is ok');
	assert.deepEqual(server._serverConfig.testGet.headers, HeO2.CONST.AJAX_HEADER_JSON, 'testGet headers are ok');

	assert.equal(server._serverConfig.testPost.url, serverUrl + 'dev/testPost', 'testPost url is ok');
	assert.equal(server._serverConfig.testPost.method, 'post', 'testPost method is ok');
	assert.deepEqual(server._serverConfig.testPost.headers, HeO2.CONST.AJAX_HEADER_JSON, 'testPost headers are ok');

	assert.equal(server._serverConfig.testError403.url, serverUrl + 'dev/testError403', 'testError403 url is ok');
	assert.equal(server._serverConfig.testError403.method, 'post', 'testError403 method is ok');
	assert.deepEqual(server._serverConfig.testError403.headers, HeO2.CONST.AJAX_HEADER_JSON, 'testError403 headers are ok');

	assert.equal(server._serverConfig.testError404.url, serverUrl + 'dev/testError404', 'testError404 url is ok');
	assert.equal(server._serverConfig.testError404.method, 'post', 'testError404 method is ok');
	assert.deepEqual(server._serverConfig.testError404.headers, HeO2.CONST.AJAX_HEADER_JSON, 'testError404 headers are ok');

	assert.equal(server._serverConfig.testError500.url, serverUrl + 'dev/testError500', 'testError500 url is ok');
	assert.equal(server._serverConfig.testError500.method, 'post', 'testError500 method is ok');
	assert.deepEqual(server._serverConfig.testError500.headers, HeO2.CONST.AJAX_HEADER_JSON, 'testError500 headers are ok');
});

QUnit.test('execute throws on unknown action', function (assert) {
	var server = new HeO2.Server();

	assert.throws(server.execute.bind(server), /Server RPC \| Unknown action 'undefined'/, 'correct exception thrown');
});

QUnit.test('execute can execute a remote method over HTTP GET', function (assert) {
	var asyncComplete = assert.async(),
		server = new HeO2.Server({
		testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
	});

	server.execute('testGet', [1, 2], {
			success: function(response) {
				assert.ok(true, 'call successful');
				assert.equal(response.val1, 1, 'val1 is 1');
				assert.equal(response.val2, 2, 'val2 is 2');
			},
			error: function(error) {
				assert.ok(false, 'call failure');
			},
			complete: function() {
				assert.ok(true, 'complete called');
				asyncComplete();
			}
		});
});

QUnit.test('execute can execute a remote method over HTTP POST', function (assert) {
	var asyncComplete = assert.async(),
		server = new HeO2.Server({
			testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
		});

	server.execute('testPost', {val1: 1, val2: 2}, {
		success: function(response) {
			assert.ok(true, 'call successful');
			assert.equal(response.val1, 1, 'val1 is 1');
			assert.equal(response.val2, 2, 'val2 is 2');
		},
		error: function(error) {
			assert.ok(false, 'call failure');
		},
		complete: function() {
			assert.ok(true, 'complete called');
			asyncComplete();
		}
	});
});

QUnit.test('execute can handle 403 errors', function (assert) {
	var asyncComplete = assert.async(),
		server = new HeO2.Server({
			testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
		});

	server.execute('testError403', null, {
		success: function(response) {
			assert.ok(false, 'call should not have been successful');
		},
		error: function(error) {
			assert.ok(true, 'call failure');
			assert.equal(error.status, 403, 'status is 403')
		},
		complete: function() {
			assert.ok(true, 'complete called');
			asyncComplete();
		}
	});
});

QUnit.test('execute can handle 403 errors', function (assert) {
	var asyncComplete = assert.async(),
		server = new HeO2.Server({
			testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
		});

	server.execute('testError404', null, {
		success: function(response) {
			assert.ok(false, 'call should not have been successful');
		},
		error: function(error) {
			assert.ok(true, 'call failure');
			assert.equal(error.status, 404, 'status is 404')
		},
		complete: function() {
			assert.ok(true, 'complete called');
			asyncComplete();
		}
	});
});

QUnit.test('execute can handle 403 errors', function (assert) {
	var asyncComplete = assert.async(),
		server = new HeO2.Server({
			testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
		});

	server.execute('testError500', null, {
		success: function(response) {
			assert.ok(false, 'call should not have been successful');
		},
		error: function(error) {
			assert.ok(true, 'call failure');
			assert.equal(error.status, 500, 'status is 500')
		},
		complete: function() {
			assert.ok(true, 'complete called');
			asyncComplete();
		}
	});
});

QUnit.test('execute can execute a remote method over HTTP GET using RPC notation', function (assert) {
	var asyncComplete = assert.async(),
		server = new HeO2.Server({
			testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
		});

	server.testGet( [1, 2], {
		success: function(response) {
			assert.ok(true, 'call successful');
			assert.equal(response.val1, 1, 'val1 is 1');
			assert.equal(response.val2, 2, 'val2 is 2');
		},
		error: function(error) {
			assert.ok(false, 'call failure');
		},
		complete: function() {
			assert.ok(true, 'complete called');
			asyncComplete();
		}
	});
});

QUnit.test('execute can execute a remote method over HTTP POST', function (assert) {
	var asyncComplete = assert.async(),
		server = new HeO2.Server({
			testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
		});

	server.testPost({val1: 1, val2: 2}, {
		success: function(response) {
			assert.ok(true, 'call successful');
			assert.equal(response.val1, 1, 'val1 is 1');
			assert.equal(response.val2, 2, 'val2 is 2');
		},
		error: function(error) {
			assert.ok(false, 'call failure');
		},
		complete: function() {
			assert.ok(true, 'complete called');
			asyncComplete();
		}
	});
});

QUnit.test('execute can handle 403 errors', function (assert) {
	var asyncComplete = assert.async(),
		server = new HeO2.Server({
			testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
		});

	server.testError403(null, {
		success: function(response) {
			assert.ok(false, 'call should not have been successful');
		},
		error: function(error) {
			assert.ok(true, 'call failure');
			assert.equal(error.status, 403, 'status is 403')
		},
		complete: function() {
			assert.ok(true, 'complete called');
			asyncComplete();
		}
	});
});

QUnit.test('execute can handle 403 errors', function (assert) {
	var asyncComplete = assert.async(),
		server = new HeO2.Server({
			testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
		});

	server.testError404(null, {
		success: function(response) {
			assert.ok(false, 'call should not have been successful');
		},
		error: function(error) {
			assert.ok(true, 'call failure');
			assert.equal(error.status, 404, 'status is 404')
		},
		complete: function() {
			assert.ok(true, 'complete called');
			asyncComplete();
		}
	});
});

QUnit.test('execute can handle 403 errors', function (assert) {
	var asyncComplete = assert.async(),
		server = new HeO2.Server({
			testGet: {method: 'get'}, testPost: {}, testError403: {}, testError404: {}, testError500: {}
		});

	server.testError500(null, {
		success: function(response) {
			assert.ok(false, 'call should not have been successful');
		},
		error: function(error) {
			assert.ok(true, 'call failure');
			assert.equal(error.status, 500, 'status is 500')
		},
		complete: function() {
			assert.ok(true, 'complete called');
			asyncComplete();
		}
	});
});
