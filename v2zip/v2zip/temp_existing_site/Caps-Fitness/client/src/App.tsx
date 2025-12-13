import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import WorkoutsPage from "@/pages/WorkoutsPage";
import PlansPage from "@/pages/PlansPage";
import NutritionPage from "@/pages/NutritionPage";
import ProgressPage from "@/pages/ProgressPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminPage from "@/pages/AdminPage";
import BodyMapPage from "@/pages/BodyMapPage";
import StreakPage from "@/pages/StreakPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/workouts" component={WorkoutsPage} />
      <Route path="/plans" component={PlansPage} />
      <Route path="/nutrition" component={NutritionPage} />
      <Route path="/progress" component={ProgressPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/bodymap" component={BodyMapPage} />
      <Route path="/streak" component={StreakPage} />
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
