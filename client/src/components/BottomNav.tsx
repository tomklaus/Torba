import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Home, Search, MessageSquare, Bell, Settings, User, Edit2, LogOut } from "lucide-react";
import { Button } from "@/components/MuiButton";
import { useToast } from "@/hooks/use-toast";
import { BottomNavigation, BottomNavigationAction, Paper, Menu, MenuItem, Backdrop, Divider } from "@mui/material";
import { Box } from "@mui/material";

export default function BottomNav() {
  const [location, setLocation] = useLocation();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const { toast } = useToast();
  const isOnProfile = location === "/profile";
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

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
    setMenuAnchorEl(null);
    setShowSettingsMenu(false);
  };

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isOnProfile) {
      setMenuAnchorEl(event.currentTarget);
      setShowSettingsMenu(true);
    } else {
      setLocation("/profile");
    }
  };

  const navItems = [
    { icon: Home, label: "Стрічка", path: "/feed", testId: "nav-feed" },
    { icon: Search, label: "Пошук", path: "/search", testId: "nav-search" },
    { icon: MessageSquare, label: "Чат", path: "/chat", testId: "nav-chat" },
    { icon: Bell, label: "Активність", path: "/activity", testId: "nav-activity" },
  ];

  const isActive = (path: string) => location === path;
  const navValue = navItems.findIndex(item => item.path === location);

  return (
    <>
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50 }}>
        <BottomNavigation
          value={navValue >= 0 ? navValue : false}
          onChange={(event, newValue) => {
            if (newValue < navItems.length) {
              setLocation(navItems[newValue].path);
            }
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            height: 64,
            gap: 1,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <BottomNavigationAction
                key={item.path}
                label={item.label}
                icon={<Icon style={{ width: 20, height: 20 }} />}
                onClick={() => setLocation(item.path)}
                data-testid={item.testId}
                sx={{
                  color: isActive(item.path) ? "primary.main" : "text.secondary",
                  fontSize: "0.625rem",
                  "& .MuiBottomNavigationAction-label": {
                    fontSize: "0.625rem",
                  },
                }}
              />
            );
          })}

          <Box sx={{ position: "relative" }}>
            <Button
              size="small"
              onClick={handleSettingsClick}
              data-testid={isOnProfile ? "nav-settings" : "nav-profile"}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.5,
                textTransform: "none",
                color: isOnProfile ? "primary.main" : "text.secondary",
                minWidth: "auto",
                padding: 1,
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              {isOnProfile ? (
                <Settings style={{ width: 20, height: 20 }} />
              ) : (
                <User style={{ width: 20, height: 20 }} />
              )}
              <span style={{ fontSize: "0.625rem" }}>
                {isOnProfile ? "Налаштування" : "Мій профіль"}
              </span>
            </Button>

            <Menu
              anchorEl={menuAnchorEl}
              open={showSettingsMenu && isOnProfile}
              onClose={() => {
                setShowSettingsMenu(false);
                setMenuAnchorEl(null);
              }}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <MenuItem
                onClick={handleEdit}
                data-testid="button-settings-edit"
              >
                <Edit2 style={{ width: 16, height: 16, marginRight: 12 }} />
                Редагувати
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={handleLogout}
                data-testid="button-settings-logout"
                sx={{ color: "error.main" }}
              >
                <LogOut style={{ width: 16, height: 16, marginRight: 12 }} />
                Вийти
              </MenuItem>
            </Menu>
          </Box>
        </BottomNavigation>
      </Paper>
    </>
  );
}
