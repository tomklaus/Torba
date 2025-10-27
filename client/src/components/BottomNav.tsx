import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, MessageSquare, Bell, Settings, User, Edit2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function BottomNav() {
  const [location, setLocation] = useLocation();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const { toast } = useToast();
  const isOnProfile = location === "/profile";

  useEffect(() => {
    setShowSettingsMenu(false);
  }, [location]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        localStorage.clear();
        setLocation("/");
        toast({
          title: "Вихід виконано",
          description: "До побачення! 👋",
        });
      }
    } catch (error) {
      localStorage.clear();
      setLocation("/");
    }
  };

  const handleEdit = () => {
    const editButton = document.querySelector('[data-testid="button-edit-profile"]') as HTMLButtonElement;
    if (editButton) {
      editButton.click();
    } else {
      toast({
        title: "Помилка",
        description: "Не вдалося перейти в режим редагування",
        variant: "destructive",
      });
    }
    setShowSettingsMenu(false);
  };

  const navItems = [
    { icon: Home, label: "Стрічка", path: "/feed", testId: "nav-feed" },
    { icon: Search, label: "Пошук", path: "/search", testId: "nav-search" },
    { icon: MessageSquare, label: "Чат", path: "/chat", testId: "nav-chat" },
    { icon: Bell, label: "Активність", path: "/activity", testId: "nav-activity" },
  ];

  const isActive = (path: string) => location === path;

  return (
    <>
      {showSettingsMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSettingsMenu(false)}
        />
      )}
      
      <motion.nav 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border pb-safe"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="icon"
                className={`flex flex-col items-center justify-center gap-1 h-14 w-14 relative ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
                onClick={() => setLocation(item.path)}
                data-testid={item.testId}
              >
                <Icon className={`h-5 w-5 ${active ? "scale-110" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Button>
            );
          })}

          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className={`flex flex-col items-center justify-center gap-1 h-14 w-14 relative ${
                isOnProfile ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => {
                if (isOnProfile) {
                  setShowSettingsMenu(!showSettingsMenu);
                } else {
                  setLocation("/profile");
                }
              }}
              data-testid={isOnProfile ? "nav-settings" : "nav-profile"}
            >
              {isOnProfile ? (
                <Settings className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
              <span className="text-[10px] font-medium">
                {isOnProfile ? "Налаштування" : "Мій профіль"}
              </span>
              {isOnProfile && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Button>

            <AnimatePresence>
              {showSettingsMenu && isOnProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className="absolute bottom-full right-0 mb-2 w-48 bg-card border border-border rounded-md shadow-lg overflow-hidden z-50"
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-none h-12 text-base hover-elevate"
                    onClick={handleEdit}
                    data-testid="button-settings-edit"
                  >
                    <Edit2 className="h-4 w-4" />
                    Редагувати
                  </Button>
                  <div className="h-px bg-border" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-none h-12 text-base text-destructive hover:text-destructive hover-elevate"
                    onClick={handleLogout}
                    data-testid="button-settings-logout"
                  >
                    <LogOut className="h-4 w-4" />
                    Вийти
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </>
  );
}
