import { useState, useEffect, createContext } from "react";
import Web3 from "web3";

const supportedChains = [97]

interface IWeb3Context {
  address: string;
  chainId: number;
  web3?: Web3;
  connectWallet: () => void;
  supportedChains: number[];
  switchChain: (chainIdHex: string) => void;
}

export const Web3Context = createContext<IWeb3Context>({
  address: "",
  chainId: 0,
  connectWallet: () => {},
  supportedChains: supportedChains,
  switchChain: () => {},
});

const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string>("");
  const [chainId, setChainId] = useState<number>(0);
  const [web3, setWeb3] = useState<Web3>();
  const [currentProvider, setCurrentProvider] = useState<any>();

  useEffect(() => {
    setCurrentProvider(Web3.givenProvider);
    setWeb3(new Web3(Web3.givenProvider));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if(!currentProvider) return;
    currentProvider.on("accountsChanged", (accounts: string[]) => {
      setAddress(accounts[0]);
    });
    currentProvider.on("chainChanged", (chainId: string) => {
      setChainId(parseInt(chainId, 16));
    });
    return () => {
      currentProvider.removeListener("accountsChanged");
      currentProvider.removeListener("chainChanged");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProvider]);

  const connectWallet = async () => {
    console.log(currentProvider)
    if (currentProvider) {
      const accounts = await currentProvider.request({
        method: "eth_requestAccounts",
      });
      const chainId = await currentProvider.request({
        method: "eth_chainId",
      });
      setAddress(accounts[0]);
      // setAddress(""); // for testing
      setChainId(parseInt(chainId, 16));
    }
  };

  const switchChain = async (chainIdHex: string) => {
    if (!currentProvider) return;
    await currentProvider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  }

  return (
    <Web3Context.Provider value={{ address, chainId, connectWallet, web3, supportedChains, switchChain }}>
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
