import React from "react";
import Sidebar from "@/custom-components/Sidebar";
import PostInput from "@/custom-components/PostInput";
import PostList from "@/custom-components/PostList";
import DarkVeil from "@/components/DarkVeil";

const HomePage = () => {
    const [active, setActive] = React.useState<string>("#overview");

    return (
        <div className="relative min-h-screen font-poppins">
            {/* 🔹 Jadikan DarkVeil sebagai background utama yang mengikuti konten */}
            <div className="fixed inset-0 -z-20">
                <DarkVeil />
            </div>

            {/* 🔹 Konten utama */}
            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
                <div className="flex gap-6">
                    {/* Sidebar sticky di kiri */}
                    <div className="hidden md:block shrink-0">
                        <div className="sticky top-6 self-start">
                            <Sidebar activeHref={active} onNavigate={setActive} />
                        </div>
                    </div>
                    
                    {/* Main content area - hanya bagian ini yang scroll */}
                    <main className="flex-1 min-w-0">
                        {/* Post input at the very top */}
                        <div className="mb-4 sm:mb-6">
                            <PostInput />
                        </div>
                        {/* Post List dengan infinite scroll */}
                        <div className="mb-4 sm:mb-6">
                            <PostList />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );  
};

export default HomePage;
