import React, { useContext, useEffect } from "react";
import { Web3Context } from "../Context/Web3Provider";
import { Link } from "react-router-dom";
import { Copy, Layers, Wallet } from "lucide-react";

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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-ink-900/90 text-white shadow-[0_1px_0_rgba(255,255,255,0.04),0_10px_30px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md">
      <div className="flex h-[4.5rem] items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-3 rounded-xl">
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white shadow-glow transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105"
          >
            <Layers className="h-5 w-5" strokeWidth={2.25} />
          </span>
          <div className="font-display text-2xl font-extrabold tracking-tight">SubsCrypt</div>
        </Link>
        <div className="flex items-center">
          {/* {!!chainId && !supportedChains.includes(chainId) && (
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mr-4 rounded"
              onClick={() => switchChain((97).toString(16))}
            >
              Switch To BSC
            </button>
          )} */}
          {address ? (
            <div className="relative flex flex-row items-center">
              {/* <div className="flex flex-row border border-blue-300  rounded-lg mr-2">
                <span className="relative flex h-3 w-3 my-auto mx-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
                <span className="h-full py-2 pr-2 rounded-md">Chain {chainId}</span>
              </div> */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-400 ring-4 ring-emerald-400/20"
              />
              <input
                type="text"
                className="w-[11.5rem] rounded-xl border border-white/10 bg-white/5 py-2 pl-7 pr-10 font-mono text-sm text-slate-100 shadow-inner outline-none transition-colors hover:border-white/20 focus:border-brand-400"
                readOnly
                value={truncateAddress(address)}
              />
              <button
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-300 transition-colors duration-200 hover:bg-white/10 hover:text-white motion-safe:active:scale-90"
                onClick={copyToClipboard}
                aria-label="Copy address"
                title="Copy address"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              className="btn-primary"
              onClick={connectWallet}
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
