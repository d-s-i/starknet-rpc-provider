"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCProvider = void 0;
const client_js_1 = require("@open-rpc/client-js");
const hash_1 = require("starknet/utils/hash");
const constants_1 = require("starknet/constants");
class RPCProvider {
    constructor(baseUrl, chain) {
        this._transport = new client_js_1.HTTPTransport(baseUrl);
        this._client = new client_js_1.Client(new client_js_1.RequestManager([this._transport]));
        this._baseUrl = baseUrl;
        this._gatewayUrl = `${baseUrl}/gateway`;
        this._feederGatewayUrl = `${baseUrl}/feeder_gateway`;
        this._chainId = chain === "mainnet" ? constants_1.StarknetChainId.MAINNET : constants_1.StarknetChainId.TESTNET;
    }
    request(method, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this._client.request({
                method: method,
                params: params
            });
            return result;
        });
    }
    getContractAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("RPCProvider::getContractAddresses - Function not implemented yet");
        });
    }
    getStorageAt(contractAddress, key, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("RPCProvider::getStorageAt - Function not implemented yet");
        });
    }
    callContract(invokeTransaction, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let blockHash;
            if (!(options === null || options === void 0 ? void 0 : options.blockIdentifier) ||
                (typeof (options.blockIdentifier) === "number" || options.blockIdentifier === "pending" || options.blockIdentifier === "latest")) {
                const latestBlockNumber = typeof (options === null || options === void 0 ? void 0 : options.blockIdentifier) === "number" ? options.blockIdentifier : yield this.getLatestBlockNumber();
                const latestBlock = yield this.getBlock(latestBlockNumber);
                blockHash = latestBlock.block_hash;
            }
            else {
                blockHash = options.blockIdentifier;
            }
            const _res = yield this.request("starknet_call", [{
                    contract_address: invokeTransaction.contractAddress,
                    entry_point_selector: (0, hash_1.getSelectorFromName)(invokeTransaction.entrypoint),
                    calldata: invokeTransaction.calldata || []
                }, blockHash]);
            return { result: _res };
        });
    }
    getLatestBlockNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request("starknet_blockNumber", []);
        });
    }
    getTransactionStatus(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("RPCProvider::getTransactionStatus - Function not implemented yet");
        });
    }
    getTransactionReceipt(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.request("starknet_getTransactionReceipt", [txHash]);
            return receipt;
        });
    }
    getBlock(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            let _blockNumber;
            if (blockNumber === "latest") {
                _blockNumber = yield this.getLatestBlockNumber();
            }
            else {
                _blockNumber = +blockNumber;
            }
            const _block = yield this.request("starknet_getBlockByNumber", [_blockNumber, "FULL_TXN_AND_RECEIPTS"]);
            let transactions = [];
            let transaction_receipts = [];
            for (const tx of _block.transactions) {
                yield this._populateTransaction(tx);
                tx.transaction_hash = tx.txn_hash;
                const lastTxIndex = transactions.push(tx);
                transaction_receipts.push({
                    transaction_index: lastTxIndex - 1,
                    events: tx.events,
                    transaction_hash: tx.transaction_hash
                });
            }
            return Object.assign(Object.assign({}, _block), { transactions,
                transaction_receipts });
        });
    }
    getPendingTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingTxs = yield this.request("starknet_pendingTransactions", []);
            return pendingTxs;
        });
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
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const _transaction = yield this.request("starknet_getTransactionByHash", [txHash]);
            _transaction.transaction_hash = _transaction.txn_hash;
            delete _transaction.txn_hash;
            yield this._populateTransaction(_transaction);
            return {
                transaction: _transaction,
            };
        });
    }
    getClassHashAt(contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request("starknet_getClassHashAt", [contractAddress]);
        });
    }
    getClassAt(contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request("starknet_getClassAt", [contractAddress]);
            return res;
        });
    }
    getTransactionTrace(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("RPCProvider::getTransactionTrace - Function not implemented yet");
        });
    }
    getCode(contractAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bytecode, abi: _abi } = yield this.request("starknet_getCode", [contractAddress]);
            return { bytecode, abi: JSON.parse(_abi) };
        });
    }
    deployContract(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("RPCProvider::deployContract - Function not implemented yet");
            // const tx = await this.request("starknet_addDeployTransaction")
        });
    }
    invokeFunction(invocation) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("RPCProvider::invokeFunction - Function not implemented yet");
        });
    }
    waitForTransaction(txHash, retryInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("RPCProvider::waitForTransaction - Function not implemented yet");
        });
    }
    waitForTx(txHash, retryInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("RPCProvider::waitForTx - Deprecated, use waitForTransaction instead");
        });
    }
    declareContract() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error(`RPCProvider::declareContract - Function not implemented yet`);
        });
    }
    _populateTransaction(tx) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log("tx", tx);
            // const contractClass = await this.getClassAt(tx.transaction.contract_address);
            // const entryPointSelector = tx.transaction.entry_point_selector;
            // console.log("entryPointSelector", entryPointSelector);
            // console.log(`CONSTRUCTOR: `, contractClass.entry_points_by_type.CONSTRUCTOR);
            // console.log(`EXTERNAL: `, contractClass.entry_points_by_type.EXTERNAL);
            // console.log(`L1_HANDLER: `, contractClass.entry_points_by_type.L1_HANDLER);
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
            if (tx.entry_point_selector) {
                tx.entry_point_type = "EXTERNAL";
                tx.type = "INVOKE_FUNCTION";
            }
            else {
                if (tx.contract_address) {
                    const contractClassHash = yield this.getClassHashAt(tx.contract_address);
                    tx.class_hash = contractClassHash;
                    tx.type = "DEPLOY";
                }
                else {
                    tx.type = "DECLARE";
                }
            }
        });
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
exports.RPCProvider = RPCProvider;
//# sourceMappingURL=index.js.map