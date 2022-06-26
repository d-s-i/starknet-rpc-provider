import { RequestManager, HTTPTransport, Client } from "@open-rpc/client-js";
import { BigNumberish } from "starknet/utils/number";
import { getSelectorFromName } from "starknet/utils/hash";
import { 
    AddTransactionResponse, 
    Call, 
    CallContractResponse, 
    DeployContractPayload, 
    GetContractAddressesResponse, 
    GetTransactionStatusResponse, 
    GetTransactionTraceResponse, 
    Invocation, 
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
            contract_address: invokeTransaction.contractAddress,
            entry_point_selector: getSelectorFromName(invokeTransaction.entrypoint),
            calldata: invokeTransaction.calldata || []
        }, blockHash]);
        return { result: _res };
    }
    
    async getLatestBlockNumber() {
        return this.request("starknet_blockNumber", []);
    }

    async getTransactionStatus(txHash: BigNumberish): Promise<GetTransactionStatusResponse> {
        throw new Error("RPCProvider::getTransactionStatus - Function not implemented yet");
    }

    async getTransactionReceipt({ txHash, txId, }: { txHash?: BigNumberish; txId?: BigNumberish; }): Promise<TransactionReceiptResponse> {
        const receipt = await this.request("starknet_getTransactionReceipt", [txHash]);
        return receipt;
    }
    
    async getBlock(blockNumber: number | string) {
        let _blockNumber;
        if(blockNumber === "pending") {
            _blockNumber = (await this.getLatestBlockNumber()) - 1;
        } else {
            _blockNumber = +blockNumber;
        }
        const _block = await this.request("starknet_getBlockByNumber", [_blockNumber]);
        let transactions = [];
        let transaction_receipts = [];
        for(const txHash of _block.transactions) {
            const tx = await this.getTransaction(txHash);
            const receipt = await this.getTransactionReceipt({ txHash });
            transactions.push(tx);
            transaction_receipts.push(receipt);
        }
        return {
            ..._block,
            transactions,
            transaction_receipts
        };
    }

    async getTransaction(txHash: BigNumberish) {
        const transaction = await this.request("starknet_getTransactionByHash", [txHash]);
        transaction.transaction_hash = transaction.txn_hash;
        delete transaction.txn_hash;
        return transaction;
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