import { BigNumberish } from "starknet/utils/number";
import { Call, CallContractResponse, ContractClass, DeclareContractPayload, DeclareContractResponse, DeployContractPayload, DeployContractResponse, EstimateFeeResponse, GetBlockResponse, GetCodeResponse, GetTransactionReceiptResponse, GetTransactionResponse, Invocation, InvocationsDetails, InvokeFunctionResponse, ProviderInterface } from "starknet";
import { BlockIdentifier } from "starknet/dist/provider/utils";
import { StarknetChainId } from "starknet/dist/constants";
import { GetTransactionStatusResponse, GetTransactionTraceResponse } from "starknet/dist/types/api";
export declare class RPCProvider implements ProviderInterface {
    private _transport;
    private _client;
    private _baseUrl;
    private _gatewayUrl;
    private _feederGatewayUrl;
    private _chainId;
    constructor(baseUrl: string, chain: "mainnet" | "testnet");
    request(method: string, params: any[]): Promise<any>;
    getChainId(): Promise<StarknetChainId>;
    getEstimateFee(invocation: Invocation, blockIdentifier?: BlockIdentifier, details?: InvocationsDetails): Promise<EstimateFeeResponse>;
    getStorageAt(contractAddress: string, key: number, blockIdentifier?: BlockIdentifier): Promise<BigNumberish>;
    callContract(invokeTransaction: Call, blockIdentifier?: BlockIdentifier): Promise<CallContractResponse>;
    getLatestBlockNumber(): Promise<any>;
    getTransactionStatus(txHash: BigNumberish): Promise<GetTransactionStatusResponse>;
    getTransactionReceipt(txHash: BigNumberish): Promise<GetTransactionReceiptResponse>;
    getBlock(blockIdentifier?: BlockIdentifier): Promise<GetBlockResponse>;
    getBlockWithTxs(blockIdentifier?: BlockIdentifier): Promise<any>;
    getPendingTransactions(): Promise<any>;
    /**
     * @notice by default querying `starknet_getTransactionByHash` and not `starknet_getTransactionByBlockIdAndIndex`
     *
     * Properties missing:
     */
    getTransaction(txHash: BigNumberish): Promise<GetTransactionResponse>;
    /**
     * @notice Get the contract class hash in the given block for the contract deployed at the given address
     *
     * @param contractAddress
     * @returns
     */
    getClassHashAt(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<any>;
    /**
     * @notice Get the contract class definition in the given block at the given address
     *
     * @param contractAddress - The contract address you want to class at
     * @param blockIdentifier
     * @returns
     */
    getClassAt(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<ContractClass>;
    /**
     * @notice Get the contract class definition in the given block associated with the given hash
     * @param classHash
     * @param blockIdentifier
     * @returns
     */
    getClass(classHash: string, blockIdentifier?: BlockIdentifier): Promise<any>;
    getBlockTransactionCount(blockIdentifier?: BlockIdentifier): Promise<any>;
    getStateUpdate(blockIdentifier?: BlockIdentifier): Promise<any>;
    getTransactionTrace(txHash: BigNumberish): Promise<GetTransactionTraceResponse>;
    getCode(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<GetCodeResponse>;
    deployContract(payload: DeployContractPayload): Promise<DeployContractResponse>;
    invokeFunction(invocation: Invocation): Promise<InvokeFunctionResponse>;
    waitForTransaction(txHash: any, retryInterval?: number): Promise<void>;
    declareContract(payload: DeclareContractPayload): Promise<DeclareContractResponse>;
    _getBlockIdentifierObj(blockIdentifier?: BlockIdentifier): any;
    get baseUrl(): string;
    get gatewayUrl(): string;
    get feederGatewayUrl(): string;
    get chainId(): StarknetChainId;
}
//# sourceMappingURL=index.d.ts.map