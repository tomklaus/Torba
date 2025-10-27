import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  User, Heart, MapPin, Ruler, Weight, Calendar,
  Edit2, LogOut, ChevronLeft, ChevronRight, X,
  Camera, Info, Phone, Globe
} from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@shared/schema";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Check authentication
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  // Fetch profile
  const { data: profile, isLoading, error } = useQuery<Profile>({
    queryKey: [`/api/profiles/${userId}`],
    enabled: !!userId,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Logout failed");
      return await response.json();
    },
    onSuccess: () => {
      localStorage.clear();
      toast({
        title: "Вихід виконано",
        description: "До побачення!",
      });
      setLocation("/");
    },
    onError: () => {
      // Logout anyway on client side
      localStorage.clear();
      setLocation("/");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!userId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-blue-900/10 p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-[300px] w-full rounded-lg" />
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-blue-900/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Помилка</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Не вдалося завантажити профіль
            </p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              Повернутися
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Combine public and private photos
  const allPhotos = [
    ...(profile.publicPhotos || []),
    ...(profile.privatePhotos || []),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-blue-900/10">
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            size="lg"
            className="rounded-full shadow-lg shadow-primary/50 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            onClick={() => setIsEditing(!isEditing)}
            data-testid="button-toggle-edit"
          >
            {isEditing ? (
              <>
                <X className="mr-2 h-5 w-5" />
                Скасувати
              </>
            ) : (
              <>
                <Edit2 className="mr-2 h-5 w-5" />
                Редагувати
              </>
            )}
          </Button>
        </motion.div>
        
        <motion.div
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Button
            size="lg"
            variant="destructive"
            className="rounded-full shadow-lg"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            data-testid="button-logout"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Вийти
          </Button>
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        className="container mx-auto max-w-7xl p-4 pb-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={cardVariants} className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {profile.name}, {new Date().getFullYear() - new Date(profile.birthDate).getFullYear()}
            </h1>
            <Badge variant="secondary" className="text-sm">
              {userEmail}
            </Badge>
          </div>
        </motion.div>

        {/* Desktop 2-column / Mobile 1-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Photos + Basic Info */}
          <motion.div variants={cardVariants} className="lg:col-span-1 space-y-6">
            {/* Photo Gallery */}
            <Card className="overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10">
              <CardContent className="p-0">
                {allPhotos.length > 0 ? (
                  <div className="relative aspect-square bg-muted">
                    {/* Shimmer effect container */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
                    
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentPhotoIndex}
                        src={allPhotos[currentPhotoIndex].url}
                        alt={`Photo ${currentPhotoIndex + 1}`}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                          if (info.offset.x > 100 && currentPhotoIndex > 0) {
                            setCurrentPhotoIndex(currentPhotoIndex - 1);
                          } else if (info.offset.x < -100 && currentPhotoIndex < allPhotos.length - 1) {
                            setCurrentPhotoIndex(currentPhotoIndex + 1);
                          }
                        }}
                      />
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    {allPhotos.length > 1 && (
                      <>
                        {currentPhotoIndex > 0 && (
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover-elevate"
                            onClick={() => setCurrentPhotoIndex(currentPhotoIndex - 1)}
                            data-testid="button-photo-prev"
                          >
                            <ChevronLeft className="h-6 w-6" />
                          </motion.button>
                        )}
                        
                        {currentPhotoIndex < allPhotos.length - 1 && (
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover-elevate"
                            onClick={() => setCurrentPhotoIndex(currentPhotoIndex + 1)}
                            data-testid="button-photo-next"
                          >
                            <ChevronRight className="h-6 w-6" />
                          </motion.button>
                        )}
                        
                        {/* Photo counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                          {currentPhotoIndex + 1} / {allPhotos.length}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <Camera className="h-16 w-16 text-muted-foreground opacity-50" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Basic Info Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Основна інформація
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{profile.city}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(profile.birthDate).toLocaleDateString('uk-UA')}</span>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.height} см</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <span>{profile.weight} кг</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap mt-3">
                  <Badge variant="secondary">{profile.bodyType}</Badge>
                  <Badge variant="secondary">{profile.sexRole}</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Additional Info */}
          <motion.div variants={cardVariants} className="lg:col-span-2 space-y-6">
            {/* Dating Goals */}
            {profile.datingGoals && profile.datingGoals.length > 0 && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Цілі знайомства
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {profile.datingGoals.map((goal: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-sm">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* About */}
            {profile.aboutMe && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Про себе
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground whitespace-pre-wrap">{profile.aboutMe}</p>
                </CardContent>
              </Card>
            )}

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Інтереси</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    {profile.interests.map((interest: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            {(profile.telegram || profile.instagram || profile.contactEmail || profile.phoneNumber) && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Контакти
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {profile.telegram && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Telegram:</span>
                      <span className="font-medium">{profile.telegram}</span>
                    </div>
                  )}
                  {profile.instagram && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Instagram:</span>
                      <span className="font-medium">{profile.instagram}</span>
                    </div>
                  )}
                  {profile.contactEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium">{profile.contactEmail}</span>
                    </div>
                  )}
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Телефон:</span>
                      <span className="font-medium">{profile.phoneNumber}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Sexual Profile Preview (если заповнено) */}
            {(profile.sexExperience || profile.favoritePositions?.length) && (
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Сексуальний профіль</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.sexExperience && (
                    <div>
                      <span className="text-sm text-muted-foreground">Досвід: </span>
                      <Badge variant="secondary">{profile.sexExperience}</Badge>
                    </div>
                  )}
                  {profile.favoritePositions && profile.favoritePositions.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Улюблені пози:</p>
                      <div className="flex gap-2 flex-wrap">
                        {profile.favoritePositions.map((pos: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {pos}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>

        {/* Edit Mode Placeholder */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6"
            >
              <Card className="border-primary">
                <CardContent className="pt-6 text-center">
                  <Edit2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">
                    Режим редагування буде доступний в наступному етапі
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
