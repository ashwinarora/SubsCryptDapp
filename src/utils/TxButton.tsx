import { useState } from "react";

type TButtonStatus = "loading" | "ready" | "success" | "error";

interface ITxButtonProps {
  asyncTask: () => Promise<void | boolean>;
  children: string | string[];
  isDisabled?: boolean;
  styles?: string;
}

const TxButton = ({isDisabled, asyncTask, children, styles="greenButton"}: ITxButtonProps) => {
  const [status, setStatus] = useState<TButtonStatus>("ready");

  const isButtonDisabled = () => {
    if(isDisabled) return true
    if(status === "loading") return true
    if(status === "success") return true
    return false
  }

  return (
    <button
      disabled={isButtonDisabled()}
      className={`${styles}`}
      onClick={async () => {
        setStatus("loading");
        try {
          const success = await asyncTask()
          debugger
          if(!!success) setStatus("success")
          if(!success) setStatus("error")
        } catch (error) {
          setStatus("error");
        }
      }}
    >
      <div className="mx-auto">{children}</div>
      {status === 'loading' && <div className="mr-3 border-4 border-blue-300 rounded-full w-7 h-7 border-t-white animate-spin"></div>}
      {status === 'success' && 
        <svg fill="none" stroke="currentColor" className="w-7 h-7 mr-4 text-green-100 font-extrabold" strokeWidth={1.5} viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      }
    </button>
  );
};

export default TxButton;
