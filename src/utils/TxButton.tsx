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
          if(!!success) setStatus("success")
          if(!success) setStatus("error")
        } catch (error) {
          setStatus("error");
        }
      }}
    >
      <div className="mx-auto">{children}</div>
      {status === 'loading' && <div aria-hidden="true" className="h-4 w-4 shrink-0 rounded-full border-2 border-current border-t-transparent opacity-80 motion-safe:animate-spin"></div>}
      {status === 'success' && 
        <svg fill="none" stroke="currentColor" className="h-5 w-5 shrink-0 animate-pop" strokeWidth={2.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      }
    </button>
  );
};

export default TxButton;
