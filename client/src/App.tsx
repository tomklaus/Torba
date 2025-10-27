import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import RegistrationFlow from "@/pages/registration/RegistrationFlow";
import ProfilePage from "@/pages/profile";
import EditProfilePage from "@/pages/edit-profile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/register" component={RegistrationFlow} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/profile/edit" component={EditProfilePage} />
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
