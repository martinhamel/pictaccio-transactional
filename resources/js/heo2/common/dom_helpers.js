(function(HeO2) {
    "use strict";

    HeO2.common.domHelpers = {
        calculateElementSize: function(element) {
            let boundingRect = element.getBoundingClientRect();
            let computedStyle = getComputedStyle(element);

            return {
                width: boundingRect.width + parseInt(computedStyle['margin-left'], 10) + parseInt(computedStyle['margin-right'], 10),
                height: boundingRect.height + parseInt(computedStyle['margin-top'], 10) + parseInt(computedStyle['margin-bottom'], 10)
            };
        },

        getPageBoundingRect: function(element) {
            let rect = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                width: element.offsetWidth,
                height: element.offsetHeight
            };

            do {
                rect.top += element.offsetTop  || 0;
                rect.left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while(element);

            rect.right = rect.left + rect.width;
            rect.bottom = rect.top + rect.height;

            return rect;
        },

        getParentRelativeBoundingRect: function(element, parentRelativeElement) {
            let rect = {
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                width: element.offsetWidth,
                height: element.offsetHeight
            };

            do {
                if (element.offsetParent === parentRelativeElement) {
                    break;
                }
                rect.top += element.offsetTop  || 0;
                rect.left += element.offsetLeft || 0;
                element = element.offsetParent;
            } while(element);

            rect.right = rect.left + rect.width;
            rect.bottom = rect.top + rect.height;

            return rect;
        }
    };
}(HeO2));
