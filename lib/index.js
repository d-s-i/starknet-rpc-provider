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
            const _res = yield this.request("starknet_call", [{
                    contract_address: invokeTransaction.contractAddress,
                    entry_point_selector: (0, hash_1.getSelectorFromName)(invokeTransaction.entrypoint),
                    calldata: invokeTransaction.calldata || []
                }, options.blockIdentifier /* blockHash */]);
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
    getTransactionReceipt({ txHash, txId, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const receipt = yield this.request("starknet_getTransactionReceipt", [txHash]);
            return receipt;
        });
    }
    getBlock(blockNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            let _blockNumber;
            if (blockNumber === "pending") {
                _blockNumber = (yield this.getLatestBlockNumber()) - 1;
            }
            else {
                _blockNumber = +blockNumber;
            }
            const _block = yield this.request("starknet_getBlockByNumber", [_blockNumber]);
            let transactions = [];
            let transaction_receipts = [];
            for (const txHash of _block.transactions) {
                const tx = yield this.getTransaction(txHash);
                const receipt = yield this.getTransactionReceipt({ txHash });
                transactions.push(tx);
                transaction_receipts.push(receipt);
            }
            return Object.assign(Object.assign({}, _block), { transactions,
                transaction_receipts });
        });
    }
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.request("starknet_getTransactionByHash", [txHash]);
            transaction.transaction_hash = transaction.txn_hash;
            delete transaction.txn_hash;
            return transaction;
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