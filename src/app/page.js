import CLI from "@/components/CLI"
import CRTAnimation from "@/components/CRTAnimation"

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="crt-animation">
        <CRTAnimation/>
      </div>

      <div className="cli-container">
        <CLI/>
      </div>
    </div>
  )
}
