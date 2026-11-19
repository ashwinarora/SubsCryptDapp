import { ShieldCheck, Sparkles, Zap } from "lucide-react";

const Welcome = () => {
    return (
      <div className="relative flex min-h-[calc(100vh-4.5rem)] w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
          {/* decorative background */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand-400/20 blur-3xl motion-safe:animate-float" />
            <div className="absolute bottom-0 right-[-6rem] h-72 w-72 rounded-full bg-emerald-300/20 blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          </div>

          <span className="badge-brand mb-6 animate-fade-up">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Recurring payments, fully on-chain
          </span>
          <h1 className="page-title max-w-3xl !text-4xl sm:!text-6xl animate-fade-up [animation-delay:60ms] mb-4">
            Welcome to <span className="gradient-text">SubsCrypt</span>
          </h1>
          <h2 className="max-w-xl text-lg text-slate-500 sm:text-xl animate-fade-up [animation-delay:120ms] mb-8">
            Your one stop solution for all on chain Subscriptions
          </h2>
          <div className="flex w-full max-w-xs flex-col gap-3 animate-fade-up [animation-delay:180ms]">
            <button className="btn-primary w-full !py-3 mb-1">
                View My Subscriptions
            </button>
            <button className="btn-secondary w-full !py-3">
                View My Services
            </button>
          </div>

          {/* decorative feature strip */}
          <ul aria-hidden="true" className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500 animate-fade-up [animation-delay:240ms]">
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Non-custodial</li>
            <li className="flex items-center gap-2"><Zap className="h-4 w-4 text-brand-500" /> Automatic renewals</li>
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-amber-500" /> Multi-chain testnets</li>
          </ul>
      </div>
    )
  }
  
  export default Welcome
