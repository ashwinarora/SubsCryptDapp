import React, { useContext, useState } from "react";
import useCurrencyToken from "../hooks/useCurrencyToken";
import { Web3Context } from "../Context/Web3Provider";
import SubsCrypt from "../abi/SubsCrypt.json";
import { toRealNumber } from "../utils/utils";
import TxButton from "../utils/TxButton";
import { CheckCircle2, ExternalLink } from "lucide-react";

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
    <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full flex flex-col items-center space-y-2 mb-8 text-center">
        <h1 className="page-title">Become a Provider</h1>
        <h2 className="page-subtitle">Register a new Service</h2>
      </div>
      <div className="card flex flex-col gap-6 p-5 sm:p-8">
        <label htmlFor="price" className="label">
          Price of Service
          <div className="relative mt-2">
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input pr-20 font-mono"
              placeholder="0.00"
            />
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-400">
              {currencyToken?.symbol}
            </span>
          </div>
        </label>
        <div>
          <label className="label">Renewal Period</label>
          <div className="flex flex-wrap gap-2 mt-2">
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
                    className={`chip ${
                      period === value
                        ? "chip-active"
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
              className="input mt-3 font-mono animate-fade-up"
            />
          )}
        </div>
        <TxButton
          styles="btn-primary w-full !py-3"
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
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 animate-pop">
            <h1 className="mb-3 flex items-center gap-2 font-display text-lg font-bold">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
              Service Create Successfully! Service ID = {newServiceId}
            </h1>
            <h1 className="text-sm font-semibold text-emerald-800">Share this with your Audience</h1>
            <h2 className="mt-2 text-sm text-emerald-800">
              Visit 
              <a
                target="_blank"
                href={`${import.meta.env.VITE_APP_DOMAIN}/services/${newServiceId}`}
                className="inline-flex items-center gap-1 break-all rounded-md bg-white/70 px-2 py-0.5 font-mono text-xs font-medium text-emerald-700 underline decoration-emerald-300 underline-offset-2 transition-colors hover:bg-white hover:text-emerald-900"
              >{` ${import.meta.env.VITE_APP_DOMAIN}/services/${newServiceId} `}<ExternalLink className="h-3 w-3" aria-hidden="true" /></a>
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
