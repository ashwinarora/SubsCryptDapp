import { useContext, useEffect, useState } from "react";
import ERC20 from "../abi/ERC20.json";
import SubsCrypt from "../abi/SubsCrypt.json";
import { Web3Context } from "../Context/Web3Provider";

const useCurrencyToken = () => {
  const { web3, activeChain } = useContext(Web3Context)
  const [tokenData, setTokenData] = useState({
    address: "",
    name: "",
    symbol: "",
    decimals: 0,
  });

  useEffect(() => {
    const fetchTokenData = async () => {
      if(!web3) return
      if(!activeChain) return
      try {
        const subscryptContract = new web3.eth.Contract(SubsCrypt.abi as any, activeChain.subscryptAddress)
        const tokenAddress = await subscryptContract.methods.CURRENCY_TOKEN().call()
        
        const tokenContract = new web3.eth.Contract(ERC20.abi as any, tokenAddress);
        const [name, symbol, decimals] = await Promise.all([
          tokenContract.methods.name().call(),
          tokenContract.methods.symbol().call(),
          tokenContract.methods.decimals().call(),
        ])

        setTokenData({
          address: tokenAddress,
          name,
          symbol,
          decimals,
        });
      } catch (error) {
        console.error("Error fetching token data", error);
      }
    };
    fetchTokenData();
  }, [activeChain]);

  return tokenData;
};

export default useCurrencyToken;
