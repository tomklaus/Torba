import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ServiceStatusProvider } from "@/components/ServiceStatusProvider";
import { ServiceStatusBanner } from "@/components/ServiceStatusBanner";
import { AnimatePresence, motion } from "framer-motion";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import RegistrationFlow from "@/pages/registration/RegistrationFlow";
import ProfilePage from "@/pages/profile";
import FeedPage from "@/pages/feed";
import SearchPage from "@/pages/search";
import ChatPage from "@/pages/chat";
import ActivityPage from "@/pages/activity";
import BottomNav from "@/components/BottomNav";

function AnimatedRoute({ component: Component, ...rest }: any) {
  return (
    <Route {...rest}>
      {(params) => (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Component {...params} />
        </motion.div>
      )}
    </Route>
  );
}

function Router() {
  const [location] = useLocation();
  const showBottomNav = !["/", "/register"].includes(location);

  return (
    <>
      <AnimatePresence mode="wait">
        <Switch location={location}>
          <Route path="/" component={LoginPage} />
          <Route path="/register" component={RegistrationFlow} />
          <AnimatedRoute path="/profile" component={ProfilePage} />
          <AnimatedRoute path="/feed" component={FeedPage} />
          <AnimatedRoute path="/search" component={SearchPage} />
          <AnimatedRoute path="/chat" component={ChatPage} />
          <AnimatedRoute path="/activity" component={ActivityPage} />
          <Route component={NotFound} />
        </Switch>
      </AnimatePresence>
      {showBottomNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ServiceStatusProvider>
        <TooltipProvider>
          <Toaster />
          <ServiceStatusBanner />
          <Router />
        </TooltipProvider>
      </ServiceStatusProvider>
    </QueryClientProvider>
  );
}

export default App;
