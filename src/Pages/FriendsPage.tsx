import React, { useEffect } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "react-router"
import DarkVeil from "@/components/DarkVeil"
import Sidebar from "@/custom-components/Sidebar"
import BottomBar from "@/custom-components/BottomBar"
import supabase from "@/supabase-client"
import type { User } from "@supabase/supabase-js"
import { Users, UserPlus, Mail, MoreVertical, UserMinus, MessageCircle, Search, X } from "lucide-react"
import { FriendListSkeleton } from "@/custom-components/skeletons/FriendSkeleton"

type Friend = {
    id: string
    name: string
    email: string
    avatar_url?: string | null
    custom_avatar_url?: string | null
    created_at?: string
}

const FriendsPage: React.FC = () => {
    const navigate = useNavigate()
    const [user, setUser] = React.useState<User | null>(null)
    const [friends, setFriends] = React.useState<Friend[]>([])
    const [loading, setLoading] = React.useState(true)
    const [activeMenu, setActiveMenu] = React.useState<string | null>(null)
    const [showAddFriendModal, setShowAddFriendModal] = React.useState(false)
    const [searchEmail, setSearchEmail] = React.useState("")
    const [searchResults, setSearchResults] = React.useState<Friend[]>([])
    const [searching, setSearching] = React.useState(false)
    const [sendingRequest, setSendingRequest] = React.useState<string | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
        }
        fetchUser()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        const loadFriends = async () => {
            if (!user) return
            
            setLoading(true)
            try {
                const { data, error } = await supabase.rpc("get_user_friends", { 
                    p_user_id: user.id 
                })
                
                if (error) {
                    console.error("Error loading friends:", error)
                } else if (data) {
                    setFriends(data)
                }
            } catch (error) {
                console.error("Error loading friends:", error)
            } finally {
                setLoading(false)
            }
        }

        if (user) {
            loadFriends()
        }
    }, [user])

    const handleSearchUsers = async () => {
        if (!searchEmail.trim() || !user) return

        setSearching(true)
        try {
            const { data, error } = await supabase.rpc("get_user_profile", {
                user_id_param: null
            })

            if (error) throw error

            // Filter by email search
            const filtered = data?.filter((u: Friend) => 
                u.email.toLowerCase().includes(searchEmail.toLowerCase()) &&
                u.id !== user.id
            ) || []

            setSearchResults(filtered)
        } catch (error) {
            console.error("Error searching users:", error)
            toast.error("Failed to search users")
        } finally {
            setSearching(false)
        }
    }

    const handleSendFriendRequest = async (friendId: string) => {
        if (!user) return

        setSendingRequest(friendId)
        try {
            const { error } = await supabase
                .from("friends")
                .insert({
                    user_id: user.id,
                    friend_id: friendId,
                    status: "pending"
                })

            if (error) throw error

            toast.success("Friend request sent!")
            setSearchResults(searchResults.filter(u => u.id !== friendId))
        } catch (error: any) {
            console.error("Error sending friend request:", error)
            if (error.code === "23505") {
                toast.error("Friend request already sent")
            } else {
                toast.error("Failed to send friend request")
            }
        } finally {
            setSendingRequest(null)
        }
    }

    const getAvatarSrc = (friend: Friend): string | null => {
        if (friend.custom_avatar_url) {
            return friend.custom_avatar_url
        }
        if (friend.avatar_url?.includes("googleusercontent.com")) {
            return friend.avatar_url.replace("s96-c", "s400-c")
        }
        return friend.avatar_url || null
    }

    const getInitials = (name: string): string => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const handleRemoveFriend = async (friendId: string) => {
        // TODO: Implement remove friend functionality
        console.log("Remove friend:", friendId)
        setActiveMenu(null)
    }

    const handleSendMessage = (friendId: string) => {
        // TODO: Implement messaging functionality
        console.log("Send message to:", friendId)
        setActiveMenu(null)
    }

    return (
        <div className="relative min-h-screen font-poppins">
            <div className="fixed inset-0 -z-20">
                <DarkVeil />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
                <div className="flex gap-6">
                    <div className="hidden md:block shrink-0">
                        <div className="sticky top-6 self-start">
                            <Sidebar activeHref="/friends" />
                        </div>
                    </div>

                    <main className="flex-1 min-w-0">
                        <div className="mx-auto max-w-8xl">
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
                                <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
                                
                                <div className="relative p-6 sm:p-8">
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-6">
                                        <div>
                                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                                                <Users className="h-8 w-8" />
                                                My Friends
                                            </h1>
                                            <p className="mt-2 text-white/70 text-sm sm:text-base">
                                                Manage your connections and network
                                            </p>
                                        </div>
                                        <button 
                                            onClick={() => setShowAddFriendModal(true)}
                                            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium transition-all shadow-lg"
                                        >
                                            <UserPlus className="h-4 w-4" />
                                            Add Friend
                                        </button>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="mb-6">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search friends..."
                                                className="w-full rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-4 py-3 pl-10 text-sm"
                                            />
                                            <svg
                                                className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Friends Count */}
                                    <div className="mb-4 px-1">
                                        <span className="text-white/60 text-sm">
                                            {loading ? "Loading..." : `${friends.length} ${friends.length === 1 ? "friend" : "friends"}`}
                                        </span>
                                    </div>

                                    {/* Friends List */}
                                    <div className="space-y-3">
                                        {loading ? (
                                            <FriendListSkeleton count={5} />
                                        ) : friends.length === 0 ? (
                                            <div className="text-center py-16">
                                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-4">
                                                    <Users className="h-10 w-10 text-white/40" />
                                                </div>
                                                <h3 className="text-white font-semibold text-lg mb-2">
                                                    No friends yet
                                                </h3>
                                                <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
                                                    Start building your network by connecting with other professionals
                                                </p>
                                                <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all shadow-lg">
                                                    <UserPlus className="h-4 w-4" />
                                                    Find Friends
                                                </button>
                                            </div>
                                        ) : (
                                            friends.map((friend) => {
                                                const avatarSrc = getAvatarSrc(friend)
                                                const initials = getInitials(friend.name)

                                                return (
                                                    <div
                                                        key={friend.id}
                                                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all"
                                                    >
                                                        <div className="absolute inset-px rounded-[0.7rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        
                                                        <div className="relative p-4 flex items-center gap-4">
                                                            {/* Avatar */}
                                                            <div className="flex-shrink-0">
                                                                {avatarSrc ? (
                                                                    <img
                                                                        src={avatarSrc}
                                                                        alt={friend.name}
                                                                        className="h-14 w-14 rounded-full object-cover border-2 border-white/10"
                                                                        onError={(e) => {
                                                                            const target = e.target as HTMLImageElement
                                                                            target.style.display = "none"
                                                                            target.nextElementSibling?.classList.remove("hidden")
                                                                        }}
                                                                    />
                                                                ) : null}
                                                                <div
                                                                    className={`h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-base font-semibold text-white ${avatarSrc ? "hidden" : ""}`}
                                                                >
                                                                    {initials}
                                                                </div>
                                                            </div>

                                                            {/* Friend Info */}
                                                            <div className="flex-1 min-w-0">
                                                                <h3 className="text-white font-semibold text-base truncate group-hover:text-blue-400 transition-colors">
                                                                    {friend.name}
                                                                </h3>
                                                                <p className="text-white/60 text-sm truncate flex items-center gap-1.5 mt-0.5">
                                                                    <Mail className="h-3.5 w-3.5" />
                                                                    {friend.email}
                                                                </p>
                                                            </div>

                                                            {/* Action Buttons */}
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    onClick={() => handleSendMessage(friend.id)}
                                                                    className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors border border-white/10"
                                                                >
                                                                    <MessageCircle className="h-4 w-4" />
                                                                    Message
                                                                </button>
                                                                
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={() => setActiveMenu(activeMenu === friend.id ? null : friend.id)}
                                                                        className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                                                    >
                                                                        <MoreVertical className="h-5 w-5" />
                                                                    </button>

                                                                    {activeMenu === friend.id && (
                                                                        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl overflow-hidden z-10">
                                                                            <button
                                                                                onClick={() => handleSendMessage(friend.id)}
                                                                                className="w-full text-left px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 flex items-center gap-2 sm:hidden"
                                                                            >
                                                                                <MessageCircle className="h-4 w-4" />
                                                                                Send Message
                                                                            </button>
                                                                            <div className="h-px bg-white/10 sm:hidden" />
                                                                            <button
                                                                                onClick={() => handleRemoveFriend(friend.id)}
                                                                                className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2"
                                                                            >
                                                                                <UserMinus className="h-4 w-4" />
                                                                                Remove Friend
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Bottom Bar for mobile */}
            <BottomBar />

            {/* Click outside to close menu */}
            {activeMenu && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setActiveMenu(null)}
                />
            )}

            {/* Add Friend Modal */}
            {showAddFriendModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[80vh] overflow-hidden flex flex-col">
                        <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
                        
                        <div className="relative p-6 border-b border-white/10">
                            {/* Close button */}
                            <button
                                onClick={() => {
                                    setShowAddFriendModal(false)
                                    setSearchEmail("")
                                    setSearchResults([])
                                }}
                                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <UserPlus className="h-6 w-6" />
                                Add Friend
                            </h3>

                            {/* Search Input */}
                            <div className="relative">
                                <input
                                    type="email"
                                    value={searchEmail}
                                    onChange={(e) => setSearchEmail(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearchUsers()}
                                    placeholder="Search by email..."
                                    className="w-full rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-4 py-3 pl-10 text-sm"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                                <button
                                    onClick={handleSearchUsers}
                                    disabled={searching || !searchEmail.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {searching ? "Searching..." : "Search"}
                                </button>
                            </div>
                        </div>

                        {/* Search Results */}
                        <div className="relative p-6 overflow-y-auto flex-1">
                            {searchResults.length === 0 ? (
                                <div className="text-center py-12 text-white/40">
                                    {searchEmail.trim() ? "No users found" : "Search for users by email to add them as friends"}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {searchResults.map((result) => {
                                        const avatarSrc = getAvatarSrc(result)
                                        const initials = getInitials(result.name || result.email)

                                        return (
                                            <div
                                                key={result.id}
                                                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all"
                                            >
                                                <div className="absolute inset-px rounded-[0.7rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                                
                                                <div className="relative p-4 flex items-center gap-4">
                                                    {/* Avatar */}
                                                    <div 
                                                        className="flex-shrink-0 cursor-pointer"
                                                        onClick={() => {
                                                            setShowAddFriendModal(false)
                                                            navigate(`/user/${result.id}`)
                                                        }}
                                                    >
                                                        {avatarSrc ? (
                                                            <img
                                                                src={avatarSrc}
                                                                alt={result.name}
                                                                className="h-14 w-14 rounded-full object-cover border-2 border-white/10"
                                                            />
                                                        ) : (
                                                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-base font-semibold text-white">
                                                                {initials}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* User Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h3 
                                                            className="text-white font-semibold text-base truncate group-hover:text-blue-400 transition-colors cursor-pointer"
                                                            onClick={() => {
                                                                setShowAddFriendModal(false)
                                                                navigate(`/user/${result.id}`)
                                                            }}
                                                        >
                                                            {result.name || "Unknown User"}
                                                        </h3>
                                                        <p className="text-white/60 text-sm truncate flex items-center gap-1.5 mt-0.5">
                                                            <Mail className="h-3.5 w-3.5" />
                                                            {result.email}
                                                        </p>
                                                    </div>

                                                    {/* Add Friend Button */}
                                                    <button
                                                        onClick={() => handleSendFriendRequest(result.id)}
                                                        disabled={sendingRequest === result.id}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <UserPlus className="h-4 w-4" />
                                                        {sendingRequest === result.id ? "Sending..." : "Add"}
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default FriendsPage
