import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";
import PageWrapper from "@/components/PageWrapper";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <PageWrapper showFooter={false}>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="w-24 h-24 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto"
          >
            <AlertCircle className="w-12 h-12 text-primary" />
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-6xl font-display font-bold text-primary neon-text">404</h1>
            <p className="text-xl text-muted-foreground">Page not found</p>
          </div>

          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Button 
            onClick={() => setLocation("/")}
            className="neon-glow bg-primary hover:bg-primary/90"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
