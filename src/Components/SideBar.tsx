import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, PlusCircle, Search, Wrench } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const itemClass = (active: boolean) =>
    `group flex w-full flex-1 flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[11px] font-medium transition-all duration-200 sm:flex-none sm:flex-row sm:justify-start sm:gap-3 sm:px-3 sm:py-2.5 sm:text-sm motion-safe:active:scale-[0.98] ${
      active
        ? "bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    }`

  const iconClass = (active: boolean) =>
    `h-5 w-5 shrink-0 transition-colors duration-200 ${active ? "text-brand-300" : "text-slate-500 group-hover:text-brand-300"}`

  return (
    <aside
      id="logo-sidebar"
      className="fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-white/10 bg-ink-900/95 backdrop-blur-md transition-transform sm:top-0 sm:bottom-auto sm:right-auto sm:h-screen sm:w-60 sm:border-t-0 sm:border-r sm:pt-[4.5rem]"
      aria-label="Sidebar"
    >
      <div className="h-full overflow-y-auto px-2 sm:px-3 sm:pb-4 sm:pt-4">
        <ul className="h-full font-medium sm:h-auto sm:space-y-2">
          <li className="flex h-full items-stretch justify-around gap-1 sm:h-auto sm:flex-col sm:items-stretch sm:gap-1">
            <button
              className={itemClass(pathname === "/my-subscriptions")}
              onClick={() => {
                navigate("/my-subscriptions")
              }}
            >
              <CreditCard className={iconClass(pathname === "/my-subscriptions")} aria-hidden="true" />
              <span className="truncate">My Subscriptions</span>
            </button>
            <button
              className={itemClass(pathname === "/my-services")}
              onClick={() => {
                navigate("/my-services")
              }}
            >
              <Wrench className={iconClass(pathname === "/my-services")} aria-hidden="true" />
              <span className="truncate">My Services</span>
            </button>
            <button
              className={itemClass(pathname === "/create-service")}
              onClick={() => {
                navigate("/create-service")
              }}
            >
              <PlusCircle className={iconClass(pathname === "/create-service")} aria-hidden="true" />
              <span className="truncate">Create New Services</span>
            </button>
            <button
              className={itemClass(pathname.startsWith("/services"))}
              onClick={() => {
                navigate("/services")
              }}
            >
              <Search className={iconClass(pathname.startsWith("/services"))} aria-hidden="true" />
              <span className="truncate">Find Services</span>
            </button>
            
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
