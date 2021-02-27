"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndex = exports.ItemGroup = void 0;

var _sudachiSynonymsDictionary = require("sudachi-synonyms-dictionary");

var _isNumber = require("./is-number");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

/**
 * Dictionary Design
 *
 * // Index
 * <Midashi>: ItemGroup[]
 * // Check
 * SudachiSynonyms: boolean
 * ItemGroup: boolean
 * // Collection
 * usedItemGroup.forEach
 */
class ItemGroup {
  constructor(items) {
    this.items = items;
  }

  usedItems(usedItemSet, _ref) {
    var {
      allowAlphabet,
      allowNumber,
      allows
    } = _ref;
    // sort by used
    return Array.from(usedItemSet.values()).filter(item => {
      if (allowAlphabet && (item.hyoukiYure === "アルファベット表記" || item.ryakusyou === "略語・略称/アルファベット")) {
        // アルファベット表記
        // blog <-> ブログ
        // 略語・略称/アルファベット
        // OS <-> オペレーションシステム
        return false;
      } // 数値の違いは無視する


      if (allowNumber && (0, _isNumber.isNumberString)(item.midashi)) {
        return false;
      }

      if (allows.includes(item.midashi)) {
        return false;
      }

      return this.items.includes(item);
    });
  }

}
/**
 * インストールのチェック
 */


exports.ItemGroup = ItemGroup;

var assertInstallationSudachiSynonymsDictionary = () => {
  try {
    require("sudachi-synonyms-dictionary");
  } catch (error) {
    throw new Error("sudachi-synonyms-dictionary\u304C\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002\n\u30EB\u30FC\u30EB\u3068\u306F\u5225\u306Bsudachi-synonyms-dictionary\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u3057\u3066\u304F\u3060\u3055\u3044\u3002\n      \n$ npm install sudachi-synonyms-dictionary\n\n\n");
  }
};

var _ret = null;

var createIndex = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (options) {
    if (_ret) {
      return Promise.resolve(_ret);
    }

    assertInstallationSudachiSynonymsDictionary();
    var keyItemGroupMap = new Map();
    var SudachiSynonymsItemGroup = new Map();
    var SynonymsDictionary = yield (0, _sudachiSynonymsDictionary.fetchDictionary)({
      url: options.dictUrl || "undefined dictionaly url"
    });
    SynonymsDictionary.forEach(group => {
      var groupByVocabularyNumber = group.items.reduce((res, item) => {
        res[item.vocabularyNumber] = (res[item.vocabularyNumber] || []).concat(item);
        return res;
      }, {});
      var itemGroups = Object.values(groupByVocabularyNumber).filter(items => {
        return items.length > 1;
      }).map(items => {
        return new ItemGroup(items);
      }); // register key with itemGroup

      itemGroups.forEach(itemGroup => {
        itemGroup.items.forEach(item => {
          var oldItemGroup = keyItemGroupMap.get(item.midashi) || [];
          keyItemGroupMap.set(item.midashi, oldItemGroup.concat(itemGroup));
          SudachiSynonymsItemGroup.set(item, itemGroup);
        });
      });
    });
    _ret = {
      keyItemGroupMap,
      SudachiSynonymsItemGroup
    };
    return Promise.resolve(_ret);
  });

  return function createIndex(_x) {
    return _ref2.apply(this, arguments);
  };
}();

exports.createIndex = createIndex;
//# sourceMappingURL=create-index.js.map