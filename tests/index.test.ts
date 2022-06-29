import dotenv from "dotenv";
dotenv.config();
import assert from "assert";
import { RPCProvider } from "../src";
import { Provider, defaultProvider } from "starknet";
import { StandardProvider } from "../src/types";

const provider = new RPCProvider(process.env.NODE_URL!, "testnet"); // declare type to make sure providers are compatible with starknetjs

describe("RPCProvider", function() {

    it("`getBlock` from RPC and defaultProvider return same values", async function() {
        // const _block = await provider.request("starknet_getBlockByNumber", [211111, "FULL_TXN_AND_RECEIPTS"]);
        // console.log("block", _block);
        
        const rpcBlock = await provider.getBlock(254228);
        console.log("block from rpc: ", rpcBlock);

        // const block = await defaultProvider.getBlock(211111);
        // console.log("block from defaultProvider", block);
        // console.log("block from defaultProvider", block.transactions[0]);
    });
    
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

    // it("`getTransaction` from RPC and defaultProvider return same values for INVOKE txs", async function() {
    //     const hash = "0x705d6bf34d1dc0b0439f673e4f92f2fd0caa1871cb6325f521ea3aa576174c7";
    //     const invokeTx = await provider.getTransaction(hash);
    //     console.log("invokeTx", invokeTx);

    //     const invokeTx2 = await defaultProvider.getTransaction(hash);
    //     console.log("defaultProvider invokeTx", invokeTx2);
    // });

    // it("`getTransaction` from RPC and defaultProvider return same values for DEPLOY txs", async function() {
    //     const deployTx = await provider.getTransaction("0x5e0831274d145eaa3a3ba5346fd376f68aacb910ad3c2609753fdeb326f31fc");
    //     console.log("deployTx via provider", deployTx);

    //     const deployTx2 = await defaultProvider.getTransaction("0x5e0831274d145eaa3a3ba5346fd376f68aacb910ad3c2609753fdeb326f31fc");
    //     console.log("defaultProvider deployTx", deployTx2);

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