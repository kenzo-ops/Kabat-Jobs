// ============================================
// PostDetailPage.tsx - Pages/PostDetailPage.tsx
// ============================================
import React, { useEffect, useState, useCallback } from "react";
import { Heart, MessageCircle, Share2, ArrowLeft, ExternalLink, MoreVertical, Send } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import supabase from "@/supabase-client";
import DarkVeil from "@/components/DarkVeil";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

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

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id?: string;
  user_name?: string | null;
  user_email?: string | null;
  user_avatar_url?: string | null;
  user_custom_avatar_url?: string | null;
};

const PostDetailPage: React.FC = () => {
  const { id: postId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  // Fetch post detail
  useEffect(() => {
    if (!postId) {
      navigate("/home");
      return;
    }

    const fetchPostDetail = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }

        // Fetch post detail
        const { data: postData, error: postError } = await supabase.rpc("get_post_detail", {
          p_post_id: parseInt(postId)
        });

        if (postError) {
          console.error("Error fetching post:", postError);
          throw postError;
        }

        if (postData && postData.length > 0) {
          setPost(postData[0]);
        } else {
          console.log("Post not found");
        }

        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase.rpc("get_post_comments", {
          p_post_id: parseInt(postId)
        });

        if (commentsError) {
          console.error("Error fetching comments:", commentsError);
        } else if (commentsData) {
          setComments(commentsData);
        }

        // Check if user liked this post
        if (user) {
          const { data: likesData, error: likesError } = await supabase.rpc("get_user_likes", {
            p_user_id: user.id
          });
          
          if (!likesError && likesData) {
            setIsLiked(likesData.some((item: any) => item.post_id === postId));
          }
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetail();
  }, [postId, navigate]);

  const handleLikeClick = useCallback(async () => {
    if (!currentUserId || !post) {
      alert("Please login to like posts");
      return;
    }

    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setPost(prev => prev ? {
      ...prev,
      likes_count: (prev.likes_count || 0) + (wasLiked ? -1 : 1)
    } : null);

    try {
      const { data, error } = await supabase.rpc("toggle_like", {
        p_post_id: parseInt(postId!),
        p_user_id: currentUserId
      });

      if (error) {
        console.error("Error toggling like:", error);
        setIsLiked(wasLiked);
        setPost(prev => prev ? {
          ...prev,
          likes_count: (prev.likes_count || 0) + (wasLiked ? 1 : -1)
        } : null);
      } else if (data && data.length > 0) {
        setPost(prev => prev ? { 
          ...prev, 
          likes_count: data[0].likes_count 
        } : null);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setIsLiked(wasLiked);
      setPost(prev => prev ? {
        ...prev,
        likes_count: (prev.likes_count || 0) + (wasLiked ? 1 : -1)
      } : null);
    }
  }, [currentUserId, isLiked, post, postId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !currentUserId || !postId) {
      if (!currentUserId) {
        alert("Please login to comment");
      }
      return;
    }

    setIsSubmittingComment(true);
    try {
      const { data: commentData, error } = await supabase.rpc("add_comment", {
        p_post_id: parseInt(postId),
        p_user_id: currentUserId,
        p_content: newComment.trim()
      });

      if (error) {
        console.error("Error adding comment:", error);
        alert("Failed to add comment. Please try again.");
        return;
      }

      if (commentData && commentData.length > 0) {
        setComments(prev => [commentData[0], ...prev]);
        setNewComment("");
        
        setPost(prev => prev ? {
          ...prev,
          comments_count: (prev.comments_count || 0) + 1
        } : null);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const getAvatarUrl = (avatarUrl?: string | null, customUrl?: string | null) => {
    if (customUrl) return customUrl;
    if (avatarUrl?.includes("googleusercontent.com")) {
      return avatarUrl.replace("s96-c", "s400-c");
    }
    return avatarUrl || null;
  };

  const getUserInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return "??";
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/home");
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen font-poppins">
        <div className="fixed inset-0 -z-20">
          <DarkVeil />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white/60 text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="relative min-h-screen font-poppins">
        <div className="fixed inset-0 -z-20">
          <DarkVeil />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-white/60 text-lg mb-4">Post not found</div>
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to feed</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const avatarUrl = getAvatarUrl(post.user_avatar_url, post.user_custom_avatar_url);
  const displayName = post.user_name || post.user_email?.split("@")[0] || "Anonymous User";
  const userInitials = getUserInitials(post.user_name, post.user_email);

  return (
    <div className="relative min-h-screen font-poppins">
      <div className="fixed inset-0 -z-20">
        <DarkVeil />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back to feed</span>
        </button>

        {/* Main Post Card */}
        <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] mb-6">
          <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            {/* Post Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-base font-semibold">
                        {userInitials}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base sm:text-lg leading-tight truncate">
                    {displayName}
                  </h3>
                  <p className="text-white/50 text-sm mt-0.5">
                    {dayjs(post.created_at).fromNow()}
                  </p>
                </div>
              </div>
              <button
                className="flex-shrink-0 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            {/* Post Title */}
            <h1 className="text-white font-bold text-2xl sm:text-3xl mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Post Content */}
            <div className="text-white/80 text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-line">
              {post.description}
            </div>

            {/* Post Images */}
            {post.images && post.images.length > 0 && (
              <div className={`mb-6 grid gap-3 ${
                post.images.length === 1 ? "grid-cols-1" :
                post.images.length === 2 ? "grid-cols-2" : "grid-cols-2"
              }`}>
                {post.images.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`relative rounded-xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer group ${
                      post.images!.length === 1 ? "aspect-video" : "aspect-square"
                    }`}
                    onClick={() => {
                      setSelectedImage(imageUrl);
                      setImageModalOpen(true);
                    }}
                  >
                    <img
                      src={imageUrl}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
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
                className="inline-flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors group"
              >
                <ExternalLink className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                <span className="text-sm text-white/70 group-hover:text-white transition-colors truncate max-w-md">
                  {post.link_url}
                </span>
              </a>
            )}

            {/* Engagement Stats */}
            <div className="flex items-center gap-6 pt-6 border-t border-white/10">
              <button
                onClick={handleLikeClick}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group"
              >
                <Heart
                  className={`h-5 w-5 transition-all ${
                    isLiked
                      ? "fill-red-500 stroke-red-500"
                      : "group-hover:fill-red-500/20 group-hover:stroke-red-400"
                  }`}
                />
                <span className="text-sm font-medium">
                  {post.likes_count || 0} {(post.likes_count || 0) === 1 ? "like" : "likes"}
                </span>
              </button>
              <div className="inline-flex items-center gap-2 text-white/60">
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm font-medium">
                  {post.comments_count || 0} {(post.comments_count || 0) === 1 ? "comment" : "comments"}
                </span>
              </div>
              <button className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group ml-auto">
                <Share2 className="h-5 w-5 group-hover:stroke-green-400 transition-all" />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
          <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            <h2 className="text-white font-semibold text-lg mb-6">Comments</h2>

            {/* Comment Input */}
            <div className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitComment(e);
                    }
                  }}
                  placeholder="Write a comment..."
                  className="flex-1 rounded-xl bg-white/5 text-white placeholder:text-white/40 border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/20 outline-none px-4 py-3 text-sm"
                  disabled={isSubmittingComment}
                />
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmittingComment}
                  className="inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-colors border border-white/10 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 disabled:opacity-50 disabled:cursor-not-allowed bg-white/10 hover:bg-white/15 text-white"
                >
                  {isSubmittingComment ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-white/40 text-sm">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment) => {
                  const commentAvatarUrl = getAvatarUrl(
                    comment.user_avatar_url,
                    comment.user_custom_avatar_url
                  );
                  const commentInitials = getUserInitials(comment.user_name, comment.user_email);
                  const commentDisplayName = comment.user_name || comment.user_email?.split("@")[0] || "Anonymous";

                  return (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 overflow-hidden">
                        {commentAvatarUrl ? (
                          <img
                            src={commentAvatarUrl}
                            alt={commentDisplayName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-white text-sm font-semibold">
                              {commentInitials}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="rounded-xl bg-white/5 border border-white/10 px-4 py-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium text-sm">
                              {commentDisplayName}
                            </span>
                            <span className="text-white/40 text-xs">
                              {dayjs(comment.created_at).fromNow()}
                            </span>
                          </div>
                          <p className="text-white/80 text-sm leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

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

export default PostDetailPage;