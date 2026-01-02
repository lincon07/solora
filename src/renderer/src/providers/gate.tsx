import PairSettings from "@renderer/pages/settings/pairing/pair"
import { Navigate } from "react-router-dom"

function HubGate({ children }: { children: React.ReactNode }) {
  const hubToken = localStorage.getItem("hubToken")

  if (!hubToken) {
    return <PairSettings />
  }

  return <>{children}</>
}

export default HubGate