import CLI from "@/components/CLI";
import CRTAnimation from "@/components/CRTAnimation";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* CRT Animation Layer */}
      <div className="crt-animation">
        {/* CRT Scanline Animation Component */}
        <CRTAnimation/>
      </div>

      {/* CLI Content Layer */}
      <div className="cli-container">
        <CLI/>
      </div>
    </div>
  )
}
