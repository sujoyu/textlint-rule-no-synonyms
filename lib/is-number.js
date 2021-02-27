"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNumberString = void 0;
var kanNumbers = ["〇", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

var isNumberString = str => {
  return /\d/.test(str) || kanNumbers.includes(str);
};

exports.isNumberString = isNumberString;
//# sourceMappingURL=is-number.js.map