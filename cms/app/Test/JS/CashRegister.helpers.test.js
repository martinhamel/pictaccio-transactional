QUnit.test('can correctly calculate quebec sale taxes', function (assert) {
	var register = HeO2.CashRegister.create({
			order: ['productTotal', 'shipping', 'subtotal', 'qst', 'gst', 'total'],
			operations: {
				productTotal: null,
				shipping: null,
				subtotal: {
					'sum': ['productTotal', 'shipping']
				},
				gst: {
					multiply: ['subtotal', .05]
				},
				qst: {
					multiply: ['subtotal', .09975]
				},
				total: {
					'sum': ['subtotal', 'qst', 'gst']
				}
			}
		});

	register.productTotal = 10;
	assert.equal(register.subtotal, '$10.00', 'whatever');
	assert.equal(register.gst, '$0.50');
	assert.equal(register.qst, '$1.00');
	assert.equal(register.total, '$11.50');
	register.shipping = 5;
	assert.equal(register.subtotal, '$15.00');
	assert.equal(register.gst, '$0.75');
	assert.equal(register.qst, '$1.50');
	assert.equal(register.total, '$17.25');

	register.productTotal = 58;
	register.shipping = 0;
	assert.equal(register.subtotal, '$58.00');
	assert.equal(register.gst, '$2.90');
	assert.equal(register.qst, '$5.79');
	assert.equal(register.total, '$66.69');
	register.shipping = 4.78;
	assert.equal(register.subtotal, '$62.78');
	assert.equal(register.gst, '$3.14');
	assert.equal(register.qst, '$6.26');
	assert.equal(register.total, '$72.18');

	register.shipping = 0;
	register.productTotal = 548.62;
	assert.equal(register.subtotal, '$548.62');
	assert.equal(register.gst, '$27.43');
	assert.equal(register.qst, '$54.72');
	assert.equal(register.total, '$630.77');
	register.shipping = 60.09;
	assert.equal(register.subtotal, '$608.71');
	assert.equal(register.gst, '$30.44');
	assert.equal(register.qst, '$60.72');
	assert.equal(register.total, '$699.87');

	register.shipping = 0;
	register.productTotal = 5846.27;
	assert.equal(register.subtotal, '$5,846.27');
	assert.equal(register.gst, '$292.31');
	assert.equal(register.qst, '$583.17');
	assert.equal(register.total, '$6,721.75');
	register.shipping = 400.33;
	assert.equal(register.subtotal, '$6,246.60');
	assert.equal(register.gst, '$312.33');
	assert.equal(register.qst, '$623.10');
	assert.equal(register.total, '$7,182.03');

	register.shipping = 0;
	register.productTotal = 975463115.54;
	assert.equal(register.subtotal, '$975,463,115.54');
	assert.equal(register.gst, '$48,773,155.78');
	assert.equal(register.qst, '$97,302,445.78');
	assert.equal(register.total, '$1,121,538,717.10');
	register.shipping = 14510182148.7;
	assert.equal(register.subtotal, '$15,485,645,264.24');
	assert.equal(register.gst, '$774,282,263.21');
	assert.equal(register.qst, '$1,544,693,115.11');
	assert.equal(register.total, '$17,804,620,642.56');
});


