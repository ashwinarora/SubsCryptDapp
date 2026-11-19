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
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full flex flex-col items-center space-y-2 mb-8 text-center">
        <h1 className="page-title">My Subscriptions</h1>
        <p className="page-subtitle">Everything you're subscribed to, and when it renews next.</p>
      </div>
      <div className="stack-empty space-y-4" data-empty="No subscriptions to show yet. Find a service to subscribe to.">
      {
        mySubscriptionIds.map((subscriptionId) => {
          return (
            <SubscriptionHandler key={subscriptionId} subscriptionId={subscriptionId} />
          )
        })
      }
      </div>
    </div>
  )
}

export default MySubscriptions
