import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../Context/Web3Provider";
import SubsCrypt from "../abi/SubsCrypt.json";
import BigNumber from "bignumber.js";
import useCurrencyToken from "../hooks/useCurrencyToken";
import { secondsToString, toHumanNumber } from "../utils/utils";
import TxButton from "../utils/TxButton";

// Presentational labels for the raw data keys shown in each stat tile
const LABELS: Record<string, string> = {
  serviceId: "Service ID",
  price: "Price",
  renewalPeriod: "Renewal period",
  isActive: "Status",
  numberOfSubscribers: "Subscribers",
  numberOfActiveSubscribers: "Active subscribers",
  collectableFunds: "Collectable funds",
};

const ServiceHandler = ({ serviceId }: { serviceId: string }) => {
  const { address, web3, chainId, activeChain } = useContext(Web3Context);
  const { currencyToken } = useCurrencyToken();

  const [serviceData, setServiceData] = useState({
    serviceId: "",
    provider: "",
    price: new BigNumber(0),
    renewalPeriod: "",
    isActive: false,
    numberOfSubscribers: "",
    numberOfActiveSubscribers: "",
    collectableFunds: new BigNumber(0)
  });

  useEffect(() => {
    getServiceData()
  }, [serviceId])

  const getServiceData = async () => {
    if (!address || !web3 || !chainId || !activeChain) return;
    const subsCryptContract = new web3.eth.Contract(SubsCrypt.abi as any,activeChain.subscryptAddress);
    const [data, totalSubs, activeSubs, funds] = await Promise.all([
      subsCryptContract.methods.AllServices(serviceId).call(),
      subsCryptContract.methods.getTotalSubscribersOf(serviceId).call(),
      subsCryptContract.methods.getActiveSubscriberCount(serviceId).call(),
      subsCryptContract.methods.getCollectableFundsOf(serviceId).call(),        
    ]);
    setServiceData({
      serviceId,
      provider: data.provider,
      price: data.price,
      renewalPeriod: data.renewalPeriod,
      isActive: data.isActive,
      numberOfSubscribers: totalSubs,
      numberOfActiveSubscribers: activeSubs,
      collectableFunds: new BigNumber(funds)
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
      case "numberOfSubscribers":
        return value
      case "numberOfActiveSubscribers":
        return value
      case "collectableFunds":
        return `${toHumanNumber(value, currencyToken.decimals)} ${currencyToken?.symbol}`
      default:
        return value
    }
  }

  return(
    <div className="card card-hover mb-4 overflow-hidden animate-fade-up">
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 sm:p-5 lg:grid-cols-4">
        {
          Object.entries(serviceData).map(([key, value]) => {
            if(key === "provider") return
            return (
              <div key={key} className="stat">
                <span className="stat-label">{LABELS[key] ?? key}</span>
                <span className={key === "isActive" ? (value ? "badge-success self-start" : "badge-muted self-start") : "stat-value"} title={String(getDisplayString(key, value))}>
                  {key === "isActive" && <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${value ? "bg-emerald-500" : "bg-slate-400"}`} />}
                  {getDisplayString(key, value)}
                </span>
              </div>
            )
          })
        }
      </div>
      <div className="flex flex-wrap flex-row items-center justify-start gap-3 border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:px-5">
        {
          serviceData.isActive ? <TxButton
            styles={"redButton"}
            asyncTask={async () => {
              if (!address || !web3 || !chainId || !activeChain) return;
              const subsCryptContract = new web3.eth.Contract(SubsCrypt.abi as any,activeChain.subscryptAddress);
              const tx = await subsCryptContract.methods.deactivateService(serviceId).send({ from: address });
              await getServiceData()
              return tx;
            }}
          >
            Deactivate Service
          </TxButton>
          : null
        }
        <TxButton
          styles="greenButton"
          asyncTask={async () => {
            if (!address || !web3 || !chainId || !activeChain) return;
            const subsCryptContract = new web3.eth.Contract(SubsCrypt.abi as any,activeChain.subscryptAddress);
            const tx = await subsCryptContract.methods.collectFundsFromMyService(serviceId).send({ from: address });
            await getServiceData()
            return tx;
          }}
        >
          Withdraw Collectable Funds ({toHumanNumber(serviceData.collectableFunds, currencyToken.decimals)} {currencyToken?.symbol})
        </TxButton>
      </div>
    </div>
  );
};

export default ServiceHandler;
