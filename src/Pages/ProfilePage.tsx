import React, { useEffect, useRef } from "react"
import DarkVeil from "@/components/DarkVeil"
import Sidebar from "@/custom-components/Sidebar"
import supabase from "@/supabase-client"
import type { User } from "@supabase/supabase-js"

const ProfilePage: React.FC = () => {
    const [user, setUser] = React.useState<User | null>(null)
    const [uploading, setUploading] = React.useState(false)
    const [active, setActive] = React.useState<string>("#overview")
    const [avatarSrc, setAvatarSrc] = React.useState<string | null>(null)
    const [avatarBroken, setAvatarBroken] = React.useState(false)
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

    // Resolve avatar src whenever user metadata changes (sama seperti di Sidebar)
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

            <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 py-6 sm:py-8">
                <div className="flex gap-6">
                    <div className="hidden md:block shrink-0">
                        <div className="sticky top-6 self-start">
                            <Sidebar
                                activeHref={active}
                                onNavigate={setActive}
                            />
                        </div>
                    </div>

                    <main className="flex-1 min-w-0">
                        <div className="mx-auto max-w-7xl">
                            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
                                <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
                                <div className="relative p-6 sm:p-8">
                                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                                        Profile
                                    </h1>
                                    <p className="mt-2 text-white/70 text-sm sm:text-base">
                                        Kelola informasi akun Anda.
                                    </p>

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
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
