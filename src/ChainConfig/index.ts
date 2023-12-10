import IChainConfig from "./IChainConfig";
import BscTestnetConfig from "./BscTestnetConfig";
import ArbitrumSepolia from "./ArbitrumSepolia";
import CelloTestnet from "./CelloTestnet";
import ScrollSepolia from "./ScrollSepolia";
import MantleTestnet from "./MantleTestnet";

interface IChainConfigMap {
    [chainId: number]: IChainConfig;
}

const allChains: IChainConfigMap = {
    [BscTestnetConfig.chainId]: BscTestnetConfig,
    [ArbitrumSepolia.chainId]: ArbitrumSepolia,
    [CelloTestnet.chainId]: CelloTestnet,
    [ScrollSepolia.chainId]: ScrollSepolia,
    [MantleTestnet.chainId]: MantleTestnet,

}

export default allChains;