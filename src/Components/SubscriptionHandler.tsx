import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../Context/Web3Provider";
import SubsCrypt from "../abi/SubsCrypt.json";
import BigNumber from "bignumber.js";
import useCurrencyToken from "../hooks/useCurrencyToken";
import { secondsToString, toHumanNumber } from "../utils/utils";
import TxButton from "../utils/TxButton";

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
    <div className="bg-slate-200 rounded-2xl mb-4 p-4">
      <div className="flex flex-wrap flex-row items-center justify-between mb-4 ">
        {
          Object.entries(subscriptionData).map(([key, value]) => {
            return (
              <div key={key} className="flex flex-col bg-sky-300 py-1 px-4 my-2 rounded-lg">
                <span className="text-base">{key}</span>
                <span className="text-lg text-right">
                  {getDisplayString(key, value)}
                </span>
              </div>
            )
          })
        }
      </div>
      <div className="flex flex-wrap flex-row items-center justify-start space-x-8 mb-4 ">
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
