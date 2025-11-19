import React, { useEffect, useState, useCallback } from "react";
import { Heart, MessageCircle, Share2, MoreVertical, ExternalLink, Bookmark, BookmarkX } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import supabase from "@/supabase-client";
import DarkVeil from "@/components/DarkVeil";
import Sidebar from "@/custom-components/Sidebar";
import BottomBar from "@/custom-components/BottomBar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { PostSkeletonList } from "@/custom-components/skeletons/PostSkeleton";

dayjs.extend(relativeTime);

type Post = {
  id: string;
  title: string;
  description: string;
  images?: string[] | null;
  link_url?: string | null;
  user_id?: string;
  created_at: string;
  user_name?: string | null;
  user_email?: string | null;
  user_avatar_url?: string | null;
  user_custom_avatar_url?: string | null;
  likes_count?: number;
  comments_count?: number;
};

const SavedPostsPage: React.FC = () => {
  const navigate = useNavigate();
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  // Fetch current user and saved posts
  useEffect(() => {
    const fetchSavedPosts = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/login");
          return;
        }

        setCurrentUserId(user.id);

        // Fetch saved posts menggunakan RPC get_user_saved_posts
        const { data: postsData, error: postsError } = await supabase.rpc("get_user_saved_posts", {
          p_user_id: user.id
        });

        if (postsError) {
          console.error("Error fetching saved posts:", postsError);
          
          // Fallback: fetch posts directly if RPC doesn't exist yet
          const { data: savedData } = await supabase
            .from("saved_posts")
            .select("post_id")
            .eq("user_id", user.id);

          if (savedData && savedData.length > 0) {
            const postIds = savedData.map(item => item.post_id);
            const { data: fallbackPosts } = await supabase
              .from("Posts")
              .select("*")
              .in("id", postIds);
            
            if (fallbackPosts) {
              setSavedPosts(fallbackPosts);
            }
          }
        } else if (postsData) {
          setSavedPosts(postsData);
        }

        // Fetch user likes
        const { data: likesData } = await supabase.rpc('get_user_likes', {
          p_user_id: user.id
        });
        
        if (likesData) {
          setUserLikes(new Set(likesData.map((item: any) => item.post_id)));
        }

      } catch (error) {
        console.error("Error fetching saved posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, [navigate]);

  // Helper functions
  const getAvatarUrl = (post: Post): string | null => {
    if (post.user_custom_avatar_url) return post.user_custom_avatar_url;
    if (post.user_avatar_url?.includes("googleusercontent.com")) {
      return post.user_avatar_url.replace("s96-c", "s400-c");
    }
    return post.user_avatar_url || null;
  };

  const getUserInitials = (post: Post): string => {
    const name = post.user_name || post.user_email || "User";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getDisplayName = (post: Post): string => {
    return post.user_name || post.user_email?.split("@")[0] || "Anonymous User";
  };

  // Handle unsave post
  const handleUnsavePost = async (postId: string) => {
    if (!currentUserId) return;

    try {
      const { error } = await supabase
        .from("saved_posts")
        .delete()
        .eq("user_id", currentUserId)
        .eq("post_id", postId);

      if (error) {
        console.error("Error unsaving post:", error);
        toast.error("Failed to remove from saved posts");
      } else {
        // Remove from UI
        setSavedPosts(prev => prev.filter(p => p.id !== postId));
      }
    } catch (error) {
      console.error("Error unsaving post:", error);
    }
  };

  // Handle like
  const handleLikeClick = useCallback(async (postId: string) => {
    if (!currentUserId) {
      toast.warning("Please login to like posts");
      return;
    }

    try {
      const wasLiked = userLikes.has(postId);
      const newLikes = new Set(userLikes);
      
      if (wasLiked) {
        newLikes.delete(postId);
      } else {
        newLikes.add(postId);
      }
      setUserLikes(newLikes);

      setSavedPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, likes_count: (p.likes_count || 0) + (wasLiked ? -1 : 1) }
          : p
      ));

      const { data, error } = await supabase.rpc('toggle_like', {
        p_post_id: parseInt(postId),
        p_user_id: currentUserId
      });

      if (error) {
        setUserLikes(userLikes);
        setSavedPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, likes_count: (p.likes_count || 0) + (wasLiked ? 1 : -1) }
            : p
        ));
        console.error("Error toggling like:", error);
      } else if (data && data.length > 0) {
        setSavedPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, likes_count: data[0].likes_count }
            : p
        ));
      }
    } catch (error) {
      console.error("Error in handleLikeClick:", error);
    }
  }, [currentUserId, userLikes]);

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen font-poppins">
        <div className="fixed inset-0 -z-20">
          <DarkVeil />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white/60 text-sm">Loading saved posts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-poppins">
      <div className="fixed inset-0 -z-20">
        <DarkVeil />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - hidden on mobile */}
          <div className="hidden md:block shrink-0">
            <div className="sticky top-6 self-start">
              <Sidebar activeHref="/saved-jobs" />
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Bookmark className="h-6 w-6 text-white" />
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Saved Jobs
                </h1>
              </div>
              <p className="text-white/60 text-sm sm:text-base">
                {savedPosts.length} {savedPosts.length === 1 ? "job" : "jobs"} saved for later
              </p>
            </div>

            {/* Saved Posts List */}
            {loading ? (
              <PostSkeletonList count={3} />
            ) : savedPosts.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
                <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
                <div className="relative p-12 text-center">
                  <Bookmark className="h-16 w-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white/70 mb-2">
                    No saved jobs yet
                  </h3>
                  <p className="text-white/50 text-sm mb-6">
                    Start saving jobs you're interested in to view them later
                  </p>
                  <button
                    onClick={() => navigate("/home")}
                    className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-medium transition-colors bg-white/10 hover:bg-white/15 text-white border border-white/10"
                  >
                    Browse Jobs
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {savedPosts.map((post) => {
                  const avatarUrl = getAvatarUrl(post);
                  const userInitials = getUserInitials(post);
                  const displayName = getDisplayName(post);

                  return (
                    <article
                      key={post.id}
                      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] transition-all hover:border-white/20 hover:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.8)]"
                    >
                      <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />

                      <div className="relative p-5 sm:p-6">
                        {/* Post Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 overflow-hidden">
                              {avatarUrl ? (
                                <img
                                  src={avatarUrl}
                                  alt={displayName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-white text-sm font-semibold">
                                    {userInitials}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white font-semibold text-sm sm:text-base leading-tight truncate">
                                {displayName}
                              </h3>
                              <p className="text-white/50 text-xs mt-0.5">
                                {dayjs(post.created_at).fromNow()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleUnsavePost(post.id)}
                              className="flex-shrink-0 p-2 rounded-lg text-amber-500 hover:text-amber-400 hover:bg-white/5 transition-colors"
                              aria-label="Remove from saved"
                              title="Remove from saved"
                            >
                              <BookmarkX className="h-5 w-5" />
                            </button>
                            <button
                              className="flex-shrink-0 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                              aria-label="More options"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Post Title - Clickable */}
                        <h2
                          onClick={() => handlePostClick(post.id)}
                          className="text-white font-bold text-lg sm:text-xl mb-3 leading-tight cursor-pointer hover:text-white/80 transition-colors"
                        >
                          {post.title}
                        </h2>

                        {/* Post Content */}
                        <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
                          {post.description}
                        </p>

                        {/* Post Images */}
                        {post.images && post.images.length > 0 && (
                          <div
                            className={`mb-4 grid gap-2 ${
                              post.images.length === 1
                                ? "grid-cols-1"
                                : post.images.length === 2
                                ? "grid-cols-2"
                                : "grid-cols-2"
                            }`}
                          >
                            {post.images.slice(0, 4).map((imageUrl, index) => (
                              <div
                                key={index}
                                className={`relative rounded-lg overflow-hidden bg-white/5 border border-white/10 cursor-pointer group ${
                                  post.images!.length === 1 ? "aspect-video" : "aspect-square"
                                }`}
                                onClick={() => openImageModal(imageUrl)}
                              >
                                <img
                                  src={imageUrl}
                                  alt={`Post image ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  loading="lazy"
                                />
                                {post.images!.length > 4 && index === 3 && (
                                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                                    <span className="text-white text-2xl font-bold">
                                      +{post.images!.length - 4}
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* External Link */}
                        {post.link_url && (
                          <a
                            href={post.link_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors group"
                          >
                            <ExternalLink className="h-4 w-4 text-white/60 group-hover:text-white transition-colors" />
                            <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate max-w-xs">
                              {post.link_url}
                            </span>
                          </a>
                        )}

                        {/* Post Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleLikeClick(post.id)}
                              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                            >
                              <Heart
                                className={`h-4 w-4 transition-all ${
                                  userLikes.has(post.id)
                                    ? "fill-red-500 stroke-red-500"
                                    : "group-hover:fill-red-500/20 group-hover:stroke-red-400"
                                }`}
                              />
                              <span className="text-xs font-medium">
                                {post.likes_count || 0}
                              </span>
                            </button>
                            <button
                              onClick={() => handlePostClick(post.id)}
                              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
                            >
                              <MessageCircle className="h-4 w-4 group-hover:stroke-blue-400 transition-all" />
                              <span className="text-xs font-medium">{post.comments_count || 0}</span>
                            </button>
                            <button className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                              <Share2 className="h-4 w-4 group-hover:stroke-green-400 transition-all" />
                              <span className="text-xs font-medium">Share</span>
                            </button>
                          </div>
                          <button
                            onClick={() => handlePostClick(post.id)}
                            className="text-xs text-white/60 hover:text-white transition-colors font-medium"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Bottom Bar for mobile */}
      <BottomBar />

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setImageModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-colors"
              aria-label="Close"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SavedPostsPage;
