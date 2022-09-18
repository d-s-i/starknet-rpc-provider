import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
import { BigNumber } from "ethers";
import { BigNumberish } from "starknet/utils/number";
import { getSelectorFromName } from "starknet/utils/hash";
import { 
    Call, 
    CallContractResponse, 
    ContractClass, 
    DeclareContractPayload, 
    DeclareContractResponse, 
    DeployContractPayload, 
    DeployContractResponse, 
    EstimateFeeResponse, 
    GetBlockResponse, 
    GetCodeResponse, 
    GetTransactionReceiptResponse, 
    GetTransactionResponse, 
    Invocation, 
    InvocationsDetails, 
    InvokeFunctionResponse, 
    ProviderInterface
} from "starknet";
import { BlockIdentifier } from "starknet/dist/provider/utils";
import { StarknetChainId } from "starknet/dist/constants";
import { GetTransactionStatusResponse, GetTransactionTraceResponse } from "starknet/dist/types/api";

export class RPCProvider implements ProviderInterface {

    private _transport: HTTPTransport;
    private _client: Client;
    private _baseUrl: string;
    private _gatewayUrl: string;
    private _feederGatewayUrl: string;
    private _chainId: StarknetChainId;

    constructor(baseUrl: string, chain: "mainnet" | "testnet") { // i.e. http://127.0.0.1:9545
        this._transport = new HTTPTransport(baseUrl);
        this._client = new Client(new RequestManager([this._transport]));

        this._baseUrl = baseUrl;
        this._gatewayUrl = `${baseUrl}/gateway`;
        this._feederGatewayUrl = `${baseUrl}/feeder_gateway`;
        this._chainId = chain === "mainnet" ? StarknetChainId.MAINNET : StarknetChainId.TESTNET;
    }

    async request(method: string, params: any[]) {
        const result = await this._client.request({
            method: method, 
            params: params
        });
        return result;
    }

    async getChainId(): Promise<StarknetChainId> {
        const res = await this.request("starknet_chainId", []);
        return res;
    }

    async getEstimateFee(invocation: Invocation, blockIdentifier?: BlockIdentifier, details?: InvocationsDetails): Promise<EstimateFeeResponse> {
        const res = await this.request("starknet_estimateFee", [invocation, this._getBlockIdentifierObj(blockIdentifier), details]);
        return res;
    }

    async getStorageAt(contractAddress: string, key: number, blockIdentifier?: BlockIdentifier): Promise<BigNumberish> {
        return await this.request("starknet_getStorageAt", [contractAddress, key, this._getBlockIdentifierObj(blockIdentifier)])
    }

    async callContract(invokeTransaction: Call, blockIdentifier?: BlockIdentifier): Promise<CallContractResponse> {
        const _res = await this.request("starknet_call", [{
            contract_address: BigNumber.from(invokeTransaction.contractAddress).toHexString(),
            entry_point_selector: BigNumber.from(getSelectorFromName(invokeTransaction.entrypoint)).toHexString(),
            calldata: invokeTransaction.calldata?.map(value => BigNumber.from(value).toHexString()) || []
        }, this._getBlockIdentifierObj(blockIdentifier)]);
        return { result: _res };
    }
    
    async getLatestBlockNumber() {
        return this.request("starknet_blockNumber", []);
    }

    async getTransactionStatus(txHash: BigNumberish): Promise<GetTransactionStatusResponse> {
        throw new Error("RPCProvider::getTransactionStatus - Function not implemented yet");
    }

    async getTransactionReceipt(txHash: BigNumberish): Promise<GetTransactionReceiptResponse> {
        const receipt = await this.request("starknet_getTransactionReceipt", [txHash]);
        return receipt;
    }
    
    async getBlock(blockIdentifier?: BlockIdentifier): Promise<GetBlockResponse> {
        const _block = await this.request("starknet_getBlockWithTxHashes", [this._getBlockIdentifierObj(blockIdentifier)]);
        return _block;
    }

    async getBlockWithTxs(blockIdentifier?: BlockIdentifier) {
        const _block = await this.request("starknet_getBlockWithTxs", [this._getBlockIdentifierObj(blockIdentifier)]);
        return _block;
    }

    async getPendingTransactions() {
        const pendingTxs = await this.request("starknet_pendingTransactions", []);
        return pendingTxs;
    }

    /**
     * @notice by default querying `starknet_getTransactionByHash` and not `starknet_getTransactionByBlockIdAndIndex`
     * 
     * Properties missing: 
     */
    async getTransaction(txHash: BigNumberish): Promise<GetTransactionResponse> {
        const _transaction = await this.request("starknet_getTransactionByHash", [txHash]);

        return _transaction;
    }

    /**
     * @notice Get the contract class hash in the given block for the contract deployed at the given address
     * 
     * @param contractAddress 
     * @returns 
     */
    async getClassHashAt(contractAddress: string, blockIdentifier?: BlockIdentifier) {
        let _blockIdentifier = this._getBlockIdentifierObj(blockIdentifier);
        return await this.request("starknet_getClassHashAt", [_blockIdentifier, contractAddress]);
    }

    /**
     * @notice Get the contract class definition in the given block at the given address
     * 
     * @param contractAddress - The contract address you want to class at
     * @param blockIdentifier 
     * @returns 
     */
    async getClassAt(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<ContractClass> {
        let _blockIdentifier = this._getBlockIdentifierObj(blockIdentifier);
        const res = await this.request("starknet_getClassAt", [_blockIdentifier, contractAddress]);
        return res;
    }

    /**
     * @notice Get the contract class definition in the given block associated with the given hash
     * @param classHash 
     * @param blockIdentifier 
     * @returns 
     */
    async getClass(classHash: string, blockIdentifier?: BlockIdentifier) {
        return await this.request("starknet_getClass", [this._getBlockIdentifierObj(blockIdentifier), classHash]);
    }

    async getBlockTransactionCount(blockIdentifier?: BlockIdentifier) {
        return await this.request("starknet_getBlockTransactionCount", [this._getBlockIdentifierObj(blockIdentifier)]);
    }

    async getStateUpdate(blockIdentifier?: BlockIdentifier) {
        return await this.request("starknet_getStateUpdate", [this._getBlockIdentifierObj(blockIdentifier)])
    }
    
    async getTransactionTrace(txHash: BigNumberish): Promise<GetTransactionTraceResponse> {
        throw new Error("RPCProvider::getTransactionTrace - Function not implemented yet");
    }
    
    async getCode(contractAddress: string, blockIdentifier?: BlockIdentifier): Promise<GetCodeResponse> {
        const res = await this.request("starknet_getCode", [contractAddress]);
        return res;
    }

    // TODO check response
    async deployContract(payload: DeployContractPayload): Promise<DeployContractResponse> {
        const res = await this.request("starknet_addDeployTransaction", [payload]);
        return res;
    }

    async invokeFunction(invocation: Invocation): Promise<InvokeFunctionResponse> {
        const res = await this.request("starknet_addInvokeTransaction", [invocation]);
        return res;
    }
    
    async waitForTransaction(txHash: any, retryInterval?: number): Promise<void> {
        throw new Error("RPCProvider::waitForTransaction - Function not implemented yet");
    }

    async declareContract(payload: DeclareContractPayload): Promise<DeclareContractResponse> {
        const res = await this.request("starknet_addDeclareTransaction", [payload]);
        return res;
    }

    _getBlockIdentifierObj(blockIdentifier?: BlockIdentifier) {
        if(!blockIdentifier) return "latest";
        if(blockIdentifier === "pending" || blockIdentifier === "latest") return blockIdentifier;
        return typeof(blockIdentifier) === "string" ? { block_hash: blockIdentifier } : { block_number: blockIdentifier }
    }
    
    get baseUrl() {
        return this._baseUrl;
    }

    get gatewayUrl() {
        return this._gatewayUrl;
    }

    get feederGatewayUrl() {
        return this._feederGatewayUrl;
    }

    get chainId() {
        return this._chainId;
    }
}