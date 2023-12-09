import { useContext, useEffect, useState } from "react";
import ERC20 from "../abi/ERC20.json";
import SubsCrypt from "../abi/SubsCrypt.json";
import { Web3Context } from "../Context/Web3Provider";
import BigNumber from "bignumber.js";
import { UINT_MINUS_ONE } from "../utils/utils";


const useCurrencyToken = () => {
  const { address, web3, activeChain } = useContext(Web3Context)
  const [tokenData, setTokenData] = useState({
    address: "",
    name: "",
    symbol: "",
    allowance: new BigNumber(0),
    balance: new BigNumber(0),
    decimals: 0,
  });

  const fetchTokenData = async () => {
    if(!web3) return
    if(!activeChain) return
    try {
      const subscryptContract = new web3.eth.Contract(SubsCrypt.abi as any, activeChain.subscryptAddress)
      const tokenAddress = await subscryptContract.methods.CURRENCY_TOKEN().call()
      
      const tokenContract = new web3.eth.Contract(ERC20.abi as any, tokenAddress);
      const [name, symbol, decimals, allow, bal] = await Promise.all([
        tokenContract.methods.name().call(),
        tokenContract.methods.symbol().call(),
        tokenContract.methods.decimals().call(),
        tokenContract.methods.allowance(address, activeChain.subscryptAddress).call(),
        tokenContract.methods.balanceOf(address).call()
      ])

      setTokenData({
        address: tokenAddress,
        name,
        symbol,
        decimals,
        allowance: new BigNumber(allow),
        balance: new BigNumber(bal),
      });
    } catch (error) {
      console.error("Error fetching token data", error);
    }
  };

  const approveSubsCrypt = async () => {
    if(!web3) return
    if(!activeChain) return
    if(!tokenData.address) return

    try {
      const tokenContract = new web3.eth.Contract(ERC20.abi as any, tokenData.address);
      await tokenContract.methods.approve(activeChain.subscryptAddress, UINT_MINUS_ONE).send({ from: address });
      const newAllowance = await tokenContract.methods.allowance(address, activeChain.subscryptAddress).call();
      setTokenData((prev) => ({ ...prev, allowance: new BigNumber(newAllowance) }));
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTokenData();
  }, [activeChain]);

  return {
    currencyToken: tokenData,
    refetchToken: fetchTokenData,
    approveSubsCrypt: approveSubsCrypt
  };
};

export default useCurrencyToken;
