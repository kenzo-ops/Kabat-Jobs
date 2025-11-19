import React, { useEffect, useRef } from "react"
import DarkVeil from "@/components/DarkVeil"
import Sidebar from "@/custom-components/Sidebar"
import BottomBar from "@/custom-components/BottomBar"
import supabase from "@/supabase-client"
import type { User } from "@supabase/supabase-js"
import { useNavigate } from "react-router"
import { Heart, MessageCircle, Image as ImageIcon, Trash2, X } from "lucide-react"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { ProfileInfoSkeleton, ProfilePostsSkeleton } from "@/custom-components/skeletons/ProfileSkeleton"

dayjs.extend(relativeTime)

type Post = {
    id: string
    title: string
    description: string
    images?: string[] | null
    link_url?: string | null
    user_id?: string
    created_at: string
    likes_count?: number
    comments_count?: number
}

const ProfilePage: React.FC = () => {
    const navigate = useNavigate()
    const [user, setUser] = React.useState<User | null>(null)
    const [uploading, setUploading] = React.useState(false)
    const [avatarSrc, setAvatarSrc] = React.useState<string | null>(null)
    const [avatarBroken, setAvatarBroken] = React.useState(false)
    const [activeTab, setActiveTab] = React.useState<"profile" | "posts">("profile")
    const [posts, setPosts] = React.useState<Post[]>([])
    const [loadingPosts, setLoadingPosts] = React.useState(false)
    const [deleteConfirmId, setDeleteConfirmId] = React.useState<string | null>(null)
    const [deleting, setDeleting] = React.useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleProfileImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        try {
            const file = event.target.files?.[0]
            if (!file || !user) return

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert("File terlalu besar. Maksimal ukuran file adalah 2MB")
                return
            }

            // Validate file type
            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/webp",
            ]
            if (!allowedTypes.includes(file.type)) {
                alert(
                    "Tipe file tidak didukung. Gunakan format JPG, PNG, GIF, atau WEBP"
                )
                return
            }

            setUploading(true)

            // Delete old custom avatar if exists
            if (user.user_metadata?.custom_avatar_url) {
                const oldFileName = user.user_metadata.custom_avatar_url
                    .split("/")
                    .pop()
                if (oldFileName && oldFileName.startsWith("avatar-")) {
                    try {
                        await supabase.storage
                            .from("avatars")
                            .remove([oldFileName])
                    } catch (err) {
                        console.error("Error removing old avatar:", err)
                    }
                }
            }

            const fileExt = file.name.split(".").pop()
            const fileName = `avatar-${user.id}-${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(fileName, file, {
                    cacheControl: "3600",
                    upsert: false,
                })

            if (uploadError) {
                console.error("Supabase upload error:", uploadError)

                const msg = String(uploadError.message || uploadError)
                if (
                    msg.toLowerCase().includes("not found") ||
                    msg.toLowerCase().includes("does not exist")
                ) {
                    alert(
                        "Storage bucket 'avatars' tidak ditemukan di project Supabase. Pastikan Anda sudah membuat bucket dengan nama 'avatars' dan memberikan policy yang sesuai."
                    )
                    return
                }

                if (
                    msg.toLowerCase().includes("permission") ||
                    msg.toLowerCase().includes("denied")
                ) {
                    alert(
                        "Akses ditolak. Pastikan bucket policy mengizinkan authenticated users untuk mengupload file dan bucket tidak menolak request dari client."
                    )
                    return
                }

                alert(`Upload gagal: ${msg}`)
                return
            }

            // Get public URL
            const {
                data: { publicUrl },
            } = supabase.storage.from("avatars").getPublicUrl(fileName)

            // Update user metadata
            const { error: updateError } = await supabase.auth.updateUser({
                data: {
                    ...user.user_metadata,
                    custom_avatar_url: publicUrl,
                },
            })

            if (updateError) {
                throw updateError
            }
        } catch (error: any) {
            console.error("Error uploading image:", error)
            if (error.message) {
                alert(`Error: ${error.message}`)
            } else {
                alert(
                    "Terjadi kesalahan saat mengupload gambar. Silakan coba lagi."
                )
            }
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const fetchUserPosts = async (userId: string) => {
        setLoadingPosts(true)
        try {
            const { data, error } = await supabase.rpc("get_user_posts", {
                p_user_id: userId
            })

            if (error) {
                console.error("Error fetching user posts:", error)
                return
            }

            if (data) {
                setPosts(data)
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        } finally {
            setLoadingPosts(false)
        }
    }

    const handleDeletePost = async (postId: string) => {
    setDeleting(true)
    try {
        const { data, error } = await supabase.rpc("delete_user_post", {
            p_post_id: parseInt(postId),
            p_user_id: user?.id
        })

        if (error) {
            console.error("Error deleting post:", error)
            alert("Failed to delete post. Please try again.")
            return
        }

        if (data && data.length > 0) {
            const result = data[0]
            if (result.success) {
                // Remove from UI
                setPosts(posts.filter(post => post.id !== postId))
                setDeleteConfirmId(null)
                // Optional: show success message
                // alert(result.message)
            } else {
                alert(result.message)
            }
        }
    } catch (error) {
        console.error("Error deleting post:", error)
        alert("An error occurred while deleting the post.")
    } finally {
        setDeleting(false)
    }
}

    useEffect(() => {
        const fetchUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                fetchUserPosts(user.id)
            }
        }
        fetchUser()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (session?.user) {
                fetchUserPosts(session.user.id)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    useEffect(() => {
        let mounted = true
        const resolveAvatar = async () => {
            setAvatarBroken(false)
            if (!user) {
                if (mounted) setAvatarSrc(null)
                return
            }

            // Cek custom avatar dari Supabase storage terlebih dahulu
            const customAvatar = user.user_metadata?.custom_avatar_url
            if (customAvatar) {
                try {
                    new URL(customAvatar)
                    if (mounted) {
                        setAvatarSrc(customAvatar)
                        setAvatarBroken(false)
                    }
                    return
                } catch (err) {
                    console.error("Invalid custom avatar URL:", err)
                }
            }

            // Jika tidak ada custom avatar, coba gunakan Google avatar
            // dengan kualitas lebih baik (s400-c instead of s96-c)
            const googleAvatar = user.user_metadata?.avatar_url
            if (googleAvatar?.includes("googleusercontent.com")) {
                const betterQualityUrl = googleAvatar.replace("s96-c", "s400-c")
                if (mounted) {
                    setAvatarSrc(betterQualityUrl)
                    setAvatarBroken(false)
                }
                return
            }

            // Fallback ke storage path jika ada
            const storagePath = user.user_metadata?.avatar_path
            if (storagePath) {
                try {
                    const {
                        data: { publicUrl },
                    } = supabase.storage
                        .from("avatars")
                        .getPublicUrl(storagePath)
                    if (mounted) setAvatarSrc(publicUrl)
                } catch (err) {
                    console.error("Error resolving avatar from storage:", err)
                    if (mounted) {
                        setAvatarSrc(null)
                        setAvatarBroken(true)
                    }
                }
                return
            }

            // Tidak ada avatar yang valid
            if (mounted) setAvatarSrc(null)
        }

        resolveAvatar()
        return () => {
            mounted = false
        }
    }, [user])

    return (
        <div className="relative min-h-screen font-poppins">
            <div className="fixed inset-0 -z-20">
                <DarkVeil />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
                <div className="flex gap-6">
                    <div className="hidden md:block shrink-0">
                        <div className="sticky top-6 self-start">
                            <Sidebar />
                        </div>
                    </div>

                    <main className="flex-1 min-w-0">
                        <div className="mx-auto max-w-8xl">
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
                                <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
                                <div className="relative p-6 sm:p-8">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                        Profile
                                    </h1>
                                    <p className="mt-2 text-white/70 text-sm sm:text-base">
                                        Kelola informasi akun Anda.
                                    </p>

                                    {/* Tab Navigation */}
                                    <div className="mt-6 flex gap-2 border-b border-white/10">
                                        <button
                                            onClick={() => setActiveTab("profile")}
                                            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                                                activeTab === "profile"
                                                    ? "text-white"
                                                    : "text-white/60 hover:text-white/80"
                                            }`}
                                        >
                                            Profile Info
                                            {activeTab === "profile" && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setActiveTab("posts")}
                                            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${
                                                activeTab === "posts"
                                                    ? "text-white"
                                                    : "text-white/60 hover:text-white/80"
                                            }`}
                                        >
                                            My Posts ({posts.length})
                                            {activeTab === "posts" && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Profile Tab Content */}
                                    {activeTab === "profile" && (
                                    !user ? (
                                        <ProfileInfoSkeleton />
                                    ) : (
                                    <div className="mt-6 grid gap-4">
                                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                                <button
                                                    type="button"
                                                    className="relative group"
                                                    onClick={triggerFileInput}
                                                    aria-label="Change profile photo"
                                                    disabled={uploading}
                                                >
                                                    {avatarSrc &&
                                                    !avatarBroken ? (
                                                        <img
                                                            src={avatarSrc}
                                                            alt="Profile"
                                                            className="h-24 w-24 rounded-full object-cover border-2 border-white/10"
                                                            onError={() => {
                                                                console.error(
                                                                    "Avatar failed to load",
                                                                    avatarSrc
                                                                )
                                                                setAvatarBroken(
                                                                    true
                                                                )
                                                                if (
                                                                    avatarSrc ===
                                                                    user
                                                                        ?.user_metadata
                                                                        ?.custom_avatar_url
                                                                ) {
                                                                    setAvatarSrc(
                                                                        null
                                                                    )
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-semibold text-white">
                                                            {user?.user_metadata
                                                                ?.name
                                                                ? user.user_metadata.name
                                                                      .split(
                                                                          " "
                                                                      )
                                                                      .map(
                                                                          (
                                                                              n: string
                                                                          ) =>
                                                                              n[0]
                                                                      )
                                                                      .join("")
                                                                : "??"}
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-sm">
                                                            {uploading
                                                                ? "Uploading..."
                                                                : "Change Photo"}
                                                        </span>
                                                    </div>
                                                </button>
                                                <div className="flex-1">
                                                    <div className="text-white/80 text-sm">
                                                        Name
                                                    </div>
                                                    <div className="mt-1 text-white text-lg font-semibold">
                                                        {user?.user_metadata
                                                            ?.name || "Loading"}
                                                    </div>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={
                                                    handleProfileImageUpload
                                                }
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </div>
                                        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                                            <div className="text-white/80 text-sm">
                                                Email
                                            </div>
                                            <div className="mt-1 text-white text-lg font-semibold break-all">
                                                {user?.email || "Loading"}
                                            </div>
                                        </div>

                                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                            More Details
                                        </h1>
                                        <p className="text-white/70 text-sm sm:text-base">
                                            Complete your account profile
                                        </p>
                                        <label
                                            htmlFor="post-title"
                                            className="block text-xs text-white/70"
                                        >
                                            Account Description
                                        </label>
                                        <input
                                            id="post-title"
                                            name="title"
                                            type="text"
                                            placeholder="Example: Frontend Developer React (Remote)"
                                            className="w-full rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-3.5 py-2.5 text-sm"
                                        />
                                        <div className="flex gap-3 pt-2">
                                            <a
                                                href="/home"
                                                className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/90 hover:bg-white/5"
                                            >
                                                Back To Home
                                            </a>
                                        </div>
                                    </div>
                                    )
                                    )}

                                    {/* Posts Tab Content */}
                                    {activeTab === "posts" && (
                                    <div className="mt-6 grid gap-4">
                                        {loadingPosts ? (
                                            <ProfilePostsSkeleton />
                                        ) : posts.length === 0 ? (
                                            <div className="text-center py-12">
                                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4">
                                                    <ImageIcon className="h-8 w-8 text-white/40" />
                                                </div>
                                                <h3 className="text-white font-semibold text-lg mb-2">No posts yet</h3>
                                                <p className="text-white/60 text-sm mb-6">Start sharing your thoughts with the community</p>
                                                <button
                                                    onClick={() => navigate("/home")}
                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-sm font-medium transition-colors border border-white/10"
                                                >
                                                    Go to Feed
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {posts.map((post) => (
                                                    <div
                                                        key={post.id}
                                                        className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition-all"
                                                    >
                                                        <div className="absolute inset-px rounded-[0.7rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        
                                                        {/* Delete Button */}
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                setDeleteConfirmId(post.id)
                                                            }}
                                                            className="absolute top-2 right-2 z-10 p-2 rounded-lg bg-red-500/90 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg backdrop-blur-sm"
                                                            aria-label="Delete post"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                        
                                                        <div onClick={() => navigate(`/post/${post.id}`)} className="cursor-pointer">
                                                        
                                                        {/* Post Image/Thumbnail */}
                                                        {post.images && post.images.length > 0 ? (
                                                            <div className="relative aspect-video overflow-hidden">
                                                                <img
                                                                    src={post.images[0]}
                                                                    alt={post.title}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                />
                                                                {post.images.length > 1 && (
                                                                    <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-white text-xs font-medium">
                                                                        +{post.images.length - 1}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="relative aspect-video bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                                                                <ImageIcon className="h-12 w-12 text-white/20" />
                                                            </div>
                                                        )}

                                                        {/* Post Content */}
                                                        <div className="relative p-4">
                                                            <h3 className="text-white font-semibold text-base line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
                                                                {post.title}
                                                            </h3>
                                                            <p className="text-white/60 text-sm line-clamp-2 mb-3">
                                                                {post.description}
                                                            </p>

                                                            {/* Post Meta */}
                                                            <div className="flex items-center justify-between text-xs text-white/50">
                                                                <span>{dayjs(post.created_at).fromNow()}</span>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="inline-flex items-center gap-1">
                                                                        <Heart className="h-3.5 w-3.5" />
                                                                        <span>{post.likes_count || 0}</span>
                                                                    </div>
                                                                    <div className="inline-flex items-center gap-1">
                                                                        <MessageCircle className="h-3.5 w-3.5" />
                                                                        <span>{post.comments_count || 0}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteConfirmId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
                        
                        <div className="relative p-6">
                            {/* Close button */}
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                disabled={deleting}
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Icon */}
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                                <Trash2 className="h-6 w-6 text-red-500" />
                            </div>

                            {/* Title */}
                            <h3 className="text-xl font-bold text-white mb-2">
                                Delete Post?
                            </h3>

                            {/* Description */}
                            <p className="text-white/60 text-sm mb-6">
                                Are you sure you want to delete this post? This action cannot be undone and all comments and likes will be permanently removed.
                            </p>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirmId(null)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleDeletePost(deleteConfirmId)}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {deleting ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Deleting...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4" />
                                            <span>Delete</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bottom Bar for mobile */}
            <BottomBar />
        </div>
    )
}

export default ProfilePage
