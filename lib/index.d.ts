import { BigNumberish } from "starknet/utils/number";
import { AddTransactionResponse, Call, CallContractResponse, DeployContractPayload, GetContractAddressesResponse, GetTransactionStatusResponse, GetTransactionTraceResponse, Invocation, ProviderInterface, TransactionReceiptResponse } from "starknet";
import { StarknetChainId } from "starknet/constants";
import { BlockIdentifier } from "starknet/dist/provider/utils";
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
    callContract(invokeTransaction: Call, options: {
        blockIdentifier: BlockIdentifier;
    }): Promise<CallContractResponse>;
    getLatestBlockNumber(): Promise<any>;
    getTransactionStatus(txHash: BigNumberish): Promise<GetTransactionStatusResponse>;
    getTransactionReceipt({ txHash, txId, }: {
        txHash?: BigNumberish;
        txId?: BigNumberish;
    }): Promise<TransactionReceiptResponse>;
    getBlock(blockNumber: number | string): Promise<any>;
    getTransaction(txHash: BigNumberish): Promise<any>;
    getTransactionTrace(txHash: BigNumberish): Promise<GetTransactionTraceResponse>;
    getCode(contractAddress: string): Promise<{
        bytecode: any;
        abi: any;
    }>;
    deployContract(payload: DeployContractPayload): Promise<AddTransactionResponse>;
    invokeFunction(invocation: Invocation): Promise<AddTransactionResponse>;
    waitForTransaction(txHash: any, retryInterval?: any): Promise<void>;
    waitForTx(txHash: any, retryInterval?: any): Promise<void>;
    get baseUrl(): string;
    get gatewayUrl(): string;
    get feederGatewayUrl(): string;
    get chainId(): StarknetChainId;
}
//# sourceMappingURL=index.d.ts.map