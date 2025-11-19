import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import { Heart, MessageCircle, Share2, MoreVertical, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import { useNavigate } from "react-router";
import supabase from "@/supabase-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostSkeletonList } from "./skeletons/PostSkeleton";

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

type PostListProps = {
  posts?: Post[];
};

const POSTS_PER_PAGE = 10;

// ====================================
// MEMOIZED POST ITEM COMPONENT
// ====================================
const PostItem = memo<{
  post: Post;
  isLiked: boolean;
  isSaved: boolean;
  onImageClick: (url: string) => void;
  onLikeClick: (postId: string) => void;
  onPostClick: (postId: string) => void;
  onSaveToggle: (postId: string) => void;
  getAvatarUrl: (post: Post) => string | null;
  getUserInitials: (post: Post) => string;
  getDisplayName: (post: Post) => string;
}>(({ 
  post, 
  isLiked, 
  isSaved,
  onImageClick, 
  onLikeClick, 
  onPostClick,
  onSaveToggle,
  getAvatarUrl, 
  getUserInitials, 
  getDisplayName 
}) => {
  const avatarUrl = getAvatarUrl(post);
  const userInitials = getUserInitials(post);
  const displayName = getDisplayName(post);

  // Handler untuk navigate ke detail
  const handlePostClick = (e: React.MouseEvent) => {
    // Jangan navigate jika user klik button, link, atau image
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('a') || 
      target.closest('[data-no-navigate]')
    ) {
      return;
    }
    onPostClick(post.id);
  };

  return (
    <article 
      onClick={handlePostClick}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] transition-all hover:border-white/20 hover:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.8)] cursor-pointer"
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
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                    if (sibling) sibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="w-full h-full flex items-center justify-center"
                style={{ display: avatarUrl ? "none" : "flex" }}
              >
                <span className="text-white text-sm font-semibold">
                  {userInitials}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm sm:text-base leading-tight truncate">
                {displayName}
              </h3>
              <p className="text-white/50 text-xs mt-0.5">
                {post.created_at ? dayjs(post.created_at).fromNow() : "Just Now"}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex-shrink-0 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="More options"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 backdrop-blur-xl border-white/10">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onSaveToggle(post.id);
                }}
                className="text-white/80 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 mr-2 text-amber-500" />
                    <span>Unsave Post</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    <span>Save Post</span>
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Title */}
        <h2 className="text-white font-bold text-lg sm:text-xl mb-3 leading-tight">
          {post.title}
        </h2>

        {/* Post Content - Truncate untuk preview */}
        <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
          {post.description}
        </p>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div
            data-no-navigate
            className={`mb-4 grid gap-2 ${
              post.images.length === 1
                ? "grid-cols-1"
                : post.images.length === 2
                ? "grid-cols-2"
                : post.images.length === 3
                ? "grid-cols-3"
                : "grid-cols-2"
            }`}
          >
            {post.images.slice(0, 4).map((imageUrl, index) => (
              <div
                key={index}
                className={`relative rounded-lg overflow-hidden bg-white/5 border border-white/10 cursor-pointer group ${
                  post.images!.length === 1 ? "aspect-video" : "aspect-square"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onImageClick(imageUrl);
                }}
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
            onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => {
                e.stopPropagation();
                onLikeClick(post.id);
              }}
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <Heart 
                className={`h-4 w-4 transition-all ${
                  isLiked 
                    ? 'fill-red-500 stroke-red-500' 
                    : 'group-hover:fill-red-500/20 group-hover:stroke-red-400'
                }`}
              />
              <span className="text-xs font-medium">
                {post.likes_count || 0}
              </span>
            </button>
            <button className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
              <MessageCircle className="h-4 w-4 group-hover:stroke-blue-400 transition-all" />
              <span className="text-xs font-medium">{post.comments_count || 0}</span>
            </button>
            <button 
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
            >
              <Share2 className="h-4 w-4 group-hover:stroke-green-400 transition-all" />
              <span className="text-xs font-medium">Share</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

PostItem.displayName = "PostItem";

// ====================================
// MAIN POST LIST COMPONENT
// ====================================
const PostList: React.FC<PostListProps> = () => {
  const navigate = useNavigate();
  const [post, setPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());
  const [userSavedPosts, setUserSavedPosts] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // ====================================
  // MEMOIZED HELPER FUNCTIONS
  // ====================================
  const getAvatarUrl = useCallback((post: Post): string | null => {
    if (post.user_custom_avatar_url) {
      return post.user_custom_avatar_url;
    }
    if (post.user_avatar_url?.includes("googleusercontent.com")) {
      return post.user_avatar_url.replace("s96-c", "s400-c");
    }
    return post.user_avatar_url || null;
  }, []);

  const getUserInitials = useCallback((post: Post): string => {
    const name = post.user_name || post.user_email || "User";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const getDisplayName = useCallback((post: Post): string => {
    return post.user_name || post.user_email?.split("@")[0] || "Anonymous User";
  }, []);

  // ====================================
  // NAVIGATION HANDLER
  // ====================================
  const handlePostClick = useCallback((postId: string) => {
    navigate(`/post/${postId}`);
  }, [navigate]);

  // ====================================
  // FETCH POSTS DENGAN RPC
  // ====================================
  const fetchPosts = useCallback(
    async (pageNum: number, append: boolean = false) => {
      setLoading(true);
      const offset = pageNum * POSTS_PER_PAGE;

      try {
        const { data, error } = await supabase.rpc("get_posts_with_users", {
          limit_count: POSTS_PER_PAGE,
          offset_count: offset,
        });

        if (error) {
          console.error("Error fetching posts with RPC:", error);
          throw error;
        }

        if (data) {
          console.log("Fetched posts:", data);

          if (data.length < POSTS_PER_PAGE) {
            setHasMore(false);
          }

          if (append) {
            setPost((prev) => [...prev, ...data]);
          } else {
            setPost(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ====================================
  // INITIAL FETCH
  // ====================================
  useEffect(() => {
    fetchPosts(0, false);
    
    // Fetch current user and their likes
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        
        // Fetch user likes
        const { data: likesData } = await supabase.rpc('get_user_likes', {
          p_user_id: user.id
        });
        
        if (likesData) {
          setUserLikes(new Set(likesData.map((item: any) => item.post_id)));
        }

        // Fetch user saved posts
        const { data: savedData } = await supabase
          .from("saved_posts")
          .select("post_id")
          .eq("user_id", user.id);
        
        if (savedData) {
          setUserSavedPosts(new Set(savedData.map((item: any) => item.post_id)));
        }
      }
    };
    
    fetchUserData();
  }, [fetchPosts]);

  // ====================================
  // REALTIME SUBSCRIPTION
  // ====================================
  useEffect(() => {
  const channel = supabase
    .channel("Posts")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "Posts",
      },
      async (payload) => {
        console.log("Realtime event:", payload.eventType, payload);

        if (payload.eventType === "INSERT") {
          const newPost = payload.new as Post;

          // Fetch user data untuk post baru
          if (newPost.user_id) {
            try {
              const { data: userData, error } = await supabase.rpc(
                "get_user_profile",
                {
                  user_id_param: newPost.user_id,
                }
              );

              if (!error && userData && userData.length > 0) {
                newPost.user_name = userData[0].name;
                newPost.user_email = userData[0].email;
                newPost.user_avatar_url = userData[0].avatar_url;
                newPost.user_custom_avatar_url = userData[0].custom_avatar_url;
              }
            } catch (err) {
              console.error("Error fetching user profile:", err);
            }
          }

          setPost((prev) => {
            const exists = prev.some((p) => p.id === newPost.id);
            if (exists) return prev;
            return [newPost, ...prev];
          });
          setHasMore(true);
          
        } else if (payload.eventType === "UPDATE") {
          const updatedPost = payload.new as Post;
          
          // ✅ FIX: Merge dengan data existing, JANGAN override semua
          setPost((prev) =>
            prev.map((p) => {
              if (p.id === updatedPost.id) {
                // Merge: keep user data, only update post content & counts
                return {
                  ...p,  // Keep existing data (user info, etc)
                  title: updatedPost.title,
                  description: updatedPost.description,
                  images: updatedPost.images,
                  link_url: updatedPost.link_url,
                  // ✅ PRESERVE counts if new data is null/undefined
                  likes_count: updatedPost.likes_count ?? p.likes_count ?? 0,
                  comments_count: updatedPost.comments_count ?? p.comments_count ?? 0,
                  created_at: updatedPost.created_at,
                };
              }
              return p;
            })
          );
          
        } else if (payload.eventType === "DELETE") {
          const deletedPost = payload.old as Post;
          setPost((prev) => prev.filter((p) => p.id !== deletedPost.id));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  // ====================================
  // INFINITE SCROLL DENGAN DEBOUNCE
  // ====================================
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchPosts(nextPage, true);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      clearTimeout(timeoutId);
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [page, hasMore, loading, fetchPosts]);

  // ====================================
  // IMAGE MODAL HANDLERS
  // ====================================
  const openImageModal = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  }, []);

  const closeImageModal = useCallback(() => {
    setImageModalOpen(false);
    setSelectedImage("");
  }, []);

  // ====================================
  // LIKE HANDLER
  // ====================================
  const handleLikeClick = useCallback(async (postId: string) => {
    if (!currentUserId) {
      alert("Please login to like posts");
      return;
    }

    try {
      // Optimistic update
      const wasLiked = userLikes.has(postId);
      const newLikes = new Set(userLikes);
      
      if (wasLiked) {
        newLikes.delete(postId);
      } else {
        newLikes.add(postId);
      }
      setUserLikes(newLikes);

      // Update UI immediately
      setPost(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, likes_count: (p.likes_count || 0) + (wasLiked ? -1 : 1) }
          : p
      ));

      // Call RPC
      const { data, error } = await supabase.rpc('toggle_like', {
        p_post_id: parseInt(postId),
        p_user_id: currentUserId
      });

      if (error) {
        // Revert on error
        setUserLikes(userLikes);
        setPost(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, likes_count: (p.likes_count || 0) + (wasLiked ? 1 : -1) }
            : p
        ));
        console.error("Error toggling like:", error);
      } else if (data && data.length > 0) {
        // Update with actual data from server
        setPost(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, likes_count: data[0].likes_count }
            : p
        ));
      }
    } catch (error) {
      console.error("Error in handleLikeClick:", error);
    }
  }, [currentUserId, userLikes]);

  // ====================================
  // SAVE/UNSAVE HANDLER
  // ====================================
  const handleSaveToggle = useCallback(async (postId: string) => {
    if (!currentUserId) {
      alert("Please login to save posts");
      return;
    }

    try {
      const wasSaved = userSavedPosts.has(postId);
      const newSavedPosts = new Set(userSavedPosts);

      // Optimistic update
      if (wasSaved) {
        newSavedPosts.delete(postId);
      } else {
        newSavedPosts.add(postId);
      }
      setUserSavedPosts(newSavedPosts);

      if (wasSaved) {
        // Unsave post
        const { error } = await supabase
          .from("saved_posts")
          .delete()
          .eq("user_id", currentUserId)
          .eq("post_id", postId);

        if (error) {
          // Revert on error
          setUserSavedPosts(userSavedPosts);
          console.error("Error unsaving post:", error);
          alert("Failed to unsave post");
        }
      } else {
        // Save post
        const { error } = await supabase
          .from("saved_posts")
          .insert({
            user_id: currentUserId,
            post_id: postId
          });

        if (error) {
          // Revert on error
          setUserSavedPosts(userSavedPosts);
          console.error("Error saving post:", error);
          alert("Failed to save post");
        }
      }
    } catch (error) {
      console.error("Error in handleSaveToggle:", error);
    }
  }, [currentUserId, userSavedPosts]);

  // ====================================
  // RENDER
  // ====================================
  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {/* Initial loading skeleton */}
        {loading && post.length === 0 && <PostSkeletonList count={3} />}

        {/* Posts list */}
        {post.map((pos) => (
          <PostItem
            key={pos.id}
            post={pos}
            isLiked={userLikes.has(pos.id)}
            isSaved={userSavedPosts.has(pos.id)}
            onImageClick={openImageModal}
            onLikeClick={handleLikeClick}
            onPostClick={handlePostClick}
            onSaveToggle={handleSaveToggle}
            getAvatarUrl={getAvatarUrl}
            getUserInitials={getUserInitials}
            getDisplayName={getDisplayName}
          />
        ))}

        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="h-4" />

        {/* Loading more indicator */}
        {loading && post.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-white/60 text-sm">Memuat lebih banyak...</div>
          </div>
        )}

        {/* End of list indicator */}
        {!hasMore && post.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="text-white/40 text-sm">Tidak ada post lagi</div>
          </div>
        )}

        {/* Empty state */}
        {!loading && post.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-white/40 text-lg font-semibold mb-2">
              Belum ada post
            </div>
            <div className="text-white/30 text-sm">
              Jadilah yang pertama membuat post!
            </div>
          </div>
        )}
      </div>

      {/* IMAGE MODAL - FULLSCREEN PREVIEW */}
      {imageModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeImageModal}
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
    </>
  );
};

export default PostList;