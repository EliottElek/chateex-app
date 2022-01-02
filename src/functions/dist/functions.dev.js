"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var getCurrentTime = function getCurrentTime() {
  var today = new Date();
  var time = today.getHours() + ":" + today.getMinutes();
  return time;
};

var _default = getCurrentTime;
exports["default"] = _default;