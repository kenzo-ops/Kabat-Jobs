import Sidebar from "@/custom-components/Sidebar";
import BottomBar from "@/custom-components/BottomBar";
import PostInput from "@/custom-components/PostInput";
import PostList from "@/custom-components/PostList";
import DarkVeil from "@/components/DarkVeil";
import { useNavigate } from "react-router";
import supabase from "@/supabase-client";
import { useEffect } from "react";

const HomePage = () => {

    const navigate = useNavigate()

    useEffect(() => {
        const handleSession = async () => {
        const { data, error } = await supabase.auth.getSession()
        if (!data.session) {
            // Jika nggak ada session, paksa balik ke login
            navigate('/login')
        }
        }

        handleSession()
    }, [])

    return (
        <div className="relative min-h-screen font-poppins">
            {/* 🔹 Jadikan DarkVeil sebagai background utama yang mengikuti konten */}
            <div className="fixed inset-0 -z-20">
                <DarkVeil />
            </div>

            {/* 🔹 Konten utama */}
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
                <div className="flex gap-6">
                    {/* Sidebar sticky di kiri - hidden on mobile */}
                    <div className="hidden md:block shrink-0">
                        <div className="sticky top-6 self-start">
                            <Sidebar activeHref="/home" />
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

            {/* Bottom Bar for mobile */}
            <BottomBar />
        </div>
    );  
};

export default HomePage;
