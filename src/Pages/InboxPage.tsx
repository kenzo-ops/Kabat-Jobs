import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import DarkVeil from "@/components/DarkVeil"
import Sidebar from "@/custom-components/Sidebar"
import BottomBar from "@/custom-components/BottomBar"
import supabase from "@/supabase-client"
import type { User } from "@supabase/supabase-js"
import { Bell, UserPlus, Users, Check, X, Mail } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useNavigate } from "react-router"

dayjs.extend(relativeTime)

type FriendRequest = {
    id: number
    user_id: string
    friend_id: string
    status: string
    created_at: string
    user_name: string
    user_email: string
    user_avatar_url?: string | null
    user_custom_avatar_url?: string | null
}

type Follower = {
    id: string
    name: string
    email: string
    avatar_url?: string | null
    custom_avatar_url?: string | null
    followed_at: string
}

const InboxPage: React.FC = () => {
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null)
    const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
    const [newFollowers, setNewFollowers] = useState<Follower[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<"requests" | "followers">("requests")
    const [processingId, setProcessingId] = useState<number | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                loadNotifications(user.id)
            }
        }
        fetchUser()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                loadNotifications(session.user.id)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const loadNotifications = async (userId: string) => {
        setLoading(true)
        try {
            // Load friend requests
            const { data: requestsData, error: requestsError } = await supabase.rpc("get_friend_requests", {
                p_user_id: userId
            })

            if (requestsError) {
                console.error("Error loading friend requests:", requestsError)
            } else if (requestsData) {
                setFriendRequests(requestsData)
            }

            // Load new followers (last 30 days)
            const { data: followersData, error: followersError } = await supabase.rpc("get_user_followers", {
                p_user_id: userId
            })

            if (followersError) {
                console.error("Error loading followers:", followersError)
            } else if (followersData) {
                // Filter followers from last 30 days
                const thirtyDaysAgo = dayjs().subtract(30, "day")
                const recentFollowers = followersData.filter((f: Follower) => 
                    dayjs(f.followed_at).isAfter(thirtyDaysAgo)
                )
                setNewFollowers(recentFollowers)
            }
        } catch (error) {
            console.error("Error loading notifications:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleAcceptRequest = async (requestId: number) => {
        setProcessingId(requestId)
        try {
            const { data, error } = await supabase.rpc("accept_friend_request", {
                p_request_id: requestId
            })

            if (error) {
                console.error("Error accepting friend request:", error)
                toast.error("Failed to accept friend request")
                return
            }

            if (data && data.length > 0 && data[0].success) {
                toast.success("Friend request accepted!")
                setFriendRequests(friendRequests.filter(req => req.id !== requestId))
            } else {
                toast.error(data[0]?.message || "Failed to accept friend request")
            }
        } catch (error) {
            console.error("Error accepting friend request:", error)
            toast.error("An error occurred")
        } finally {
            setProcessingId(null)
        }
    }

    const handleRejectRequest = async (requestId: number) => {
        setProcessingId(requestId)
        try {
            const { data, error } = await supabase.rpc("reject_friend_request", {
                p_request_id: requestId
            })

            if (error) {
                console.error("Error rejecting friend request:", error)
                toast.error("Failed to reject friend request")
                return
            }

            if (data && data.length > 0 && data[0].success) {
                toast.success("Friend request rejected")
                setFriendRequests(friendRequests.filter(req => req.id !== requestId))
            } else {
                toast.error(data[0]?.message || "Failed to reject friend request")
            }
        } catch (error) {
            console.error("Error rejecting friend request:", error)
            toast.error("An error occurred")
        } finally {
            setProcessingId(null)
        }
    }

    const getAvatarSrc = (avatarUrl?: string | null, customAvatarUrl?: string | null): string | null => {
        if (customAvatarUrl) return customAvatarUrl
        if (avatarUrl?.includes("googleusercontent.com")) {
            return avatarUrl.replace("s96-c", "s400-c")
        }
        return avatarUrl || null
    }

    const getInitials = (name: string): string => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const totalNotifications = friendRequests.length + newFollowers.length

    return (
        <div className="relative min-h-screen font-poppins">
            <div className="fixed inset-0 -z-20">
                <DarkVeil />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
                <div className="flex gap-6">
                    <div className="hidden md:block shrink-0">
                        <div className="sticky top-6 self-start">
                            <Sidebar activeHref="/inbox" />
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
                                                <Bell className="h-8 w-8" />
                                                Inbox
                                            </h1>
                                            <p className="mt-2 text-white/70 text-sm sm:text-base">
                                                {loading ? "Loading notifications..." : `${totalNotifications} ${totalNotifications === 1 ? "notification" : "notifications"}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tab Navigation */}
                                    <div className="flex gap-2 border-b border-white/10 mb-6">
                                        <button
                                            onClick={() => setActiveTab("requests")}
                                            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                                                activeTab === "requests"
                                                    ? "text-white"
                                                    : "text-white/60 hover:text-white/80"
                                            }`}
                                        >
                                            Friend Requests
                                            {friendRequests.length > 0 && (
                                                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                                                    {friendRequests.length}
                                                </span>
                                            )}
                                            {activeTab === "requests" && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("followers")}
                                            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                                                activeTab === "followers"
                                                    ? "text-white"
                                                    : "text-white/60 hover:text-white/80"
                                            }`}
                                        >
                                            New Followers
                                            {newFollowers.length > 0 && (
                                                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-blue-500 rounded-full">
                                                    {newFollowers.length}
                                                </span>
                                            )}
                                            {activeTab === "followers" && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Friend Requests Tab */}
                                    {activeTab === "requests" && (
                                        <div className="space-y-3">
                                            {loading ? (
                                                <div className="space-y-3">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 animate-pulse">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-14 h-14 rounded-full bg-white/10" />
                                                                <div className="flex-1 space-y-2">
                                                                    <div className="h-4 bg-white/10 rounded w-1/3" />
                                                                    <div className="h-3 bg-white/10 rounded w-1/2" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : friendRequests.length === 0 ? (
                                                <div className="text-center py-16">
                                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-4">
                                                        <UserPlus className="h-10 w-10 text-white/40" />
                                                    </div>
                                                    <h3 className="text-white font-semibold text-lg mb-2">
                                                        No friend requests
                                                    </h3>
                                                    <p className="text-white/60 text-sm">
                                                        You don't have any pending friend requests
                                                    </p>
                                                </div>
                                            ) : (
                                                friendRequests.map((request) => {
                                                    const avatarSrc = getAvatarSrc(request.user_avatar_url, request.user_custom_avatar_url)
                                                    const initials = getInitials(request.user_name || request.user_email)
                                                    const isProcessing = processingId === request.id

                                                    return (
                                                        <div
                                                            key={request.id}
                                                            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all"
                                                        >
                                                            <div className="absolute inset-px rounded-[0.7rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            
                                                            <div className="relative p-4">
                                                                <div className="flex items-start gap-4">
                                                                    {/* Avatar */}
                                                                    <div 
                                                                        className="flex-shrink-0 cursor-pointer"
                                                                        onClick={() => navigate(`/user/${request.user_id}`)}
                                                                    >
                                                                        {avatarSrc ? (
                                                                            <img
                                                                                src={avatarSrc}
                                                                                alt={request.user_name}
                                                                                className="h-14 w-14 rounded-full object-cover border-2 border-white/10 hover:border-white/20 transition-colors"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-base font-semibold text-white">
                                                                                {initials}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Request Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 
                                                                            className="text-white font-semibold text-base truncate hover:text-blue-400 transition-colors cursor-pointer"
                                                                            onClick={() => navigate(`/user/${request.user_id}`)}
                                                                        >
                                                                            {request.user_name || "Unknown User"}
                                                                        </h3>
                                                                        <p className="text-white/60 text-sm truncate flex items-center gap-1.5 mt-0.5">
                                                                            <Mail className="h-3.5 w-3.5" />
                                                                            {request.user_email}
                                                                        </p>
                                                                        <p className="text-white/40 text-xs mt-1">
                                                                            {dayjs(request.created_at).fromNow()}
                                                                        </p>

                                                                        {/* Action Buttons */}
                                                                        <div className="flex gap-2 mt-3">
                                                                            <button
                                                                                onClick={() => handleAcceptRequest(request.id)}
                                                                                disabled={isProcessing}
                                                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            >
                                                                                <Check className="h-4 w-4" />
                                                                                {isProcessing ? "Processing..." : "Accept"}
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleRejectRequest(request.id)}
                                                                                disabled={isProcessing}
                                                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                            >
                                                                                <X className="h-4 w-4" />
                                                                                {isProcessing ? "Processing..." : "Reject"}
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    )}

                                    {/* New Followers Tab */}
                                    {activeTab === "followers" && (
                                        <div className="space-y-3">
                                            {loading ? (
                                                <div className="space-y-3">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 animate-pulse">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-14 h-14 rounded-full bg-white/10" />
                                                                <div className="flex-1 space-y-2">
                                                                    <div className="h-4 bg-white/10 rounded w-1/3" />
                                                                    <div className="h-3 bg-white/10 rounded w-1/2" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : newFollowers.length === 0 ? (
                                                <div className="text-center py-16">
                                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 border border-white/10 mb-4">
                                                        <Users className="h-10 w-10 text-white/40" />
                                                    </div>
                                                    <h3 className="text-white font-semibold text-lg mb-2">
                                                        No new followers
                                                    </h3>
                                                    <p className="text-white/60 text-sm">
                                                        You don't have any new followers in the last 30 days
                                                    </p>
                                                </div>
                                            ) : (
                                                newFollowers.map((follower) => {
                                                    const avatarSrc = getAvatarSrc(follower.avatar_url, follower.custom_avatar_url)
                                                    const initials = getInitials(follower.name || follower.email)

                                                    return (
                                                        <div
                                                            key={follower.id}
                                                            className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all cursor-pointer"
                                                            onClick={() => navigate(`/user/${follower.id}`)}
                                                        >
                                                            <div className="absolute inset-px rounded-[0.7rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            
                                                            <div className="relative p-4">
                                                                <div className="flex items-center gap-4">
                                                                    {/* Avatar */}
                                                                    <div className="flex-shrink-0">
                                                                        {avatarSrc ? (
                                                                            <img
                                                                                src={avatarSrc}
                                                                                alt={follower.name}
                                                                                className="h-14 w-14 rounded-full object-cover border-2 border-white/10"
                                                                            />
                                                                        ) : (
                                                                            <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-base font-semibold text-white">
                                                                                {initials}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Follower Info */}
                                                                    <div className="flex-1 min-w-0">
                                                                        <h3 className="text-white font-semibold text-base truncate group-hover:text-blue-400 transition-colors">
                                                                            {follower.name || "Unknown User"}
                                                                        </h3>
                                                                        <p className="text-white/60 text-sm truncate flex items-center gap-1.5 mt-0.5">
                                                                            <Mail className="h-3.5 w-3.5" />
                                                                            {follower.email}
                                                                        </p>
                                                                        <p className="text-white/40 text-xs mt-1 flex items-center gap-1">
                                                                            <Users className="h-3 w-3" />
                                                                            Started following {dayjs(follower.followed_at).fromNow()}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Bottom Bar for mobile */}
            <BottomBar />
        </div>
    )
}

export default InboxPage
