import BigNumber from "bignumber.js";
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Web3Context } from "../Context/Web3Provider";
import SubsCrypt from "../abi/SubsCrypt.json";
import useCurrencyToken from "../hooks/useCurrencyToken";
import { secondsToString, toHumanNumber } from "../utils/utils";
import TxButton from "../utils/TxButton";
import { Search, Users } from "lucide-react";

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
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full flex flex-col items-center space-y-2 mb-8 text-center">
        <h1 className="page-title">Find a Service</h1>
        <p className="page-subtitle">Look up a service by its ID to view details and subscribe.</p>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
            className="input pl-11 font-mono"
          />
        </div>
        <button
          className="btn-primary shrink-0"
          onClick={fetchService}
        >
          Search
        </button>
      </div>
      {
        service?.provider && <>
          <div className="card card-hover my-6 flex flex-col gap-5 p-5 animate-pop sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-6">
            <div className="min-w-0 flex-1">
              <span className="stat-label">Provider</span>
              <h3 className="mt-1 break-all font-mono text-sm font-semibold text-ink-900 sm:text-base">{service.provider}</h3>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-slate-500"><Users className="h-4 w-4" aria-hidden="true" />{service.numberOfSubscribers} subscribers</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-display text-2xl font-extrabold text-ink-900">{toHumanNumber(service.price, currencyToken.decimals)} <span className="text-base font-semibold text-slate-500">{currencyToken.symbol}</span></p>
              <p className="text-sm text-slate-500">Renewed Every {secondsToString(Number(service.renewalPeriod))}</p>
              
            </div>
            <div>
              <span
                className={`${
                  service.isActive ? 'badge-success' : 'badge-danger'
                }`}
              >
                <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${service.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
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
