import { useContext, useEffect, useState } from "react"
import { Web3Context } from "../Context/Web3Provider";
import SubsCrypt from "../abi/SubsCrypt.json";
import SubscriptionHandler from "../Components/SubscriptionHandler";


const MySubscriptions = () => {
  const [mySubscriptionIds, setMySubscriptionIds] = useState<string[]>([])
  const { address, web3, chainId, activeChain } = useContext(Web3Context);

  useEffect(() => {
    const getMySubscriptionIds = async () => {
      if(!address || !web3 || !chainId || !activeChain) return
      const subsCryptContract = new web3.eth.Contract(SubsCrypt.abi as any, activeChain.subscryptAddress)
      const mySubscriptionIds = await subsCryptContract.methods.getAllMySubscriptionIds(address).call()
      console.log(mySubscriptionIds)
      setMySubscriptionIds(mySubscriptionIds)
    }
    getMySubscriptionIds()
  }, [chainId, address, activeChain])

  return (
    <div className="container mx-auto p-4">
      <div className="mx-auto w-full flex flex-col items-center space-y-2 mb-8">
        <h1 className="text-5xl">My Subscriptions</h1>
      </div>
      {
        mySubscriptionIds.map((subscriptionId) => {
          return (
            <SubscriptionHandler key={subscriptionId} subscriptionId={subscriptionId} />
          )
        })
      }
    </div>
  )
}

export default MySubscriptions