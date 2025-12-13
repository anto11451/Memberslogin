import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Lock, ArrowLeft, Shield, AlertCircle } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";

const ADMIN_PASSWORD = "CapAdmin2025";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    await new Promise(resolve => setTimeout(resolve, 500));

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem("adminLoggedIn", "true");
      setLocation("/admin");
    } else {
      setError("Incorrect password. Try again.");
    }
    setIsLoading(false);
  };

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <Card className="bg-card/80 backdrop-blur-sm border border-primary/30 neon-border overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            
            <CardHeader className="relative text-center space-y-4">
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Shield className="w-8 h-8 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-display">Admin Login</CardTitle>
              <CardDescription>
                Enter your admin password to access the dashboard
              </CardDescription>
            </CardHeader>

            <CardContent className="relative">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Enter Admin Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
                    />
                  </div>
                </div>

                {error && (
                  <motion.div 
                    className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}

                <Button 
                  type="submit" 
                  className="w-full neon-glow bg-primary hover:bg-primary/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full hover:bg-muted/50"
                  onClick={() => setLocation("/")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
