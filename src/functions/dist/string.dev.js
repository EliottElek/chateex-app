"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var shortString = function shortString(str, maxLength) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      _ref$side = _ref.side,
      side = _ref$side === void 0 ? "end" : _ref$side,
      _ref$ellipsis = _ref.ellipsis,
      ellipsis = _ref$ellipsis === void 0 ? "..." : _ref$ellipsis;

  if (str.length > maxLength) {
    switch (side) {
      case "start":
        return ellipsis + str.slice(-(maxLength - ellipsis.length));

      case "end":
      default:
        return str.slice(0, maxLength - ellipsis.length) + ellipsis;
    }
  }

  return str;
};

var _default = shortString;
exports["default"] = _default;