"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DefaultOptions = void 0;

var _createIndex = require("./create-index");

var _textlintRuleHelper = require("textlint-rule-helper");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var TinySegmenter = require("tiny-segmenter");

var segmenter = new TinySegmenter(); // インスタンス生成

var DefaultOptions = {
  allows: [],
  allowAlphabet: true,
  allowNumber: true,
  dictUrl: null
};
exports.DefaultOptions = DefaultOptions;

var report = function report(context) {
  var _options$allowAlphabe, _options$allowNumber;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var allowAlphabet = (_options$allowAlphabe = options.allowAlphabet) !== null && _options$allowAlphabe !== void 0 ? _options$allowAlphabe : DefaultOptions.allowAlphabet;
  var allowNumber = (_options$allowNumber = options.allowNumber) !== null && _options$allowNumber !== void 0 ? _options$allowNumber : DefaultOptions.allowNumber;
  var allows = options.allows !== undefined ? options.allows : DefaultOptions.allows;
  var {
    Syntax,
    getSource,
    RuleError
  } = context;
  var usedSudachiSynonyms = new Set();
  var locationMap = new Map();
  var usedItemGroup = new Set();
  var indexPromise = (0, _createIndex.createIndex)(options);

  var matchSegment = (segment, absoluteIndex, keyItemGroupMap) => {
    var itemGroups = keyItemGroupMap.get(segment);

    if (!itemGroups) {
      return;
    }

    itemGroups.forEach(itemGroup => {
      // "アーカイブ" など同じ見出しを複数回もつItemGroupがあるため、ItemGroupごとに1度のみに限定
      var midashAtOnce = false;
      itemGroup.items.forEach(item => {
        if (!midashAtOnce && item.midashi === segment) {
          midashAtOnce = true;
          usedSudachiSynonyms.add(item);
          locationMap.set(item, {
            index: absoluteIndex
          });
        }

        usedItemGroup.add(itemGroup);
      });
    });
  };

  return (0, _textlintRuleHelper.wrapReportHandler)(context, {
    ignoreNodeTypes: [Syntax.BlockQuote, Syntax.CodeBlock, Syntax.Code, Syntax.Html, Syntax.Link, Syntax.Image, Syntax.Comment]
  }, report => {
    return {
      [Syntax.Str](node) {
        return _asyncToGenerator(function* () {
          var {
            keyItemGroupMap
          } = yield indexPromise;
          var text = getSource(node);
          var segments = segmenter.segment(text);
          var absoluteIndex = node.range[0];
          segments.forEach(segement => {
            matchSegment(segement, absoluteIndex, keyItemGroupMap);
            absoluteIndex += segement.length;
          });
        })();
      },

      [Syntax.DocumentExit](node) {
        return _asyncToGenerator(function* () {
          yield indexPromise;

          for (var itemGroup of usedItemGroup.values()) {
            var items = itemGroup.usedItems(usedSudachiSynonyms, {
              allows,
              allowAlphabet,
              allowNumber
            });

            if (items.length >= 2) {
              var 同義の見出しList = items.map(item => item.midashi); // select last used

              var _matchSegment = locationMap.get(items[items.length - 1]);

              var index = _matchSegment ? _matchSegment.index : 0;
              var message = "\u540C\u7FA9\u8A9E\u3067\u3042\u308B\u300C".concat(同義の見出しList.join("」と「"), "\u300D\u304C\u5229\u7528\u3055\u308C\u3066\u3044\u307E\u3059");
              report(node, new RuleError(message, {
                index
              }));
            }
          }
        })();
      }

    };
  });
};

var _default = report;
exports.default = _default;
//# sourceMappingURL=textlint-rule-no-synonyms.js.map