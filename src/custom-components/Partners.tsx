import SpotlightCard from "@/components/SpotlightCard";
import LogoLoop from "@/components/LogoLoop";
import { SiGoogle, SiAmazon, SiLinkedin, SiGojek } from "react-icons/si";

const techLogos = [
  {
    node: <SiGoogle className="text-[#ffffff]" />,
    title: "Google",
    href: "https://google.com",
  },
  {
    node: <SiAmazon className="text-[#ffffff]" />,
    title: "Amazon",
    href: "https://amazon.com",
  },
  {
    node: <SiLinkedin className="text-[#ffffff]" />,
    title: "LinkedIn",
    href: "https://linkedin.com",
  },
  {
    node: <SiGojek className="text-[#ffffff]" />,
    title: "Gojek",
    href: "https://gojek.com",
  },
];

const Partners = () => {
  return (
    <>
      <div className="relative flex flex-col items-center justify-center w-full bg-gray-900 rounded-t-3xl shadow-[0_-5px_60px_0_rgba(59,130,246,0.6)] overflow-hidden py-8 sm:py-10 md:py-12 lg:py-14 px-2 sm:px-6 md:px-8">
        <div className="flex justify-center mb-8 sm:mb-10">
          <p className="text-secondary text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center px-4">
            Our Partners
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-500/20 to-transparent pointer-events-none"></div>

        <div className="relative z-10 w-full mb-8 sm:mb-10 lg:mb-12">
          <LogoLoop
            logos={techLogos}
            speed={90}
            direction="left"
            logoHeight={50}
            gap={120}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#111827"
            ariaLabel="Technology partners"
          />
        </div>

        {/* === BENTO GRID (Full Width) === */}
        <div
          className="
            relative z-20 grid 
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
            gap-3 sm:gap-6 w-full
            auto-rows-[200px] sm:auto-rows-[250px] lg:auto-rows-[280px]
            px-2 sm:px-6 lg:px-10
          "
        >
          {/* Card 1 */}
          <SpotlightCard
            className="
              custom-spotlight-card p-4 sm:p-6 lg:p-8 flex flex-col justify-between 
              rounded-2xl bg-gray-800/70 border border-gray-700 
              hover:scale-[1.03] transition-all duration-300 backdrop-blur-md 
              lg:col-span-2
            "
          >
            <div className="flex items-center gap-2 sm:gap-4 mb-2">
              <span className="bg-blue-500/40 px-2 sm:px-3 py-1 text-xs rounded-full text-blue-200 font-semibold">
                #1 Innovation
              </span>
              <span className="text-4xl"></span>
            </div>
            <h5 className="text-blue-400 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
              Innovation
            </h5>
            <ul className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-md list-disc pl-4 sm:pl-5 mt-2 space-y-1">
              <li>Partnering with groundbreaking tech leaders</li>
              <li>Menerapkan teknologi terbaru secara cepat</li>
              <li>Pilihan utama para inovator digital</li>
              <li>
                <span className="font-bold text-blue-300">
                  Annual Innovation Award 2024
                </span>
              </li>
            </ul>
          </SpotlightCard>

          {/* Card 2 */}
          <SpotlightCard
            className="
              custom-spotlight-card p-4 sm:p-6 lg:p-8 flex flex-col justify-between 
              rounded-2xl bg-gray-800/70 border border-gray-700 
              hover:scale-[1.03] transition-all duration-300 backdrop-blur-md 
              lg:row-span-2
            "
          >
            <div className="flex items-center justify-between mb-3">
              <span className="bg-blue-500/40 px-2 sm:px-3 py-1 text-xs rounded-full text-blue-200 font-semibold">
                Most Reliable
              </span>
              <div className="flex items-center gap-1">
                <span className="text-blue-300 text-base sm:text-xl font-semibold">4.9</span>
                <span className="text-yellow-400 text-base sm:text-lg">★</span>
              </div>
            </div>
            <h5 className="text-blue-400 text-3xl sm:text-4xl md:text-5xl font-bold mb-2">
              Reliability
            </h5>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-1 mb-3 max-w-md">
              Trusted partners ensuring consistent quality
              <span className="font-semibold text-green-100"> uptime &gt; 99.9%</span> in all collaborations.
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-blue-950/40 text-blue-200 px-2 py-1 rounded-full">
                ISO 27001 Certified
              </span>
              <span className="text-xs text-blue-100">| Partner Satisfaction</span>
            </div>
            <div className="h-[2px] w-full bg-blue-900/40 mt-1 mb-2 rounded-lg"></div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-800/30 text-green-100 text-xs rounded-full px-2 py-1 font-medium">99.99% SLA</span>
                <span className="bg-blue-800/30 text-blue-100 text-xs rounded-full px-2 py-1 font-medium">24/7 Support</span>
              </div>
            </div>
            <div className="mt-2 text-[13px] text-blue-100 italic border-l-4 border-blue-700 pl-3 font-light max-w-xs">
              "Reliability is our core promise — we never miss a beat."<br />
              <span className="not-italic font-medium">- CTO Partner</span>
            </div>
          </SpotlightCard>

          {/* Card 3 */}
          <SpotlightCard
            className="
              custom-spotlight-card p-4 sm:p-6 lg:p-8 flex flex-col justify-between 
              rounded-2xl bg-gray-800/70 border border-gray-700 
              hover:scale-[1.03] transition-all duration-300 backdrop-blur-md
            "
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg text-indigo-200"></span>
              <span className="bg-blue-500/40 px-2 py-1 text-xs rounded text-indigo-100 font-medium">
                Global Reach
              </span>
            </div>
            <h5 className="text-blue-400 text-xl sm:text-2xl font-semibold">
              Global Reach
            </h5>
            <ul className="text-gray-300 text-sm sm:text-base leading-relaxed mt-2 list-disc pl-4 sm:pl-5">
              <li>Presence in 30+ countries</li>
              <li>13 languages supported</li>
              <li>Empowering next-gen solutions</li>
              <li>
                <span className="bg-blue-600/30 rounded-full px-2 py-1 text-xs text-blue-100">
                  24/7 Global Support
                </span>
              </li>
            </ul>
          </SpotlightCard>

          {/* Card 4 */}
          <SpotlightCard
            className="
              custom-spotlight-card p-4 sm:p-6 lg:p-8 flex flex-col justify-between 
              rounded-2xl bg-gray-800/70 border border-gray-700 
              hover:scale-[1.03] transition-all duration-300 backdrop-blur-md 
              lg:col-span-2
            "
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl text-blue-400"></span>
              <span className="bg-blue-500/40 px-2 py-1 text-xs rounded text-blue-200 font-medium">
                Top Collab
              </span>
            </div>
            <h5 className="text-blue-400 text-2xl sm:text-3xl font-semibold">
              Collaboration
            </h5>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Together, we build bridges between innovation and execution —
              creating meaningful partnerships worldwide.
            </p>
            <blockquote className="mt-4 text-sm italic border-l-4 border-blue-400 pl-4 text-blue-100">
              "Best collaboration platform this year!" — Partner Review
            </blockquote>
          </SpotlightCard>

          {/* Card 5 */}
          <SpotlightCard
            className="
              custom-spotlight-card p-4 sm:p-6 lg:p-8 flex flex-col justify-between 
              rounded-2xl bg-gray-800/70 border border-gray-700 
              hover:scale-[1.03] transition-all duration-300 backdrop-blur-md 
            "
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl text-blue-400"></span>
              <span className="bg-blue-500/40 px-2 py-1 text-xs rounded text-blue-200 font-medium">
                Eco Friendly
              </span>
            </div>
            <h5 className="text-blue-300 text-xl sm:text-2xl font-semibold">
              Sustainability
            </h5>
            <ul className="text-gray-300 text-sm sm:text-base leading-relaxed mt-2 list-disc pl-4 sm:pl-5">
              <li>
                CO₂ reduction project: <span className="font-bold">-70%</span>{" "}
                yearly
              </li>
              <li>Green supply chain</li>
              <li>Supporting circular economy</li>
              <li>
                <span className="bg-blue-500/20 rounded px-2 py-1 text-xs text-blue-100">
                  Go Green Awards 2025
                </span>
              </li>
            </ul>
          </SpotlightCard>
        </div>
      </div>
    </>
  );
};

export default Partners;
