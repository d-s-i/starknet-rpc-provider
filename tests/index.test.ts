import dotenv from "dotenv";
dotenv.config();
import assert from "assert";
import { RPCProvider } from "../src";
import { Provider, defaultProvider } from "starknet";

const provider = new RPCProvider(process.env.NODE_URL!, "testnet"); // declare type to make sure providers are compatible with starknetjs

const DEPLOY_TX_0 = "0x1bc2a00d66f3090ec66511f67f276323e0a26b2d324a61aed43e08ba092eb68";
const DECLARE_TX_1 = "0x584b86f6a3dd9462ad1dbdb4c7a912d2d9de04cb9fdf7b4e0a8d0651a2c8e8c";
const INVOKE_TX_0 = "0x2fa059893e469fc1a1f520a50d8b64a03ee913d71b9a33bf5b4a363ee142277";
const INVOKE_TX_1 = "0x3796576e3b42c8dc9990dea4dee0e43e0df10e4895080efc00d8cf6414046ed";

/*
    async getTransactionTrace(txHash: BigNumberish): Promise<GetTransactionTraceResponse> {
    
    async getCode(contractAddress: string, blockIdentifier?: BlockIdentifier) {

    async deployContract(payload: DeployContractPayload): Promise<DeployContractResponse> {

    async invokeFunction(invocation: Invocation): Promise<InvokeFunctionResponse> {
    
    async declareContract(payload: DeclareContractPayload): Promise<DeclareContractResponse> {
*/
describe("RPCProvider", function() {

    // it("Gets the chain id", async function() {
    //     const chainId = await defaultProvider.getChainId();
    //     console.log("defaultProvider: chainId", chainId);

    //     const chainIdRpc = await provider.getChainId();
    //     console.log("RPC: chainId", chainIdRpc);
    // });

    // it("`getEstimateFee` - Estimate the fee of a tx", async function() {});

    // it("`getStorageAt` - Gets the storage of an address at a given blockIdentifier", async function() {});

    // it("`getTransactionStatus` - Get the statut of a sent transaction v0", async function() {
    //     const txStatutRpc = await provider.getTransactionStatus(INVOKE_TX_0);
    //     console.log("RPC: txStatut v0", txStatutRpc);
    // });

    // it("`getTransactionStatus` - Get the statut of a sent transaction v1", async function() {
    //     const txStatutRpc = await provider.getTransactionStatus(INVOKE_TX_1);
    //     console.log("RPC: txStatut v1", txStatutRpc);
    // });

    // it("`getTransactionReceipt` - Get the receipt of a validated tx v0", async function() {
    //     const receipt = await defaultProvider.getTransactionReceipt(INVOKE_TX_0);
    //     console.log("defaultProvider: receipt", receipt);
        
    //     const receiptRpc = await provider.getTransactionReceipt(INVOKE_TX_0);
    //     console.log("RPC: receipt v0", receiptRpc);
    // });

    // it("`getTransactionReceipt` - Get the receipt of a validated tx v1", async function() {
    //     const receipt = await defaultProvider.getTransactionReceipt(INVOKE_TX_1);
    //     console.log("defaultProvider: receipt", receipt);
        
    //     const receiptRpc = await provider.getTransactionReceipt(INVOKE_TX_1);
    //     console.log("RPC: receip v1", receiptRpc);
    // });

    // it("`getTransactionTrace` - Get the trace of v0 tx", async function() {
    //     const txTraceRpc = await provider.getTransactionTrace(INVOKE_TX_0);
    //     console.log("RPC: txTrace v0", txTraceRpc);
    // });

    // it("`getTransactionTrace` - Get the trace of v1 tx", async function() {
    //     const txTraceRpc = await provider.getTransactionTrace(INVOKE_TX_1);
    //     console.log("RPC: txTrace v1", txTraceRpc);
    // });

    // it("`getLatestBlockNumber` - Gets the latest block number", async function() {
    //     const lastestBlockNumberRpc = await provider.getLatestBlockNumber();
    //     console.log("RPC: lastestBlockNumber", lastestBlockNumberRpc);
    // });
    
    // it("`getBlock` - With blockNumber", async function() {
    //     const blockNumber = 254228;
        
    //     const block = await defaultProvider.getBlock(blockNumber);
    //     console.log("defaultProvider: ", block);

    //     const blockRpc = await provider.getBlock(blockNumber);
    //     console.log("RPC: block: ", blockRpc);
    // });

    // it("`getBlock` - With pending", async function() {
    //     const block = await defaultProvider.getBlock("pending");
    //     console.log("defaultProvider: ", block);

    //     const blockRpc = await provider.getBlock("pending");
    //     console.log("RPC: block: ", blockRpc);
    // });

    // it("`getBlock` - With latest", async function() {
    //     const block = await defaultProvider.getBlock("latest");
    //     console.log("defaultProvider: ", block);

    //     const blockRpc = await provider.getBlock("latest");
    //     console.log("RPC: block: ", blockRpc);
    // });

    // it("`getBlock getBlockWithTxs` - With blockNumber", async function() {
    //     const blockNumber = 254228;
        
    //     const blockRpc = await provider.getBlockWithTxs(blockNumber);
    //     console.log("RPC: block: ", blockRpc);
    // });
    
    // it("`callContract` - Call a contract with a blockIdentifier", async function() {
    //     const call = {
    //         contractAddress: "0x07b2167313597992fce81632ef1dd7dfaf82e820f3102a7782ebad338ac5dfed",
    //         entrypoint: "get_all_s_realms_owners"
    //     };
    //     const blockNumber = 251260;

    //     const res = await defaultProvider.callContract(call, blockNumber);
    //     console.log("defaultProvider: ", res);

    //     const resRpc = await provider.callContract(call, blockNumber);
    //     console.log("Rpc: res", resRpc);
    // });

    // it("Call a contract without a blockIdentifier", async function() {
    //     const call = {
    //         contractAddress: "0x0691bd65AC65f3D6b9001fe864246270d561ef95798E2B7D38DD7090bD201e4b",
    //         entrypoint: "get_implementation", 
    //     };

    //     const res = await provider.callContract(call);
    //     console.log("defaultProvider: res", res);

    //     const resRpc = await provider.callContract(call);
    //     console.log("RPC: res", resRpc);
    // });

    // it("`getTransaction` - INVOKE txs v1", async function() {
    //     const invokeTx = await defaultProvider.getTransaction(INVOKE_TX_1);
    //     console.log("defaultProvider: invokeTx", invokeTx);

    //     const invokeTxRpc = await provider.getTransaction(INVOKE_TX_1);
    //     console.log("RPC: invokeTx", invokeTxRpc);
    // });

    // it("`getTransaction` - DEPLOY txs v0", async function() {
    //     const deployTxRpc = await provider.getTransaction(DEPLOY_TX_0);
    //     console.log("RPC: deployTx", deployTxRpc);

    //     const deployTx = await defaultProvider.getTransaction(DEPLOY_TX_0);
    //     console.log("defaultProvider: deployTx", deployTx);

    // });

    // it("`getTransaction` - DECLARE txs v1", async function() {
    //     const declareTx1 = await provider.getTransaction(DECLARE_TX_1);
    //     console.log("deployTx via RPC provider", declareTx1);

    //     const declareTx2 = await defaultProvider.getTransaction(DECLARE_TX_1);
    //     console.log("defaultProvider deployTx", declareTx2);
    // });

    it("Get Class Hash at block identifier", async function() {
        const res = await provider.getClassHashAt("0x691bd65ac65f3d6b9001fe864246270d561ef95798e2b7d38dd7090bd201e4b");
        console.log(res);
    });

    // it("Get Class at", async function() {
    //     const contractClass = await provider.getClassAt("0x691bd65ac65f3d6b9001fe864246270d561ef95798e2b7d38dd7090bd201e4b")
    //     console.log(contractClass);
    // });

    // it("`getClass` - get class of normal contract", async function() {
    //     const contractAddress = "0x0691bd65ac65f3d6b9001fe864246270d561ef95798e2b7d38dd7090bd201e4b";
        
    // });

    // it("Get pending transactions", async function() {
    //     const res = await provider.getPendingTransactions();
    //     console.log(res);
    // });
});