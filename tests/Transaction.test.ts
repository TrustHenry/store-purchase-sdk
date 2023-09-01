/**
 *  Test of Transaction
 *
 *  Copyright:
 *      Copyright (c) 2023 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import { BigNumber, Wallet } from "ethers";
import { hashFull, Transaction } from "../src";

import * as assert from "assert";

describe("Transaction", () => {
    const signer1 = new Wallet("0xf6dda8e03f9dce37c081e5d178c1fda2ebdb90b5b099de1a555a658270d8c47d");
    const signer2 = new Wallet("0x023beec95e3e47cb5b56bb8b5e4357db4b8565aef61eaa661c11ebbac6a6c4e8");

    // The test codes below compare with the values calculated in Agora.
    it("Test for hash value of transaction data", async () => {
        const tx = new Transaction(
            0,
            "00000000",
            1668044556,
            BigNumber.from(1000000000),
            "F000100",
            "a@example.com",
            1
        );
        await tx.sign(signer1);

        assert.strictEqual(
            hashFull(tx).toString(),
            "0x5b02f70b1f4965a5e5acad16bfe488eca74fc8211fc229b10778710e7d11af34"
        );
    });

    it("Test for Transaction.clone()", async () => {
        const tx = new Transaction(
            0,
            "00000000",
            1668044556,
            BigNumber.from(1000000000),
            "F000100",
            "a@example.com",
            1
        );
        await tx.sign(signer1);

        const clone_tx = tx.clone();
        assert.deepStrictEqual(tx, clone_tx);
    });

    it("Test for Transaction.sign() & verify", async () => {
        const tx = new Transaction(
            0,
            "00000000",
            1668044556,
            BigNumber.from(1000000000),
            "F000100",
            "a@example.com",
            1
        );

        await tx.sign(signer1);
        assert.strictEqual(
            tx.signature,
            "0xb2a538604e7250f6cbdbc44bcaa64401c0f25f2b74690c803c28b709760764ee50fbc7da5612e0f525cb4e5bf85e0e030ac42052fc9610362dfe109c8aa3d3a71c"
        );
        assert.ok(!tx.verify(signer2.address));
        assert.ok(tx.verify(signer1.address));
        assert.ok(tx.verify());

        await tx.sign(signer2);
        assert.strictEqual(
            tx.signature,
            "0x584c67c7869ba7410361c64ddc9a2554ab57f495cd75cfafc1d4e2b88935cc1e435b97daa7fbdc260532b01d347ec8a3fc4594d3d85741277afaff2f009fac631c"
        );
        assert.ok(!tx.verify(signer1.address));
        assert.ok(tx.verify(signer2.address));
        assert.ok(tx.verify());
    });
});
