import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
import { BigNumber } from "ethers";
import { BigNumberish } from "starknet/utils/number";
import { getSelectorFromName } from "starknet/utils/hash";
import { 
    AddTransactionResponse, 
    Call, 
    CallContractResponse, 
    DeclareTransaction, 
    DeployContractPayload, 
    DeployTransaction, 
    GetContractAddressesResponse, 
    GetTransactionStatusResponse, 
    GetTransactionTraceResponse, 
    Invocation, 
    InvokeFunctionTransaction, 
    ProviderInterface, 
    TransactionReceiptResponse 
} from "starknet";
import { StarknetChainId } from "starknet/constants";
import { BlockIdentifier } from "starknet/dist/provider/utils";

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

    async getContractAddresses(): Promise<GetContractAddressesResponse> {
        throw new Error("RPCProvider::getContractAddresses - Function not implemented yet");
    }

    async getStorageAt(contractAddress: string, key: number, blockIdentifier?: BlockIdentifier): Promise<object> {
        throw new Error("RPCProvider::getStorageAt - Function not implemented yet");
    }

    async callContract(invokeTransaction: Call, options?: { blockIdentifier: BlockIdentifier; }): Promise<CallContractResponse> {
        let blockHash;
        if(
            !options?.blockIdentifier || 
            (typeof(options.blockIdentifier) === "number" || options.blockIdentifier === "pending" || options.blockIdentifier === "latest")
        ) {
            const latestBlockNumber = typeof(options?.blockIdentifier) === "number" ? options.blockIdentifier : await this.getLatestBlockNumber();
            const latestBlock = await this.getBlock(latestBlockNumber);
            blockHash = latestBlock.block_hash;
        } else { blockHash = options.blockIdentifier }
        
        const _res = await this.request("starknet_call", [{
            contract_address: BigNumber.from(invokeTransaction.contractAddress).toHexString(),
            entry_point_selector: BigNumber.from(getSelectorFromName(invokeTransaction.entrypoint)).toHexString(),
            calldata: invokeTransaction.calldata?.map(value => BigNumber.from(value).toHexString()) || []
        }, blockHash]);
        return { result: _res };
    }
    
    async getLatestBlockNumber() {
        return this.request("starknet_blockNumber", []);
    }

    async getTransactionStatus(txHash: BigNumberish): Promise<any /*GetTransactionStatusResponse*/> {
        throw new Error("RPCProvider::getTransactionStatus - Function not implemented yet");
    }

    async getTransactionReceipt(txHash: BigNumberish): Promise<TransactionReceiptResponse> {
        const receipt = await this.request("starknet_getTransactionReceipt", [txHash]);
        return receipt;
    }
    
    async getBlock(blockNumber: number | "latest") {
        let _blockNumber;
        if(blockNumber === "latest") {
            _blockNumber = await this.getLatestBlockNumber();
        } else {
            _blockNumber = +blockNumber;
        }
        const _block = await this.request("starknet_getBlockByNumber", [_blockNumber, "FULL_TXN_AND_RECEIPTS"]);
        let transactions = [];
        let transaction_receipts = [];
        for(const tx of _block.transactions) {
            const lastTxIndex = transactions.push(tx);

            transaction_receipts.push({
                transaction_index: lastTxIndex - 1,
                events: tx.events,
                transaction_hash: tx.transaction_hash
            });
        }
        return {
            ..._block,
            transactions,
            transaction_receipts
        };
    }

    async getPendingTransactions() {
        const pendingTxs = await this.request("starknet_pendingTransactions", []);
        return pendingTxs;
    }

    /**
     * Properties missing: 
     * ANY TRANSACTIONS:
     * status, block_hash, block_number, transaction_index
     * INVOKE TRANSCACTIONS:
     * transaction.entry_point_type (partial), transaction.signature
     * DEPLOY TRANSACTION:
     * transaction.contract_address_salt, transaction.constructor_calldata
     */
    async getTransaction(txHash: BigNumberish) {
        const _transaction = await this.request("starknet_getTransactionByHash", [txHash]);

        return {
            transaction: _transaction,
        } as any;
    }

    async getClassHashAt(contractAddress: string) {
        return await this.request("starknet_getClassHashAt", [contractAddress]);
    }

    async getClassAt(contractAddress: string) {
        const res = await this.request("starknet_getClassAt", [contractAddress]);
        return res;
    }

    async getTransactionTrace(txHash: BigNumberish): Promise<GetTransactionTraceResponse> {
        throw new Error("RPCProvider::getTransactionTrace - Function not implemented yet");
    }

    async getCode(contractAddress: string) {
        const { bytecode, abi: _abi } = await this.request("starknet_getCode", [contractAddress]);
        return { bytecode, abi: JSON.parse(_abi) };
    }

    async deployContract(payload: DeployContractPayload): Promise<AddTransactionResponse> {
        throw new Error("RPCProvider::deployContract - Function not implemented yet");
        // const tx = await this.request("starknet_addDeployTransaction")
    }

    async invokeFunction(invocation: Invocation): Promise<AddTransactionResponse> {
        throw new Error("RPCProvider::invokeFunction - Function not implemented yet");
    }
    
    async waitForTransaction(txHash: any, retryInterval?: any): Promise<void> {
        throw new Error("RPCProvider::waitForTransaction - Function not implemented yet");
    }

    async waitForTx(txHash: any, retryInterval?: any): Promise<void> {
        throw new Error("RPCProvider::waitForTx - Deprecated, use waitForTransaction instead");
    }

    async declareContract(): Promise<AddTransactionResponse> {
        throw new Error(`RPCProvider::declareContract - Function not implemented yet`);
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