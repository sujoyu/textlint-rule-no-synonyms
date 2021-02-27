import { SudachiSynonyms } from "sudachi-synonyms-dictionary";
import { Options } from "./textlint-rule-no-synonyms";
export declare type Midashi = string;
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
export declare class ItemGroup {
    items: SudachiSynonyms[];
    constructor(items: SudachiSynonyms[]);
    usedItems(usedItemSet: Set<SudachiSynonyms>, { allowAlphabet, allowNumber, allows }: {
        allowAlphabet: boolean;
        allowNumber: boolean;
        allows: string[];
    }): SudachiSynonyms[];
}
export declare type IndexType = {
    keyItemGroupMap: Map<Midashi, ItemGroup[]>;
    SudachiSynonymsItemGroup: Map<SudachiSynonyms, ItemGroup>;
};
export declare const createIndex: (options: Options) => Promise<IndexType>;
