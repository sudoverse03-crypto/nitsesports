import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase.js";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data?.session) {
        toast.error("Login failed. Please try again.");
        navigate("/login", { replace: true });
        return;
      }

      const redirect =
        sessionStorage.getItem("post_login_redirect") || "/events";

      sessionStorage.removeItem("post_login_redirect");

      toast.success("Signed in successfully");
      navigate(redirect, { replace: true });
    };

    handleAuth();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p>Finishing login...</p>
    </div>
  );
}
