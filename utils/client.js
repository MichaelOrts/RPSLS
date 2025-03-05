import { createPublicClient, http } from "viem";
import { hardhat, sepolia } from "viem/chains";
const RPC = process.env.NEXT_PUBLIC_ALCHEMY_RPC || "";

export const publicClientHardhat = createPublicClient({
    chain: hardhat,
    transport: http()
})

export const publicClientSepolia = createPublicClient({
    chain: sepolia,
    transport: http(RPC),
})