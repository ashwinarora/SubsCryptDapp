import React, { useContext, useEffect } from "react";
import { Web3Context } from "../Context/Web3Provider";

const Navbar: React.FC = () => {
  const {
    address,
    connectWallet,
    web3,
    chainId,
    supportedChains,
    switchChain,
  } = useContext(Web3Context);

  useEffect(() => {
    if (!web3) return;
    connectWallet();
  }, [web3]);

  useEffect(() => {
    if (!web3) return;
    if (!address) return;
  }, [chainId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(address);
  };

  const truncateAddress = (address: string) =>
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;

  return (
    <div className="fixed top-0 left-0 right-0 bg-sky-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-4xl font-semibold">SubsCrypt</div>
        <div className="flex items-center">
          {!!chainId && !supportedChains.includes(chainId) && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-4 rounded"
              onClick={() => switchChain((97).toString(16))}
            >
              Switch To BSC
            </button>
          )}
          {address ? (
            <div className="relative flex flex-row">
              <div className="flex flex-row border border-blue-300  rounded-lg mr-2">
                <span className="relative flex h-3 w-3 my-auto mx-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
                <span className="h-full py-2 pr-2 rounded-md">Chain {chainId}</span>
              </div>
              <input
                type="text"
                className="px-4 py-2 w-36 border rounded text-gray-700"
                readOnly
                value={truncateAddress(address)}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-700"
                onClick={copyToClipboard}
              >
                📋
              </button>
            </div>
          ) : (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={connectWallet}
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
