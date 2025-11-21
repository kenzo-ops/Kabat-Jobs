import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, UserPlus, Heart, MessageCircle, Calendar, Mail, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import supabase from "@/supabase-client";
import DarkVeil from "@/components/DarkVeil";
import BottomBar from "@/custom-components/BottomBar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type UserProfile = {
  id: string;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  custom_avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  created_at?: string;
};

type Post = {
  id: string;
  title: string;
  description: string;
  images?: string[] | null;
  created_at: string;
  likes_count?: number;
  comments_count?: number;
};

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFriend, setIsFriend] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [friendsCount, setFriendsCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [isTogglingFollow, setIsTogglingFollow] = useState(false);

  // Fetch user profile and posts
  useEffect(() => {
    if (!userId) {
      navigate("/home");
      return;
    }

    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }

        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase.rpc("get_user_profile", {
          user_id_param: userId
        });

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
          throw profileError;
        }

        if (profileData && profileData.length > 0) {
          setUserProfile(profileData[0]);
        }

        // Fetch user posts
        const { data: postsData, error: postsError } = await supabase
          .from("Posts")
          .select("id, title, description, images, created_at, likes_count, comments_count")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20);

        if (postsError) {
          console.error("Error fetching user posts:", postsError);
        } else if (postsData) {
          setUserPosts(postsData);
        }

        // Check friendship and follow status
        if (user && user.id !== userId) {
          // Check if friend
          const { data: friendData } = await supabase
            .from("friends")
            .select("id")
            .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`)
            .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
            .eq("status", "accepted")
            .single();

          setIsFriend(!!friendData);

          // Check if following
          const { data: followData } = await supabase
            .from("follows")
            .select("id")
            .eq("follower_id", user.id)
            .eq("following_id", userId)
            .single();

          setIsFollowing(!!followData);
        }

        // Get friends count
        const { count: friendsCount } = await supabase
          .from("friends")
          .select("*", { count: "exact", head: true })
          .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
          .eq("status", "accepted");

        setFriendsCount(friendsCount || 0);

        // Get followers count
        const { count: followersCount } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", userId);

        setFollowersCount(followersCount || 0);

      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleAddFriend = async () => {
    if (!currentUserId || currentUserId === userId) return;

    setIsAddingFriend(true);
    try {
      const { error } = await supabase
        .from("friends")
        .insert({
          user_id: currentUserId,
          friend_id: userId,
          status: "pending"
        });

      if (error) throw error;
      toast.success("Friend request sent!");
    } catch (error) {
      console.error("Error adding friend:", error);
      toast.error("Failed to send friend request");
    } finally {
      setIsAddingFriend(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUserId || currentUserId === userId) return;

    setIsTogglingFollow(true);
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", userId);

        if (error) throw error;
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
        toast.success("Unfollowed successfully");
      } else {
        // Follow
        const { error } = await supabase
          .from("follows")
          .insert({
            follower_id: currentUserId,
            following_id: userId
          });

        if (error) throw error;
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
        toast.success("Followed successfully");
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast.error("Failed to update follow status");
    } finally {
      setIsTogglingFollow(false);
    }
  };

  const getAvatarUrl = () => {
    if (userProfile?.custom_avatar_url) return userProfile.custom_avatar_url;
    if (userProfile?.avatar_url?.includes("googleusercontent.com")) {
      return userProfile.avatar_url.replace("s96-c", "s400-c");
    }
    return userProfile?.avatar_url || null;
  };

  const getUserInitials = () => {
    const name = userProfile?.name || userProfile?.email || "User";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const getDisplayName = () => {
    return userProfile?.name || userProfile?.email?.split("@")[0] || "Anonymous User";
  };

  if (loading) {
    return (
      <div className="relative min-h-screen font-poppins">
        <div className="fixed inset-0 -z-20">
          <DarkVeil />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-white/60 text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="relative min-h-screen font-poppins">
        <div className="fixed inset-0 -z-20">
          <DarkVeil />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-white/60 text-lg mb-4">User not found</div>
            <button
              onClick={() => navigate("/home")}
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

  const avatarUrl = getAvatarUrl();
  const displayName = getDisplayName();
  const userInitials = getUserInitials();
  const isOwnProfile = currentUserId === userId;

  return (
    <div className="relative min-h-screen font-poppins pb-20 md:pb-8">
      <div className="fixed inset-0 -z-20">
        <DarkVeil />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Profile Card */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] mb-6">
          <div className="absolute inset-px rounded-[1rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />

          <div className="relative p-6 sm:p-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-white/10 overflow-hidden flex-shrink-0">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-white text-3xl sm:text-4xl font-semibold">
                      {userInitials}
                    </span>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2 truncate">
                  {displayName}
                </h1>
                
                {/* Stats */}
                <div className="flex items-center justify-center sm:justify-start gap-6 mb-4 text-sm">
                  <div className="text-center">
                    <div className="text-white font-semibold text-lg">{userPosts.length}</div>
                    <div className="text-white/60">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold text-lg">{followersCount}</div>
                    <div className="text-white/60">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white font-semibold text-lg">{friendsCount}</div>
                    <div className="text-white/60">Friends</div>
                  </div>
                </div>

                {/* Bio */}
                {userProfile.bio && (
                  <p className="text-white/80 text-base mb-4 max-w-2xl">
                    {userProfile.bio}
                  </p>
                )}

                {/* User Details */}
                <div className="flex flex-col sm:flex-row items-center gap-3 text-white/60 text-sm mb-4">
                  {userProfile.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate max-w-[200px]">{userProfile.email}</span>
                    </div>
                  )}
                  {userProfile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{userProfile.location}</span>
                    </div>
                  )}
                  {userProfile.created_at && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {dayjs(userProfile.created_at).format("MMMM YYYY")}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!isOwnProfile && currentUserId && (
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleFollow}
                      disabled={isTogglingFollow}
                      className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        isFollowing
                          ? "bg-white/10 border border-white/20 text-white hover:bg-white/20"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                      }`}
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>{isTogglingFollow ? "Loading..." : isFollowing ? "Following" : "Follow"}</span>
                    </button>

                    {!isFriend && (
                      <button
                        onClick={handleAddFriend}
                        disabled={isAddingFriend}
                        className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>{isAddingFriend ? "Sending..." : "Add Friend"}</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="mb-6">
          <h2 className="text-white font-semibold text-xl mb-4">Posts</h2>
          
          {userPosts.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              No posts yet
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigate(`/post/${post.id}`)}
                  className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] transition-all hover:border-white/20 hover:shadow-[0_15px_50px_-10px_rgba(0,0,0,0.8)] cursor-pointer"
                >
                  <div className="absolute inset-px rounded-[0.6rem] bg-gradient-to-b from-white/5 to-white/0 pointer-events-none" />

                  <div className="relative p-5">
                    {/* Post Image */}
                    {post.images && post.images.length > 0 && (
                      <div className="mb-3 rounded-lg overflow-hidden aspect-video bg-white/5">
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Post Title */}
                    <h3 className="text-white font-semibold text-base mb-2 line-clamp-2">
                      {post.title}
                    </h3>

                    {/* Post Description */}
                    <p className="text-white/70 text-sm mb-3 line-clamp-2">
                      {post.description}
                    </p>

                    {/* Post Footer */}
                    <div className="flex items-center justify-between text-white/50 text-xs">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Heart className="h-3.5 w-3.5" />
                          <span>{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{post.comments_count || 0}</span>
                        </div>
                      </div>
                      <span>{dayjs(post.created_at).fromNow()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomBar />
    </div>
  );
};

export default UserProfilePage;
