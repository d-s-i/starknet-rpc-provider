import { BigNumberish } from "starknet/utils/number";
import { AddTransactionResponse, Call, CallContractResponse, DeployContractPayload, GetContractAddressesResponse, GetTransactionTraceResponse, Invocation, ProviderInterface, TransactionReceiptResponse } from "starknet";
import { StarknetChainId } from "starknet/constants";
import { BlockIdentifier } from "starknet/dist/provider/utils";
import { StringMap } from "./types";
export declare class RPCProvider implements ProviderInterface {
    private _transport;
    private _client;
    private _baseUrl;
    private _gatewayUrl;
    private _feederGatewayUrl;
    private _chainId;
    constructor(baseUrl: string, chain: "mainnet" | "testnet");
    request(method: string, params: any[]): Promise<any>;
    getContractAddresses(): Promise<GetContractAddressesResponse>;
    getStorageAt(contractAddress: string, key: number, blockIdentifier?: BlockIdentifier): Promise<object>;
    callContract(invokeTransaction: Call, options?: {
        blockIdentifier: BlockIdentifier;
    }): Promise<CallContractResponse>;
    getLatestBlockNumber(): Promise<any>;
    getTransactionStatus(txHash: BigNumberish): Promise<any>;
    getTransactionReceipt(txHash: BigNumberish): Promise<TransactionReceiptResponse>;
    getBlock(blockNumber: number | "latest"): Promise<any>;
    getPendingTransactions(): Promise<any>;
    /**
     * Properties missing:
     * ANY TRANSACTIONS:
     * status, block_hash, block_number, transaction_index
     * INVOKE TRANSCACTIONS:
     * transaction.entry_point_type (partial), transaction.signature
     * DEPLOY TRANSACTION:
     * transaction.contract_address_salt, transaction.constructor_calldata
     */
    getTransaction(txHash: BigNumberish): Promise<any>;
    getClassHashAt(contractAddress: string): Promise<any>;
    getClassAt(contractAddress: string): Promise<any>;
    getTransactionTrace(txHash: BigNumberish): Promise<GetTransactionTraceResponse>;
    getCode(contractAddress: string): Promise<{
        bytecode: any;
        abi: any;
    }>;
    deployContract(payload: DeployContractPayload): Promise<AddTransactionResponse>;
    invokeFunction(invocation: Invocation): Promise<AddTransactionResponse>;
    waitForTransaction(txHash: any, retryInterval?: any): Promise<void>;
    waitForTx(txHash: any, retryInterval?: any): Promise<void>;
    declareContract(): Promise<AddTransactionResponse>;
    _populateTransaction(tx: {
        transaction: any;
        [key: string]: any;
    }): Promise<StringMap>;
    get baseUrl(): string;
    get gatewayUrl(): string;
    get feederGatewayUrl(): string;
    get chainId(): StarknetChainId;
}
//# sourceMappingURL=index.d.ts.map