const Welcome = () => {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-full bg-blue-100">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">Welcome to SubsCrypt</h1>
          <h2 className="text-2xl text-blue-700 mb-8">Your one stop solution for all on chain Subscriptions</h2>
          <div className="w-2/12">
            <button className="text-white bg-blue-700 hover:bg-blue-800 font-semibold py-2 px-4 border border-blue-700 rounded w-full shadow mb-4">
                View My Subscriptions
            </button>
            <button className="text-white bg-blue-600 hover:bg-blue-700 font-semibold py-2 px-4 border border-blue-600 rounded w-full shadow">
                View My Services
            </button>
          </div>
      </div>
    )
  }
  
  export default Welcome
  