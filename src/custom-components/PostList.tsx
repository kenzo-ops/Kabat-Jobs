import React, { useEffect, useState, useRef, useCallback } from "react";
import { Heart, MessageCircle, Share2, MoreVertical } from "lucide-react";
import supabase from "@/supabase-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Post = {
  id: string;
  title: string;
  description: string;
  created_at: string;
};

type PostListProps = {
  posts?: Post[];
};

const POSTS_PER_PAGE = 10;

const PostList: React.FC<PostListProps> = ({}) => {

  const [post, setPost] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async (pageNum: number, append: boolean = false) => {
    setLoading(true);
    const from = pageNum * POSTS_PER_PAGE;
    const to = from + POSTS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from("Posts")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.log("Error Fetching data : ", error);
      setLoading(false);
      return;
    }

    if (data) {
      if (data.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }
      
      if (append) {
        setPost((prev) => [...prev, ...data]);
      } else {
        setPost(data);
      }
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPosts(0, false);
  }, [fetchPosts]);

  // Realtime subscription
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
        (payload) => {
          console.log("Realtime event:", payload.eventType, payload);

          if (payload.eventType === "INSERT") {
            const newPost = payload.new as Post;
            // Tambahkan post baru di awal karena diurutkan descending
            setPost((prev) => {
              // Cek apakah post sudah ada untuk menghindari duplikasi
              const exists = prev.some((p) => p.id === newPost.id);
              if (exists) return prev;
              return [newPost, ...prev];
            });
            // Reset hasMore karena ada post baru
            setHasMore(true);
          } else if (payload.eventType === "UPDATE") {
            const updatedPost = payload.new as Post;
            // Update post yang sudah ada
            setPost((prev) =>
              prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
            );
          } else if (payload.eventType === "DELETE") {
            const deletedPost = payload.old as Post;
            // Hapus post dari list
            setPost((prev) => prev.filter((p) => p.id !== deletedPost.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPosts(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [page, hasMore, loading, fetchPosts]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {post.map((pos) => (
        <article
          key={pos.id}
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] transition-all hover:border-white/20 hover:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />
          
          <div className="relative p-5 sm:p-6">
            {/* Post Header */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {'Dummy'.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm sm:text-base leading-tight truncate">
                    TestUsers
                  </h3>
                  <p className="text-white/50 text-xs mt-0.5">
                    {pos.created_at ? dayjs(pos.created_at).fromNow() : "Just Now"}
                  </p>
                </div>
              </div>
              <button
                className="flex-shrink-0 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                aria-label="More options"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>

            {/* Post Title */}
            <h2 className="text-white font-bold text-lg sm:text-xl mb-3 leading-tight">
              {pos.title}
            </h2>

            {/* Post Content */}
            <p className="text-white/70 text-sm sm:text-base leading-relaxed mb-4">
              {pos.description}
            </p>

            {/* Post Footer - Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <button className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                  <Heart className="h-4 w-4 group-hover:fill-red-500/20 group-hover:stroke-red-400 transition-all" />
                  <span className="text-xs font-medium">
                    0
                  </span>
                </button>
                <button className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                  <MessageCircle className="h-4 w-4 group-hover:stroke-blue-400 transition-all" />
                  <span className="text-xs font-medium">
                    0
                  </span>
                </button>
                <button className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
                  <Share2 className="h-4 w-4 group-hover:stroke-green-400 transition-all" />
                  <span className="text-xs font-medium">Share</span>
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
      
      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="h-4" />
      
      {/* Loading indicator */}
      {loading && (
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
    </div>
  );
};

export default PostList;

