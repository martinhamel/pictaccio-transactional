(function() {
	"use strict";

	if (typeof Array.shuffle === 'undefined') {
        Array.prototype.shuffle = function() {
            for (var i = this.length - 1, j, temp; i > 0; --i) {
                j = Math.floor(Math.random() * (i + 1));
                temp = this[i];
                this[i] = this[j];
                this[j] = temp;
            }

            return this;
        }
    }
}());
