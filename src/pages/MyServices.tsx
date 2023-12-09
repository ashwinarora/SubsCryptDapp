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
    <div className="container mx-auto p-4">
      <div className="mx-auto w-full flex flex-col items-center space-y-2 mb-8">
        <h1 className="text-5xl">My Services</h1>
      </div>
      {
        myServiceIds.map((serviceId) => {
          return (
            <ServiceHandler key={serviceId} serviceId={serviceId} />
          )
        })
      }
    </div>
  )
}

export default MyServices