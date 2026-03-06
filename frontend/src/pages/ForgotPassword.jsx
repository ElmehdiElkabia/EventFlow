import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      console.error("Forgot password error:", error);
      const errorMessage = error.response?.data?.message || "Failed to send reset link. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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
          {!sent ? (
            <>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-foreground">Forgot Password?</CardTitle>
                <CardDescription>
                  Enter your email and we'll send you a link to reset your password
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background/50"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-muted-foreground">
                    Remember your password?{" "}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-foreground">Check Your Email</CardTitle>
                <CardDescription>
                  We've sent a password reset link to <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground text-center">
                    Click the link in the email to reset your password. If you don't see it, check your spam folder.
                  </p>
                </div>

                <Button
                  onClick={() => setSent(false)}
                  variant="outline"
                  className="w-full"
                >
                  Send Again
                </Button>

                <Button asChild variant="hero" className="w-full">
                  <Link to="/login">Back to Login</Link>
                </Button>
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
