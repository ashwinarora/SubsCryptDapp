import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../Context/Web3Provider";
import SubsCrypt from "../abi/SubsCrypt.json";
import BigNumber from "bignumber.js";
import useCurrencyToken from "../hooks/useCurrencyToken";
import { secondsToString, toHumanNumber } from "../utils/utils";
import TxButton from "../utils/TxButton";

// Presentational labels for the raw data keys shown in each stat tile
const LABELS: Record<string, string> = {
  subscriptionId: "Subscription ID",
  serviceId: "Service ID",
  provider: "Provider",
  price: "Price",
  renewalPeriod: "Renewal period",
  nextRenewal: "Next renewal in",
  isActive: "Status",
};

const SubscriptionHandler = ({ subscriptionId }: { subscriptionId: string }) => {
  const { address, web3, chainId, activeChain } = useContext(Web3Context);
  const { currencyToken } = useCurrencyToken();

  const [subscriptionData, setSubscriptionData] = useState({
    subscriptionId: "",
    serviceId: "",
    provider: "",
    price: new BigNumber(0),
    renewalPeriod: "",
    nextRenewal: "",
    isActive: false,
  });

  useEffect(() => {
    getSubscriptionData()
  }, [subscriptionId])

  const getSubscriptionData = async () => {
    if (!address || !web3 || !chainId || !activeChain) return;
    const subsCryptContract = new web3.eth.Contract(SubsCrypt.abi as any,activeChain.subscryptAddress);
    const subdata = await subsCryptContract.methods.AllSubscriptions(subscriptionId).call()
    const serviceData = await subsCryptContract.methods.AllServices(subdata.serviceId).call()
    setSubscriptionData({
        subscriptionId,
        serviceId: subdata.serviceId,
        provider: serviceData.provider,
        price: serviceData.price,
        renewalPeriod: serviceData.renewalPeriod,
        nextRenewal: subdata.nextRenewal,
        isActive: subdata.isActive,
    })
  }

  const getDisplayString = (key: string, value: any) => {
    switch(key) {
      case "price":
        return `${toHumanNumber(new BigNumber(value), currencyToken.decimals)} ${currencyToken?.symbol}`
      case "renewalPeriod":
        return secondsToString(Number(value))
      case "isActive":
        return value ? "Active" : "Inactive"
      case "nextRenewal":
        const difference = Number(value) - Math.floor(Date.now() / 1000)
        return secondsToString(difference)
      default:
        return value
    }
  }

  return(
    <div className="card card-hover mb-4 overflow-hidden animate-fade-up">
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5 lg:grid-cols-4">
        {
          Object.entries(subscriptionData).map(([key, value]) => {
            return (
              <div key={key} className={key === "provider" ? "stat col-span-2" : "stat"}>
                <span className="stat-label">{LABELS[key] ?? key}</span>
                <span
                  className={
                    key === "isActive"
                      ? (value ? "badge-success self-start" : "badge-muted self-start")
                      : key === "provider"
                        ? "stat-value !font-mono !text-sm !font-medium"
                        : "stat-value"
                  }
                  title={String(getDisplayString(key, value))}
                >
                  {key === "isActive" && <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${value ? "bg-emerald-500" : "bg-slate-400"}`} />}
                  {getDisplayString(key, value)}
                </span>
              </div>
            )
          })
        }
      </div>
      <div className="flex flex-wrap flex-row items-center justify-start gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5">
        <TxButton
            styles={subscriptionData.isActive ? "redButton" : "greenButton"}
            asyncTask={async () => {
                if (!address || !web3 || !chainId || !activeChain) return;
                const subsCryptContract = new web3.eth.Contract(SubsCrypt.abi as any,activeChain.subscryptAddress);
                let tx
                if(subscriptionData.isActive) {
                    tx = await subsCryptContract.methods.deactivateSubscription(subscriptionId).send({ from: address });
                } else {
                    tx = await subsCryptContract.methods.activateSubscription(subscriptionId).send({ from: address });
                }
                await getSubscriptionData()
                return tx;
            }}
        >
            {subscriptionData.isActive ? "Deactivate Subscription" : "Activate Subscription"}
        </TxButton>
      </div>
    </div>
  );
};

export default SubscriptionHandler;
