-- ============================================
-- TABEL FRIENDS - Untuk sistem pertemanan
-- ============================================
CREATE TABLE IF NOT EXISTS friends (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  friend_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraint: user tidak bisa berteman dengan diri sendiri
  CONSTRAINT check_not_self_friend CHECK (user_id != friend_id),
  
  -- Constraint: kombinasi user_id dan friend_id harus unique
  CONSTRAINT unique_friendship UNIQUE (user_id, friend_id)
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_friends_user_id ON friends(user_id);
CREATE INDEX IF NOT EXISTS idx_friends_friend_id ON friends(friend_id);
CREATE INDEX IF NOT EXISTS idx_friends_status ON friends(status);

-- ============================================
-- TABEL FOLLOWS - Untuk sistem follow
-- ============================================
CREATE TABLE IF NOT EXISTS follows (
  id SERIAL PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraint: user tidak bisa follow diri sendiri
  CONSTRAINT check_not_self_follow CHECK (follower_id != following_id),
  
  -- Constraint: kombinasi follower_id dan following_id harus unique
  CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_follows_follower_id ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following_id ON follows(following_id);

-- ============================================
-- RPC FUNCTION: Get Friend Requests
-- ============================================
CREATE OR REPLACE FUNCTION get_friend_requests(p_user_id UUID)
RETURNS TABLE (
  id INTEGER,
  user_id UUID,
  friend_id UUID,
  status VARCHAR,
  created_at TIMESTAMPTZ,
  user_name TEXT,
  user_email TEXT,
  user_avatar_url TEXT,
  user_custom_avatar_url TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.user_id,
    f.friend_id,
    f.status,
    f.created_at,
    u.name::TEXT as user_name,
    u.email::TEXT as user_email,
    u.avatar_url::TEXT as user_avatar_url,
    u.custom_avatar_url::TEXT as user_custom_avatar_url
  FROM friends f
  LEFT JOIN users u ON u.id = f.user_id
  WHERE f.friend_id = p_user_id 
    AND f.status = 'pending'
  ORDER BY f.created_at DESC;
END;
$$;

-- ============================================
-- RPC FUNCTION: Get User Friends
-- ============================================
CREATE OR REPLACE FUNCTION get_user_friends(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  custom_avatar_url TEXT,
  friendship_date TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN f.user_id = p_user_id THEN u2.id
      ELSE u1.id
    END as id,
    CASE 
      WHEN f.user_id = p_user_id THEN u2.name::TEXT
      ELSE u1.name::TEXT
    END as name,
    CASE 
      WHEN f.user_id = p_user_id THEN u2.email::TEXT
      ELSE u1.email::TEXT
    END as email,
    CASE 
      WHEN f.user_id = p_user_id THEN u2.avatar_url::TEXT
      ELSE u1.avatar_url::TEXT
    END as avatar_url,
    CASE 
      WHEN f.user_id = p_user_id THEN u2.custom_avatar_url::TEXT
      ELSE u1.custom_avatar_url::TEXT
    END as custom_avatar_url,
    f.updated_at as friendship_date
  FROM friends f
  LEFT JOIN users u1 ON u1.id = f.user_id
  LEFT JOIN users u2 ON u2.id = f.friend_id
  WHERE (f.user_id = p_user_id OR f.friend_id = p_user_id)
    AND f.status = 'accepted'
  ORDER BY f.updated_at DESC;
END;
$$;

-- ============================================
-- RPC FUNCTION: Accept Friend Request
-- ============================================
CREATE OR REPLACE FUNCTION accept_friend_request(
  p_request_id INTEGER
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE friends 
  SET status = 'accepted', updated_at = NOW()
  WHERE id = p_request_id AND status = 'pending';
  
  IF FOUND THEN
    RETURN QUERY SELECT TRUE, 'Friend request accepted'::TEXT;
  ELSE
    RETURN QUERY SELECT FALSE, 'Friend request not found or already processed'::TEXT;
  END IF;
END;
$$;

-- ============================================
-- RPC FUNCTION: Reject Friend Request
-- ============================================
CREATE OR REPLACE FUNCTION reject_friend_request(
  p_request_id INTEGER
)
RETURNS TABLE (
  success BOOLEAN,
  message TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM friends 
  WHERE id = p_request_id AND status = 'pending';
  
  IF FOUND THEN
    RETURN QUERY SELECT TRUE, 'Friend request rejected'::TEXT;
  ELSE
    RETURN QUERY SELECT FALSE, 'Friend request not found'::TEXT;
  END IF;
END;
$$;

-- ============================================
-- RPC FUNCTION: Get User Followers
-- ============================================
CREATE OR REPLACE FUNCTION get_user_followers(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  custom_avatar_url TEXT,
  followed_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name::TEXT,
    u.email::TEXT,
    u.avatar_url::TEXT,
    u.custom_avatar_url::TEXT,
    f.created_at as followed_at
  FROM follows f
  LEFT JOIN users u ON u.id = f.follower_id
  WHERE f.following_id = p_user_id
  ORDER BY f.created_at DESC;
END;
$$;

-- ============================================
-- RPC FUNCTION: Get User Following
-- ============================================
CREATE OR REPLACE FUNCTION get_user_following(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  custom_avatar_url TEXT,
  followed_at TIMESTAMPTZ
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.name::TEXT,
    u.email::TEXT,
    u.avatar_url::TEXT,
    u.custom_avatar_url::TEXT,
    f.created_at as followed_at
  FROM follows f
  LEFT JOIN users u ON u.id = f.following_id
  WHERE f.follower_id = p_user_id
  ORDER BY f.created_at DESC;
END;
$$;

-- ============================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE friends ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES untuk FRIENDS
-- ============================================

-- Policy: Users can view their own friend relationships
CREATE POLICY "Users can view own friends"
  ON friends FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- Policy: Users can insert friend requests
CREATE POLICY "Users can send friend requests"
  ON friends FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their friend requests (accept/reject)
CREATE POLICY "Users can update friend status"
  ON friends FOR UPDATE
  USING (auth.uid() = friend_id);

-- Policy: Users can delete their friend requests
CREATE POLICY "Users can delete own friend requests"
  ON friends FOR DELETE
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

-- ============================================
-- RLS POLICIES untuk FOLLOWS
-- ============================================

-- Policy: Anyone can view follows (public)
CREATE POLICY "Anyone can view follows"
  ON follows FOR SELECT
  USING (true);

-- Policy: Users can follow others
CREATE POLICY "Users can follow others"
  ON follows FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

-- Policy: Users can unfollow
CREATE POLICY "Users can unfollow"
  ON follows FOR DELETE
  USING (auth.uid() = follower_id);

-- ============================================
-- TRIGGERS untuk auto update timestamp
-- ============================================

-- Trigger function untuk updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk friends table
DROP TRIGGER IF EXISTS update_friends_updated_at ON friends;
CREATE TRIGGER update_friends_updated_at
  BEFORE UPDATE ON friends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
