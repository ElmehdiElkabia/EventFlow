import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const VerifyEmail = () => {
  const { id, hash } = useParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (id && hash) {
      verifyEmail();
    }
  }, [id, hash]);

  const verifyEmail = async () => {
    try {
      const response = await authService.verifyEmail(id, hash);
      setStatus("success");
      setMessage(response.message || "Email verified successfully!");
      toast.success("Email verified successfully!");
      
      // Refresh user data to update email_verified_at
      await refreshUser();
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
      setMessage(error.response?.data?.message || "Verification failed. The link may be invalid or expired.");
      toast.error("Verification failed");
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      await authService.resendVerification();
      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Resend error:", error);
      toast.error(error.response?.data?.message || "Failed to resend verification email");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 dark">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-[80px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <Calendar className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">EventFlow</span>
        </Link>

        <Card variant="glass" className="border-border/50">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {status === "verifying" && (
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 text-primary animate-spin" />
                </div>
              )}
              {status === "success" && (
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
              )}
              {status === "error" && (
                <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-8 w-8 text-destructive" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl text-foreground">
              {status === "verifying" && "Verifying Email"}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </CardTitle>
            <CardDescription>{message || "Please wait while we verify your email..."}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "success" && (
              <div className="text-center space-y-4">
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm font-medium text-green-700 dark:text-green-400">
                    ✓ Your email has been successfully verified!
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    You now have full access to all features.
                  </p>
                </div>
                <Button asChild variant="hero" className="w-full" size="lg">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            )}

            {status === "error" && (
              <div className="text-center space-y-4">
                <Button
                  onClick={handleResendVerification}
                  variant="hero"
                  className="w-full"
                  disabled={resending}
                >
                  {resending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </div>
            )}

            {status === "verifying" && (
              <div className="text-center">
                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
