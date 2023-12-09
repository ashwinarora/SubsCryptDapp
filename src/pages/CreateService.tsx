import React, { useContext, useState } from "react";
import useCurrencyToken from "../hooks/useCurrencyToken";
import { Web3Context } from "../Context/Web3Provider";
import SubsCrypt from "../abi/SubsCrypt.json";
import { toRealNumber } from "../utils/utils";
import TxButton from "../utils/TxButton";

// Define a type for the period options
type PeriodOption = "1_day" | "1_week" | "1_month" | "1_year" | "custom";


const CreateService: React.FC = () => {
  const [price, setPrice] = useState<string>("");
  const [period, setPeriod] = useState<PeriodOption | "">("");
  const [customPeriod, setCustomPeriod] = useState<string>("");
  const [isCustomPeriod, setIsCustomPeriod] = useState<boolean>(false);
  const { address, web3, activeChain } = useContext(Web3Context);
  const [newServiceId, setNewServiceId] = useState<string>("");

  const { currencyToken } = useCurrencyToken();

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
              placeholder="Enter custom period in Seconds"
              value={customPeriod}
              onChange={(e) => setCustomPeriod(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          )}
        </div>
        <TxButton
          asyncTask={async () => {
            if (!web3) return;
            if (!activeChain) return;
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
              const tx = await subscryptContract.methods.registerNewService(servicePrice.toFixed(), servicePeriod).send({ from: address });
              setNewServiceId(tx.events.ServiceRegistered.returnValues.serviceId)
            } catch (error) {
              console.error("Error creating service", error);
            }
          }}
        >
          Create New Service
        </TxButton>
        {
          newServiceId.length ?
          <div className="p-5 bg-emerald-300 rounded-lg opacity-80">
            <h1 className="mb-4">Service Create Successfully! Service ID = {newServiceId}</h1>
            <h1>Share this with your Audience</h1>
            <h2 className="italic text-lg mt-2">
              Visit 
              <a
                target="_blank"
                href={`${import.meta.env.VITE_APP_DOMAIN}/services/${newServiceId}`}
                className="underline"
              >{` ${import.meta.env.VITE_APP_DOMAIN}/services/${newServiceId} `}</a>
              to Subscribe!
              </h2>
          </div>
          : null
        }
      </div>
    </div>
  );
};

export default CreateService;
