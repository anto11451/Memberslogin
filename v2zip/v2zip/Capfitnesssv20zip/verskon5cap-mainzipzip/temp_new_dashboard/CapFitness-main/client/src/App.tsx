import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Home from "@/pages/Home";
import Intake from "@/pages/Intake";
import Pricing from "@/pages/Pricing";
import About from "@/pages/About";
import Blog from "@/pages/Blog";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import BlogDetail from "@/pages/BlogDetail";
import Calculators from "@/pages/Calculators";
import Knowledge from "@/pages/Knowledge";
import Quiz from "@/pages/Quiz";
import NotFound from "@/pages/not-found";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/intake" component={Intake} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/about" component={About} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route path="/calculators" component={Calculators} />
      <Route path="/knowledge" component={Knowledge} />
      <Route path="/quiz" component={Quiz} />

      {/* ✅ These MUST come before NotFound */}
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />

      {/* ❗ Always put NotFound LAST */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
