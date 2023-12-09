import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate()

  return (
    <aside
      id="logo-sidebar"
      className="fixed z-40 top-0 left-0 w-56 h-screen pt-20 transition-transform -translate-x-full border-r sm:translate-x-0 bg-blue-800 border-blue-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-cyan-900">
        <ul className="space-y-2 font-medium">
          <li>
            <button
              className="flex w-full items-center p-2 rounded-lg text-white hover:bg-cyan-700 group"
              onClick={() => {
                navigate("/my-subscriptions")
              }}
            >
              <svg
                className="w-5 h-5 transition duration-75 text-gray-400 group-hover:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 22 21"
              >
                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
              </svg>
              <span className="ml-3">My Subscriptions</span>
            </button>
            <button
              className="flex w-full items-center p-2  rounded-lg text-white hover:bg-cyan-700 group"
              onClick={() => {
                navigate("/my-services")
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                />
              </svg>
              <span className="ml-3">My Services</span>
            </button>
            {/* <button
              className="flex w-full items-center p-2  rounded-lg text-white hover:bg-gray-700 group"
              onClick={() => {
                const VaultManager = lazy(
                  () => import("./Tabs/VaultManager/VaultManager")
                );
                addTabAndActivate("VaultManager", VaultManager);
              }}
            >
              <svg
                className="w-5 h-5  transition duration-75 text-gray-400 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                ></path>
              </svg>
              <span className="ml-3">VaultManager</span>
            </button>
            <button
              className="flex w-full items-center p-2  rounded-lg text-white hover:bg-gray-700 group"
              onClick={() => {
                const LockDealNFT = lazy(
                  () => import("./Tabs/LockDealNFT/LockDealNFT")
                );
                addTabAndActivate("LockDealNFT", LockDealNFT);
              }}
            >
              {" "}
              <span className="text-xl">💰</span>
              <span className="ml-3">LockDealNFT</span>
            </button>
            <button
              className="flex w-full items-center p-2  rounded-lg text-white hover:bg-gray-700 group"
              onClick={() => {
                const DaoSender = lazy(
                  () => import("./Tabs/DaoSender/DaoSender")
                );
                addTabAndActivate("DaoSender", DaoSender);
              }}
            >
              {" "}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
                />
              </svg>
              <span className="ml-3">DaoSender</span>
            </button> */}
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
