import IChainConfig from "./IChainConfig";
import BscTestnetConfig from "./BscTestnetConfig";
import ArbitrumSepolia from "./ArbitrumSepolia";

interface IChainConfigMap {
    [chainId: number]: IChainConfig;
}

const allChains: IChainConfigMap = {
    [BscTestnetConfig.chainId]: BscTestnetConfig,
    [ArbitrumSepolia.chainId]: ArbitrumSepolia,
}

export default allChains;