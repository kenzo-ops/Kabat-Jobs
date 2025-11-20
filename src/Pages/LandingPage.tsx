import Navbar from '../custom-components/Navbar'
import Hero from '../custom-components/Hero'
import DarkVeil from '../components/DarkVeil'
import Partners from '../custom-components/Partners'
import Reviews from '../custom-components/Reviews'
import Footer from '../custom-components/Footer'

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <DarkVeil />
      </div>
      <Navbar />
      <div className="relative z-10 flex flex-col text-center min-h-screen">
        <div className="flex-grow flex items-center text-center justify-center">
          <Hero title="Modern Job Platform for the Professional Generation" subtitle="Search. Apply. Succeed. With Kabat Jobs"/>
        </div>
      </div>
      <div className="relative z-10 flex flex-col pt-8">
        <Partners />
      </div>
      <div className="relative z-10 flex flex-col">
        <Reviews />
      </div>
      <Footer />
    </div>
  )
}

export default LandingPage
