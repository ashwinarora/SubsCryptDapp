import React, { useContext, useState } from "react";
import useCurrencyToken from "../hooks/useCurrencyToken";
import { Web3Context } from "../Context/Web3Provider";
import SubsCrypt from "../abi/SubsCrypt.json";
import { toRealNumber } from "../utils/utils";

// Define a type for the period options
type PeriodOption = "1_day" | "1_week" | "1_month" | "1_year" | "custom";

type EButtonStatus = "ready" | "loading" | "success" | "error";

const CreateService: React.FC = () => {
  const [price, setPrice] = useState<string>("");
  const [period, setPeriod] = useState<PeriodOption | "">("");
  const [customPeriod, setCustomPeriod] = useState<string>("");
  const [isCustomPeriod, setIsCustomPeriod] = useState<boolean>(false);
  const { address, web3, activeChain } = useContext(Web3Context);
  const [buttonStatus, setButtonStatus] = useState<EButtonStatus>("ready");

  const currencyToken = useCurrencyToken();

  const handlePeriodClick = (value: PeriodOption) => {
    setPeriod(value);
    setIsCustomPeriod(value === "custom");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mx-auto w-full flex flex-col items-center space-y-2">
        <h1 className="text-5xl">Become a Provider</h1>
        <h2 className="text-3xl">Register a new Service</h2>
      </div>
      <div className="flex flex-col gap-4">
        <label htmlFor="price" className="text-lg font-semibold">
          Price of Service
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </label>
        <div>
          <label className="text-lg font-semibold">Renewal Period</label>
          <div className="flex gap-2 mt-1">
            {(["1 Day", "1 Week", "1 Month", "1 Year", "Custom"] as const).map(
              (p) => {
                const value: PeriodOption = p
                  .toLowerCase()
                  .replace(" ", "_") as PeriodOption;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePeriodClick(value)}
                    className={`px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md focus:outline-none ${
                      period === value
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }`}
                  >
                    {p}
                  </button>
                );
              }
            )}
          </div>
          {isCustomPeriod && (
            <input
              type="text"
              placeholder="Enter custom period"
              value={customPeriod}
              onChange={(e) => setCustomPeriod(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          )}
        </div>

        <button
          className={`flex mt-4 px-6 py-2 bg-green-500 text-white font-semibold
          rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 
          focus:ring-green-500 focus:ring-opacity-50`}
          onClick={async () => {
            if (!web3) return;
            if (!activeChain) return;
            setButtonStatus('loading');
            try {
              const subscryptContract = new web3.eth.Contract(SubsCrypt.abi as any,activeChain.subscryptAddress);
              const servicePrice = toRealNumber(price, currencyToken.decimals);
              let servicePeriod: number;
              switch (period) {
                case "1_day":
                  servicePeriod = 24 * 60 * 60;
                  break;
                case "1_week":
                  servicePeriod = 7 * 24 * 60 * 60;
                  break;
                case "1_month":
                  servicePeriod = 30 * 24 * 60 * 60;
                  break;
                case "1_year":
                  servicePeriod = 365 * 24 * 60 * 60;
                  break;
                case "custom":
                  servicePeriod = Number(customPeriod);
                  break;
                default:
                  servicePeriod = 0;
              }
              await subscryptContract.methods.registerNewService(servicePrice.toFixed(), servicePeriod).send({ from: address });
              setButtonStatus('success');
            } catch (error) {
              console.error("Error creating service", error);
            }
          }}
        >
          <span className="mx-auto">Create Service</span>
          {buttonStatus === 'loading' && <div className="mr-3 border-4 border-blue-300 rounded-full w-7 h-7 border-t-white animate-spin"></div>}
          {buttonStatus === 'success' && 
            <svg fill="none" stroke="currentColor" className="w-7 h-7 mr-4 text-green-100 font-extrabold" strokeWidth={1.5} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          }
        </button>
      </div>
    </div>
  );
};

export default CreateService;
