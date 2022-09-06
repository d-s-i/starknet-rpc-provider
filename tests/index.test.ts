import dotenv from "dotenv";
dotenv.config();
import assert from "assert";
import { RPCProvider } from "../src";
import { Provider, defaultProvider } from "starknet";
import { StandardProvider } from "../src/types";
import { findTxWithProperties } from "./utils/index.test";

const provider = new RPCProvider(process.env.NODE_URL!, "testnet"); // declare type to make sure providers are compatible with starknetjs

const DEPLOY_TX_0 = "0x1bc2a00d66f3090ec66511f67f276323e0a26b2d324a61aed43e08ba092eb68";
const DECLARE_TX_1 = "0x584b86f6a3dd9462ad1dbdb4c7a912d2d9de04cb9fdf7b4e0a8d0651a2c8e8c";
const INVOKE_TX_0 = "0x2fa059893e469fc1a1f520a50d8b64a03ee913d71b9a33bf5b4a363ee142277";
const INVOKE_TX_1 = "0x3796576e3b42c8dc9990dea4dee0e43e0df10e4895080efc00d8cf6414046ed";

describe("RPCProvider", function() {

    // it("`getBlock` from RPC and defaultProvider return same values", async function() {
    //     // const _block = await provider.request("starknet_getBlockByNumber", [211111, "FULL_TXN_AND_RECEIPTS"]);
    //     // console.log("block", _block);
        
    //     const rpcBlock = await provider.getBlock(254228);
    //     console.log("block from rpc: ", rpcBlock);

    //     const block = await defaultProvider.getBlock(254228);
    //     console.log("block from defaultProvider", block);
    //     // console.log("block from defaultProvider", block.transactions[0]);
    // });
    
    // it("Call a contract with a blockIdentifier", async function() {
    //     const res = await provider.callContract({
    //         contractAddress: "0x07b2167313597992fce81632ef1dd7dfaf82e820f3102a7782ebad338ac5dfed",
    //         entrypoint: "get_all_s_realms_owners"
    //     }, { blockIdentifier: 251260 });
    //     console.log("res", res);
    // });

    // it("Call a contract without a blockIdentifier", async function() {
    //     const res = await provider.callContract({
    //         contractAddress: "0x07b2167313597992fce81632ef1dd7dfaf82e820f3102a7782ebad338ac5dfed",
    //         entrypoint: "get_all_s_realms_owners"
    //     });
    //     console.log("res", res);
    // });

    it("`getTransaction` from RPC and defaultProvider return same values for INVOKE txs", async function() {
        // const invokeTx = await findTxWithProperties([["type", "INVOKE_FUNCTION"], ["version", "0x1"]]);
        // console.log("invokeTx", invokeTx);
        const invokeTx = await provider.getTransaction(INVOKE_TX_1);
        console.log("invokeTx", invokeTx);

        const invokeTx2 = await defaultProvider.getTransaction(INVOKE_TX_1);
        console.log("defaultProvider invokeTx", invokeTx2);

    });

    // it("`getTransaction` from RPC and defaultProvider return same values for DEPLOY txs", async function() {
    //     const deployTx = await provider.getTransaction(DEPLOY_TX);
    //     console.log("deployTx via RPC provider", deployTx);

    //     const deployTx2 = await defaultProvider.getTransaction(DEPLOY_TX);
    //     console.log("defaultProvider deployTx", deployTx2);

    // });

    // it("`getTransaction` from RPC and defaultProvider return same values for DECLARE txs", async function() {
    //     const declareTx1 = await provider.getTransaction(DECLARE_TX);
    //     console.log("deployTx via RPC provider", declareTx1);

    //     const declareTx2 = await defaultProvider.getTransaction(DECLARE_TX);
    //     console.log("defaultProvider deployTx", declareTx2);

    // });

    // it("Get Class Hash", async function() {
    //     const res = await provider.getClassHashAt("0x174776ba232281a770545f3d487e70eeb35872bd21c744a8077c8e6c0201b88");
    //     console.log(res);
    // });

    // it("Get Class", async function() {
    //     const contractClass = await provider.getClassAt("0x691bd65ac65f3d6b9001fe864246270d561ef95798e2b7d38dd7090bd201e4b")
    //     console.log(contractClass);
    //     console.log(`CONSTRUCTOR: `, contractClass.entry_points_by_type.CONSTRUCTOR);
    //     console.log(`EXTERNAL: `, contractClass.entry_points_by_type.EXTERNAL);
    //     console.log(`L1_HANDLER: `, contractClass.entry_points_by_type.L1_HANDLER);
    // });

    // it("Get pending transactions", async function() {
    //     const res = await provider.getPendingTransactions();
    //     console.log(res);
    // });
});