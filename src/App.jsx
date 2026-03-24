import Hero from "./components/Hero"
import Highlights from "./components/Highlights"
import Navbar from "./components/Navbar"
import Model from "./components/Model"
import InteractiveShowcase from "./components/showcase/InteractiveShowcase"
import Features from "./components/Features"
import HowItWorks from "./components/HowItWorks"
import Footer from "./components/Footer"
import useScrollTriggerRefresh from "./hooks/useScrollTriggerRefresh"

import * as Sentry from '@sentry/react'

const App = () => {
  // Refresh all ScrollTrigger instances on orientation change / resize
  useScrollTriggerRefresh();

  return (
    <main className="bg-black">
      <Navbar />
      <Hero />
      <Highlights />
      <Model />
      <InteractiveShowcase />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  )
}

export default Sentry.withProfiler(App)
