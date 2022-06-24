import dotenv from "dotenv";
dotenv.config();
import { RPCProvider } from "../src";

const test = async function() {
    const provider = new RPCProvider(process.env.NODE_URL!, "testnet");

    const res = await provider.callContract({
        contractAddress: "0x041328d6d36a71d2c63d8dbea207799c3ec24faa394f2a9faf18a6102e9c3903",
        entrypoint: "get_all_s_realms_owners_arr"
    }, { blockIdentifier: "0xb3d577409d6f73bfd0eddc73765ef75ec605fdcd98fac75781348d68423bce" });
    console.log("res", res);
}
test();