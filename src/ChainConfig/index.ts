import IChainConfig from "./IChainConfig";
import BscTestnetConfig from "./BscTestnetConfig";

interface IChainConfigMap {
    [chainId: number]: IChainConfig;
}

const allChains: IChainConfigMap = {
    [BscTestnetConfig.chainId]: BscTestnetConfig,
}

export default allChains;