import { BigNumber } from "ethers";
import { Hex } from "web3-utils";
import { TokenInfo } from "../token/token.interface";

export interface ChainNetwork {
    chainId: number | BigNumber | Hex,
    chainName: string;
    nativeCurrency: TokenInfo;
    rpcUrls: string[];
    blockExplorerUrls?: string[];
    name?: string;
    balance?: string | number;
}

export interface MetamaskNetwork {
    name: string;
    chainId: number;
    balance: string | number;
    nativeCurrency: TokenInfo;
    tokens?: TokenInfo[];
}