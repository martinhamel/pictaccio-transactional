"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeConfigString = escapeConfigString;
function escapeConfigString(str) {
    return str.replace(/'/g, '\\\'')
        .replace(/"/g, '\\"')
        .replace(/\r{0,1}\n/g, '\\n')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .trim();
}
//# sourceMappingURL=escape_config_string.js.map