import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { authService } from "@/services/authService";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const EmailVerificationBanner = () => {
  const { user } = useAuth();
  const [resending, setResending] = useState(false);

  // Don't show banner if email is already verified or user is not logged in
  if (!user || user.email_verified_at) {
    return null;
  }

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
    <Alert variant="warning" className="mb-6 text-foreground">
      <Mail className="h-4 w-4 text-foreground" />
      <AlertTitle>Verify your email address</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="flex-1">
          We've sent a verification link to <strong>{user.email}</strong>. 
          Please check your inbox and verify your email to access all features.
        </span>
        <Button
          onClick={handleResendVerification}
          variant="outline"
          size="sm"
          disabled={resending}
        >
          {resending ? (
            <>
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
              Sending...
            </>
          ) : (
            "Resend Email"
          )}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default EmailVerificationBanner;
