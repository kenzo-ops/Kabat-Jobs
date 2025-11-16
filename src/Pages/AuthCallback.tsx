import { useEffect } from "react";
import { useNavigate } from "react-router";
import supabase from "@/supabase-client";

const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleOAuth = async () => {
      // di v2, gunakan supabase.auth.getSession()
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error.message);
        return;
      }

      if (!session) {
        console.warn("No session found. User not logged in.");
        return;
      }

      console.log("Logged in user:", session.user);

      // redirect ke home
      navigate("/home");
    };

    handleOAuth();
  }, [navigate]);

  return <div>Logging in…</div>;
};

export default AuthCallbackPage;
