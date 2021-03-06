import { TextlintRuleReporter } from "@textlint/types";
export interface Options {
    /**
     * 許可するワードの配列
     * ワードは完全一致で比較し、一致した場合は無視されます
     * 例) ["ウェブアプリ", "ウェブアプリケーション"]
     */
    allows?: string[];
    /**
     * 同じ語形の語の中でのアルファベットの表記揺れを許可するかどうか
     * trueの場合はカタカナとアルファベットの表記ゆれを許可します
     * 例) 「ブログ」と「blog」
     * Default: true
     */
    allowAlphabet?: boolean;
    /**
     * 同じ語形の語の中での漢数字と数字の表記ゆれを許可するかどうか
     * trueの場合は漢数字と数字の表記ゆれを許可します
     * 例) 「1」と「一」
     * Default: true
     */
    allowNumber?: boolean;
    dictUrl?: string | null;
}
export declare const DefaultOptions: Required<Options>;
declare const report: TextlintRuleReporter<Options>;
export default report;
