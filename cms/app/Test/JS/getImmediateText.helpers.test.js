QUnit.test('getImmediateText can get its immediate child text', function (assert) {
	var node1 = document.querySelector('#getImmediateText-helpers-fixture1'),
		node2 = document.querySelector('#getImmediateText-helpers-fixture2');

	assert.equal(node1.getImmediateText(), 'Some text', "returned 'Some text' on first node");
	assert.equal(node2.getImmediateText(), 'Some textMore TextLast Text', "returned 'Some textMore TextLast Text' on second node");

});
