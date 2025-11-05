(function(Number) {
	if (!Number.hasOwnProperty('isInteger') || HeO2.__unittest__) {
		Number.isInteger = function (value) {
				return typeof value === "number" &&
					isFinite(value) &&
					Math.floor(value) === value;
			};
	}
}(Number));
