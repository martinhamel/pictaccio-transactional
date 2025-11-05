(function (HeO2) {
    "use strict";

    const PARSE_FUNCTION_ANNOTATION_REGEX = /^function *\w*\(.*\)\s*{\s*"((?!use strict).*)";(?:\s|\/\/|\/\*)/i;
    const PARSE_ANNOTATION_REGEX = /([\w-]+)(?:\[(.*)\])?(?:;)?/gi;
    const PARSE_ANNOTATION_PARAMS_REGEX = /([\w-]*):?([^,\n]*)(?:,|$)/gi;

    HeO2.common.annotations = {
        read: function(func) {
            let match;

            if (typeof func !== 'function') {
                throw new Error('Annotations: func must be a function');
            }

            if (match = func.toString().match(PARSE_FUNCTION_ANNOTATION_REGEX)) {
                let annotationObj = Object.create(null);
                let annotations = match[1];

                PARSE_ANNOTATION_REGEX.lastIndex = 0;
                while ((match = PARSE_ANNOTATION_REGEX.exec(annotations)) !== null) {
                    let [,verb,params] = match;

                    if (params !== undefined) {
                        annotationObj[verb] = Object.create(null);

                        PARSE_ANNOTATION_PARAMS_REGEX.lastIndex = 0;
                        while ((match = PARSE_ANNOTATION_PARAMS_REGEX.exec(params)) !== null && match[0] !== '') {
                            let [,name,value] = match;
                            annotationObj[verb][name] = value;
                        }
                    } else {
                        annotationObj[verb] = true;
                    }
                }

                return annotationObj;
            }

            return false;
        }
    };
}(HeO2));
