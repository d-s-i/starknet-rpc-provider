import { defaultProvider } from "starknet"

/**
 * 
 * @param properties - A array of tupple of [propertyName, expectedValue][] (e.g. [ ["type", "INVOKE_FUNCTION"], ["version", "0x1"] ])
 * @param maxBlockRange 
 * @returns 
 */
export const findTxWithProperties = async function(properties: [string, any][], maxBlockRange = 100) {
    const lastBlock = await defaultProvider.getBlock("pending");
    const start = lastBlock.block_number - 1;
    const end = lastBlock.block_number - 1 - maxBlockRange;
    console.log(`Starting at ${start}, stopping at ${end}`);
    for(let i = start; i >= end; i--) {
        const block = await defaultProvider.getBlock(i);
        for(const txHash in block.transactions) {
            const tx = block.transactions[txHash];
            let hasAllProperties = true;
            for(const [propertyName, expectedValue] of properties) {
                if(tx[propertyName] !== expectedValue) {
                    hasAllProperties = false;
                }
            }
            if(hasAllProperties) return tx;
        }
    }
}