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
            contract_address: invokeTransaction.contractAddress,
            entry_point_selector: getSelectorFromName(invokeTransaction.entrypoint),
            calldata: invokeTransaction.calldata || []
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

            const transactionsArrLength = transactions.push(tx);
            transaction_receipts.push({
                ...receipt,
                transaction_index: transactionsArrLength - 1
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
        _transaction.transaction_hash = _transaction.txn_hash;
        delete _transaction.txn_hash;
        const transaction = await this._populateTransaction({
            transaction: _transaction,
            transaction_hash: _transaction.transaction_hash,
        });

        return transaction;
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

    async _populateTransaction(tx: any) {
        console.log("tx", tx);
        const contractClass = await this.getClassAt(tx.transaction.contract_address);
        const entryPointSelector = tx.transaction.entry_point_selector;
        console.log("entryPointSelector", entryPointSelector);
        console.log(`CONSTRUCTOR: `, contractClass.entry_points_by_type.CONSTRUCTOR);
        console.log(`EXTERNAL: `, contractClass.entry_points_by_type.EXTERNAL);
        console.log(`L1_HANDLER: `, contractClass.entry_points_by_type.L1_HANDLER);
        // let isExternal = false;
        // let isConstructor = false;
        // let isL1Handler = false;
        // let isDeploy = false;

        // if(entryPointSelector) {
        //     contractClass.entry_points_by_type.EXTERNAL.forEach((entrypoint: { offset: string, selector: string }) => {
        //         if(BigNumber.from(entrypoint.selector).eq(entryPointSelector)) {
        //             isExternal = true;
        //         }
        //     });
    
        //     contractClass.entry_points_by_type.CONSTRUCTOR.forEach((entrypoint: { offset: string, selector: string }) => {
        //         if(BigNumber.from(entrypoint.selector).eq(entryPointSelector)) {
        //             isConstructor = true;
        //         }
        //     });
    
        //     contractClass.entry_points_by_type.L1_HANDLER.forEach((entrypoint: { offset: string, selector: string }) => {
        //         if(BigNumber.from(entrypoint.selector).eq(entryPointSelector)) {
        //             isL1Handler = true;
        //         }
        //     });
        // } else {
        //     isDeploy = true;
        // }

        // if(isExternal) {
        //     tx.transaction.entry_point_type = "EXTERNAL";
        //     return {
        //         ...tx,
        //         type: "INVOKE_FUNCTION"
        //     };
        // } else if(isL1Handler) {
        //     tx.transaction.entry_point_type = "L1_HANDLER";
        //     return {
        //         ...tx,
        //         type: "DECLARE"
        //     };
        // } else if(isConstructor) {
        //     tx.transaction.entry_point_type = "CONSTRUCTOR";
        //     return {
        //         ...tx,
        //         type: "DEPLOY"
        //     };
        // } else {
        //     console.log("NOT IN ANY CASE", );
        // }

        if(tx.transaction.entry_point_selector) {
            tx.transaction.entry_point_type = "EXTERNAL";
            return {
                ...tx,
                type: "INVOKE_FUNCTION"
            }
        } else {
            const contractClassHash = await this.getClassHashAt(tx.transaction.contract_address);
            tx.transaction.class_hash = contractClassHash
            return {
                ...tx,
                type: "DEPLOY"
            };
        }
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