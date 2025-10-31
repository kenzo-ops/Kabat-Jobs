import React from "react";
import Sidebar from "@/custom-components/Sidebar";
import PostInput from "@/custom-components/PostInput";
import DarkVeil from "@/components/DarkVeil";

const HomePage = () => {
    const [active, setActive] = React.useState<string>("#overview");

    return (
        <div className="relative min-h-dvh overflow-hidden font-poppins">
            {/* 🔹 Jadikan DarkVeil sebagai background utama */}
            <div className="absolute inset-0 -z-20">
                <DarkVeil />
            </div>

            {/* 🔹 Konten utama tetap sama */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
                <div className="flex gap-6">
                    <Sidebar activeHref={active} onNavigate={setActive} />
                    <main className="flex-1 min-w-0">
                        {/* Post input at the very top */}
                        <div className="mb-4 sm:mb-6">
                            <PostInput />
                        </div>
                        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
                            <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
                            <div className="relative p-6 sm:p-8">
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                    Home
                                </h1>
                                <p className="mt-2 text-white/70 text-sm sm:text-base">
                                    Welcome back. Select a menu item on the left to get started.
                                </p>

                                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                        <div className="text-white/80 text-sm">Current section</div>
                                        <div className="mt-1 text-white text-lg font-semibold break-all">
                                            {active}
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                        <div className="text-white/80 text-sm">Quick tips</div>
                                        <ul className="mt-2 list-disc list-inside text-white/70 text-sm">
                                            <li>Use filters to find tailored jobs</li>
                                            <li>Save roles to review later</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
