/**
 *  The class that defines the purchase transaction of a block.
 *
 *  Copyright:
 *      Copyright (c) 2023 BOSAGORA Foundation All rights reserved.
 *
 *  License:
 *       MIT License. See LICENSE for details.
 */

import { BigNumber, Signer, utils } from "ethers";
import { SmartBuffer } from "smart-buffer";
import { JSONValidator } from "../../utils/JSONValidator";
import { hashFull, hashPart } from "../common/Hash";

export interface ITransaction {
    sequence: number;
    purchase_id: string;
    timestamp: number;
    amount: BigNumber;
    franchisee_id: string;
    user_email: string;
    method: number;
    signer: string;
    signature: string;
}

/**
 * The class that defines the transaction of a block.
 * Convert JSON object to TypeScript's instance.
 * An exception occurs if the required property is not present.
 */
export class Transaction implements ITransaction {
    /**
     * Of all transactions, it starts at zero and increases by one in a unique sequence
     */
    public sequence: number;

    /**
     * ID of the purchase
     */
    public purchase_id: string;

    /**
     * The time stamp
     */
    public timestamp: number;

    /**
     * The amount of sending
     */
    public amount: BigNumber;

    /**
     * The franchisee id
     */
    public franchisee_id: string;

    /**
     * The email of User
     */
    public user_email: string;

    /**
     * The method type
     */
    public method: number;

    /**
     * The signer
     */
    public signer: string;

    /**
     * The signature
     */
    public signature: string;

    /**
     * Constructor
     */
    constructor(
        sequence: number,
        purchase_id: string,
        timestamp: number,
        amount: BigNumber,
        franchisee_id: string,
        user_email: string,
        method: number,
        signer?: string,
        signature?: string
    ) {
        this.sequence = sequence;
        this.purchase_id = purchase_id;
        this.timestamp = timestamp;
        this.amount = amount;
        this.franchisee_id = franchisee_id;
        this.user_email = user_email;
        this.method = method;
        if (signer !== undefined) this.signer = signer;
        else this.signer = "";
        if (signature !== undefined) this.signature = signature;
        else this.signature = "";
    }

    /**
     * The reviver parameter to give to `JSON.parse`
     *
     * This function allows to perform any necessary conversion,
     * as well as validation of the final object.
     *
     * @param key   Name of the field being parsed
     * @param value The value associated with `key`
     * @returns A new instance of `Transaction` if `key == ""`, `value` otherwise.
     */
    public static reviver(key: string, value: any): any {
        if (key !== "") return value;

        JSONValidator.isValidOtherwiseThrow("Transaction", value);

        return new Transaction(
            value.sequence,
            value.purchase_id,
            value.timestamp,
            BigNumber.from(value.amount),
            value.franchisee_id,
            value.user_email,
            value.method,
            value.signer,
            value.signature
        );
    }

    /**
     * Collects data to create a hash.
     * @param buffer The buffer where collected data is stored
     */
    public computeHash(buffer: SmartBuffer) {
        hashPart(this.sequence, buffer);
        hashPart(this.purchase_id, buffer);
        hashPart(this.timestamp, buffer);
        hashPart(this.amount, buffer);
        hashPart(this.franchisee_id, buffer);
        hashPart(this.user_email, buffer);
        hashPart(this.method, buffer);
        hashPart(this.signer, buffer);
    }

    /**
     * Converts this object to its JSON representation
     */
    public toJSON(): any {
        return {
            sequence: this.sequence,
            purchase_id: this.purchase_id,
            timestamp: this.timestamp,
            amount: this.amount.toString(),
            franchisee_id: this.franchisee_id,
            user_email: this.user_email,
            method: this.method,
            signer: this.signer,
            signature: this.signature,
        };
    }

    /**
     * Creates and returns a copy of this object.
     */
    public clone(): Transaction {
        return new Transaction(
            this.sequence,
            this.purchase_id,
            this.timestamp,
            this.amount,
            this.franchisee_id,
            this.user_email,
            this.method,
            this.signer,
            this.signature
        );
    }

    /**
     * Sign with the wallet entered the parameters
     * @param signer Instances that can be signed
     */
    public async sign(signer: Signer) {
        this.signer = await signer.getAddress();
        const h = hashFull(this);
        this.signature = await signer.signMessage(h.data);
    }

    /**
     * Verifying the signature
     * @param address Signatory's wallet address
     */
    public verify(address?: string): boolean {
        const h = hashFull(this);
        let res: string;
        try {
            res = utils.verifyMessage(h.data, this.signature);
        } catch (error) {
            return false;
        }
        if (address !== undefined) return res.toLowerCase() === address.toLowerCase();
        return res.toLowerCase() === this.signer.toLowerCase();
    }
}
