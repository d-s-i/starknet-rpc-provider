import dotenv from "dotenv";
dotenv.config();
import assert from "assert";
import { RPCProvider } from "../src";

describe("RPCProvider", function() {
    it("Call a contract with a blockIdentifier", async function() {
        const provider = new RPCProvider(process.env.NODE_URL!, "testnet");

        const res = await provider.callContract({
            contractAddress: "0x07b2167313597992fce81632ef1dd7dfaf82e820f3102a7782ebad338ac5dfed",
            entrypoint: "get_all_s_realms_owners"
        }, { blockIdentifier: 251260 });
        console.log("res", res);
    });
    it("Call a contract without a blockIdentifier", async function() {
        const provider = new RPCProvider(process.env.NODE_URL!, "testnet");

        const res = await provider.callContract({
            contractAddress: "0x07b2167313597992fce81632ef1dd7dfaf82e820f3102a7782ebad338ac5dfed",
            entrypoint: "get_all_s_realms_owners"
        });
        console.log("res", res);
    });
});