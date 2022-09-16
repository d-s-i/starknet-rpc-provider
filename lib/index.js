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
const ethers_1 = require("ethers");
const hash_1 = require("starknet/utils/hash");
const constants_1 = require("starknet/dist/constants");
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
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request("starknet_chainId", []);
            return res;
        });
    }
    getEstimateFee(invocation, blockIdentifier, details) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request("starknet_estimateFee", [invocation, this._getBlockIdentifierObj(blockIdentifier), details]);
            return res;
        });
    }
    getStorageAt(contractAddress, key, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request("starknet_getStorageAt", [contractAddress, key, this._getBlockIdentifierObj(blockIdentifier)]);
        });
    }
    callContract(invokeTransaction, blockIdentifier) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // let blockHash = blockIdentifier;
            // if(
            //     !blockIdentifier || 
            //     (typeof(blockIdentifier) === "number" || blockIdentifier === "pending" || blockIdentifier === "latest")
            // ) {
            //     const latestBlockNumber = typeof(blockIdentifier) === "number" ? blockIdentifier : await this.getLatestBlockNumber();
            //     const latestBlock = await this.getBlock(latestBlockNumber);
            //     blockHash = latestBlock.block_hash;
            // }
            const _res = yield this.request("starknet_call", [{
                    contract_address: ethers_1.BigNumber.from(invokeTransaction.contractAddress).toHexString(),
                    entry_point_selector: ethers_1.BigNumber.from((0, hash_1.getSelectorFromName)(invokeTransaction.entrypoint)).toHexString(),
                    calldata: ((_a = invokeTransaction.calldata) === null || _a === void 0 ? void 0 : _a.map(value => ethers_1.BigNumber.from(value).toHexString())) || []
                }, this._getBlockIdentifierObj(blockIdentifier)]);
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
    getBlock(blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const _block = yield this.request("starknet_getBlockWithTxHashes", [this._getBlockIdentifierObj(blockIdentifier)]);
            return _block;
        });
    }
    getBlockWithTxs(blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const _block = yield this.request("starknet_getBlockWithTxs", [this._getBlockIdentifierObj(blockIdentifier)]);
            return _block;
        });
    }
    getPendingTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingTxs = yield this.request("starknet_pendingTransactions", []);
            return pendingTxs;
        });
    }
    /**
     * @notice by default querying `starknet_getTransactionByHash` and not `starknet_getTransactionByBlockIdAndIndex`
     *
     * Properties missing:
     */
    getTransaction(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const _transaction = yield this.request("starknet_getTransactionByHash", [txHash]);
            return _transaction;
        });
    }
    /**
     * @notice Get the contract class hash in the given block for the contract deployed at the given address
     *
     * @param contractAddress
     * @returns
     */
    getClassHashAt(contractAddress, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            let _blockIdentifier = this._getBlockIdentifierObj(blockIdentifier);
            return yield this.request("starknet_getClassHashAt", [_blockIdentifier, contractAddress]);
        });
    }
    /**
     * @notice Get the contract class definition in the given block at the given address
     *
     * @param contractAddress - The contract address you want to class at
     * @param blockIdentifier
     * @returns
     */
    getClassAt(contractAddress, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            let _blockIdentifier = this._getBlockIdentifierObj(blockIdentifier);
            const res = yield this.request("starknet_getClassAt", [_blockIdentifier, contractAddress]);
            return res;
        });
    }
    /**
     * @notice Get the contract class definition in the given block associated with the given hash
     * @param classHash
     * @param blockIdentifier
     * @returns
     */
    getClass(classHash, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request("starknet_getClass", [this._getBlockIdentifierObj(blockIdentifier), classHash]);
        });
    }
    getBlockTransactionCount(blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request("starknet_getBlockTransactionCount", [this._getBlockIdentifierObj(blockIdentifier)]);
        });
    }
    getStateUpdate(blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.request("starknet_getStateUpdate", [this._getBlockIdentifierObj(blockIdentifier)]);
        });
    }
    getTransactionTrace(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("RPCProvider::getTransactionTrace - Function not implemented yet");
        });
    }
    getCode(contractAddress, blockIdentifier) {
        return __awaiter(this, void 0, void 0, function* () {
            const { bytecode, abi: _abi } = yield this.request("starknet_getCode", [contractAddress]);
            return { bytecode, abi: JSON.parse(_abi) };
        });
    }
    // TODO check response
    deployContract(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request("starknet_addDeployTransaction", [payload]);
            return res;
        });
    }
    invokeFunction(invocation) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request("starknet_addInvokeTransaction", [invocation]);
            return res;
        });
    }
    waitForTransaction(txHash, retryInterval) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("RPCProvider::waitForTransaction - Function not implemented yet");
        });
    }
    declareContract(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request("starknet_addDeclareTransaction", [payload]);
            return res;
        });
    }
    _getBlockIdentifierObj(blockIdentifier) {
        if (!blockIdentifier)
            return "latest";
        if (blockIdentifier === "pending" || blockIdentifier === "latest")
            return blockIdentifier;
        return typeof (blockIdentifier) === "string" ? { block_hash: blockIdentifier } : { block_number: blockIdentifier };
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