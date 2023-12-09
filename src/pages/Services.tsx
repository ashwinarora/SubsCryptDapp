import BigNumber from "bignumber.js";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Web3Context } from "../Context/Web3Provider";
import SubsCrypt from "../abi/SubsCrypt.json";
import useCurrencyToken from "../hooks/useCurrencyToken";
import { secondsToString, toHumanNumber } from "../utils/utils";
import TxButton from "../utils/TxButton";

interface IService {
  provider: string,
  price: BigNumber,
  renewalPeriod: string,
  isActive: boolean,
  numberOfSubscribers: string,
}

interface ISubData {
  subId: string,
  nextRenewal: string,
  isActive: boolean,
}

const FindService: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { serviceId } = useParams<{ serviceId?: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<IService>();
  const [isUserSubscribed, setIsUserSubscribed] = useState<boolean>(false);
  const [subscriptionData, setSubscriptionData] = useState<ISubData>();
  const { address, web3, activeChain } = useContext(Web3Context);
  const { currencyToken, refetchToken, approveSubsCrypt} = useCurrencyToken();

  useEffect(() => {
    console.log(serviceId)
    if (serviceId) {
      if(isNaN(Number(serviceId))) {
        navigate("/services");
        return;
      }
      setSearchTerm(serviceId);
      if(!service?.provider) {
        fetchService();
      }
    }
  }, [serviceId]);

  const fetchService = async () => {
    if (!web3) return;
    if (!activeChain) return;
    try {
      const subscryptContract = new web3.eth.Contract(SubsCrypt.abi as any,activeChain.subscryptAddress);
      const [data, numberOfSubscribers, isSubscribed] = await Promise.all([
        subscryptContract.methods.AllServices(serviceId).call(),
        subscryptContract.methods.getTotalSubscribersOf(serviceId).call(),
        subscryptContract.methods.isSubscribedTo(serviceId, address).call(),
      ]);
      if(isSubscribed && data.isActive) {
        const subData = await subscryptContract.methods.getSubscription(address, serviceId).call()
        setSubscriptionData({
          subId: subData.subId,
          nextRenewal: subData.nextRenewal,
          isActive: subData.isActive,
        })
      }
      setService({
        provider: data.provider,
        price: new BigNumber(data.price),
        renewalPeriod: data.renewalPeriod,
        isActive: data.isActive,
        numberOfSubscribers,
      })
      setIsUserSubscribed(isSubscribed);
    } catch (error) {
      console.log(error)
    }
  }

  const buildButton = () => {
    if(!service) return;
    if(!web3) return;
    if(!activeChain) return;
    if(!address) return;
    if(!currencyToken) return;

    if(isUserSubscribed && subscriptionData?.isActive){
      return (
        <TxButton
          styles="redButton"
          asyncTask={async () => {
            if (!web3) return;
            if (!activeChain) return;
            try {
              const subscryptContract = new web3.eth.Contract(SubsCrypt.abi as any,activeChain.subscryptAddress);
              await subscryptContract.methods.deactivateSubscription(subscriptionData.subId).send({ from: address });
              await fetchService();
            } catch (error) {
              console.error("Error creating service", error);
            }
          }}
        >
          Unubscribe
        </TxButton>
      )
    } else {
      if(service.price.isGreaterThan(currencyToken.allowance)) {
        return (
          <TxButton
            asyncTask={async () => {
              if (!web3) return;
              if (!activeChain) return;
              try {
                await approveSubsCrypt();
              } catch (error) {
                console.error("Error creating service", error);
              }
            }}
          >
            Approve {currencyToken.symbol}
          </TxButton>
        )
      }
      return (
        <TxButton
          asyncTask={async () => {
            if (!web3) return;
            if (!activeChain) return;
            try {
              const subscryptContract = new web3.eth.Contract(SubsCrypt.abi as any,activeChain.subscryptAddress);
              await subscryptContract.methods.subscribeTo(serviceId).send({ from: address });
              await fetchService()
              await refetchToken()
            } catch (error) {
              console.error("Error creating service", error);
            }
          }}
        >
          Subscribe
        </TxButton>
      )
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mx-auto w-full flex flex-col items-center space-y-2 mb-8">
        <h1 className="text-5xl">Find a Service</h1>
      </div>
      <div className="flex gap-2">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            if(isNaN(Number(value))) return;
            setSearchTerm(value);
            navigate(`/services/${value}`);
          }}
          placeholder="Search Service ID..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={fetchService}
        >
          Search
        </button>
      </div>
      {
        service?.provider && <>
          <div className="flex justify-between items-center p-4 bg-white shadow-lg rounded-lg my-2">
            <div>
              <h3 className="text-lg font-bold">{service.provider}</h3>
              <p className="text-gray-600">Renewed Every {secondsToString(Number(service.renewalPeriod))}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{toHumanNumber(service.price, currencyToken.decimals)} {currencyToken.symbol}</p>
              <p className="text-sm text-gray-500">{service.numberOfSubscribers} subscribers</p>
            </div>
            <div>
              <span
                className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded-full ${
                  service.isActive ? 'bg-green-400' : 'bg-red-400'
                }`}
              >
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            {buildButton()}
          </div>
        
        </>
      }
    </div>
  );
};

export default FindService;