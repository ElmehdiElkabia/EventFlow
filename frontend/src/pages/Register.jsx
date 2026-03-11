import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const passwordChecks = (pwd) => ({
  length: pwd.length >= 8,
  uppercase: /[A-Z]/.test(pwd),
  lowercase: /[a-z]/.test(pwd),
  number: /[0-9]/.test(pwd),
  special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("attendee");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const checks = passwordChecks(password);
  const allChecksPassed = checks.length && checks.uppercase && checks.lowercase && checks.number && checks.special;

  const validateEmail = (value) => {
    if (!value) return "Email is required";
    if (!emailRegex.test(value)) return "Enter a valid email (e.g. you@gmail.com)";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    if (emailErr) {
      setEmailError(emailErr);
      return;
    }

    if (!allChecksPassed) {
      toast.error("Password must be 8+ characters with uppercase and lowercase letters");
      return;
    }

    // Validate passwords match
    if (password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await register({ name, email, password, password_confirmation: passwordConfirmation, role });
      toast.success("Account created successfully! Please check your email to verify your account.", {
        duration: 5000,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed");
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.email?.[0] || 
                          "Registration failed. Please try again.";
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
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground">Create Account</CardTitle>
            <CardDescription>Join EventFlow and start exploring events</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 bg-background/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(validateEmail(e.target.value));
                    }}
                    className={`pl-10 bg-background/50 ${emailError ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    required
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-red-400">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="space-y-1 pt-1">
                  <p className={`text-xs flex items-center gap-1 ${checks.length ? "text-green-400" : "text-muted-foreground"}`}>
                    <span>{checks.length ? "✓" : "○"}</span> At least 8 characters
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${checks.uppercase ? "text-green-400" : "text-muted-foreground"}`}>
                    <span>{checks.uppercase ? "✓" : "○"}</span> At least one uppercase letter (A–Z)
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${checks.lowercase ? "text-green-400" : "text-muted-foreground"}`}>
                    <span>{checks.lowercase ? "✓" : "○"}</span> At least one lowercase letter (a–z)
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${checks.number ? "text-green-400" : "text-muted-foreground"}`}>
                    <span>{checks.number ? "✓" : "○"}</span> At least one number (0–9)
                  </p>
                  <p className={`text-xs flex items-center gap-1 ${checks.special ? "text-green-400" : "text-muted-foreground"}`}>
                    <span>{checks.special ? "✓" : "○"}</span> At least one special character (!@#$%^&amp;*...)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password_confirmation"
                    type={showPasswordConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    className="pl-10 pr-10 bg-background/50"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswordConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label>I want to</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("attendee")}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      role === "attendee"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background/50 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium">Attend Events</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("organizer")}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      role === "organizer"
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background/50 text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <span className="font-medium">Organize Events</span>
                  </button>
                </div>
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
