/**
 *  This tests the serialization and deserialization
 *
 *  Copyright:
 *      Copyright (c) 2023 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import { Block, Hash, hashFull, Transaction } from "../src";

import * as assert from "assert";
import { BigNumber, Wallet } from "ethers";

describe("Test of Block", () => {
    it("Test buildMerkleTree", () => {
        const txs = [];
        const txs_hash = [];
        for (let idx = 0; idx < 7; idx++) {
            txs.push(
                new Transaction(
                    0,
                    (12345670 + idx).toString(),
                    1668044556,
                    BigNumber.from(idx + 1),
                    "F000100",
                    "a@example.com",
                    1
                )
            );
            txs_hash.push(hashFull(txs[idx]));
        }

        const merkel_tree = Block.buildMerkleTree(txs_hash);
        assert.strictEqual(merkel_tree.length, txs_hash.length + 7);
    });

    it("Test createBlock", () => {
        const txs = [
            new Transaction(
                0,
                "00000000",
                1668044556,
                BigNumber.from(1000000000),
                "F000100",
                "a@example.com",
                1
            ),
            new Transaction(
                1,
                "00000001",
                1668044556,
                BigNumber.from(1000000000),
                "F000100",
                "b@example.com",
                1
            ),
            new Transaction(
                2,
                "00000002",
                1668044556,
                BigNumber.from(1000000000),
                "F000100",
                "c@example.com",
                2
            ),
            new Transaction(
                3,
                "00000003",
                1668044556,
                BigNumber.from(1000000000),
                "F000100",
                "d@example.com",
                3
            ),
            new Transaction(
                4,
                "00000004",
                1668044556,
                BigNumber.from(1000000000),
                "F000100",
                "e@example.com",
                1
            ),
        ];
        const signer = new Wallet("0xf6dda8e03f9dce37c081e5d178c1fda2ebdb90b5b099de1a555a658270d8c47d");
        const prev_hash = Hash.Null;
        // @ts-ignore
        const prev_height = 0n;

        const block = Block.createBlock(prev_hash, prev_height, txs);
        const block_string = JSON.stringify(block);
        const block_json = JSON.parse(block_string);

        const block2 = Block.reviver("", block_json);

        assert.deepStrictEqual(block, block2);

        // Check hash of Block
        assert.deepStrictEqual(hashFull(block2), hashFull(block2.header));
    });
});
