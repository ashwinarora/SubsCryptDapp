import { useContext, useEffect, useState } from "react"
import { Web3Context } from "../Context/Web3Provider";
import SubsCrypt from "../abi/SubsCrypt.json";
import ServiceHandler from "../Components/ServiceHandler";


const MyServices = () => {
  const [myServiceIds, setMyServiceIds] = useState<string[]>([])
  const { address, web3, chainId, activeChain } = useContext(Web3Context);

  useEffect(() => {
    const getMyServiceIds = async () => {
      if(!address || !web3 || !chainId || !activeChain) return
      const subsCryptContract = new web3.eth.Contract(SubsCrypt.abi as any, activeChain.subscryptAddress)
      const myServiceIds = await subsCryptContract.methods.getAllMyServiceIds(address).call()
      console.log(myServiceIds)
      setMyServiceIds(myServiceIds)
    }
    getMyServiceIds()
  }, [chainId, address, activeChain])

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full flex flex-col items-center space-y-2 mb-8 text-center">
        <h1 className="page-title">My Services</h1>
        <p className="page-subtitle">Services you provide, their subscribers, and funds ready to withdraw.</p>
      </div>
      <div className="stack-empty space-y-4" data-empty="No services to show yet. Register a new service to get started.">
      {
        myServiceIds.map((serviceId) => {
          return (
            <ServiceHandler key={serviceId} serviceId={serviceId} />
          )
        })
      }
      </div>
    </div>
  )
}

export default MyServices
