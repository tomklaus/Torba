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
  Camera, Info, Phone, Globe, DollarSign, Shield,
  Sparkles, Activity, Languages, Mail, Clock, Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EditableText, EditableNumber, EditableBadgeList } from "@/components/EditableField";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Profile } from "@shared/schema";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

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

  // Update field mutation
  const updateFieldMutation = useMutation({
    mutationFn: async (data: Partial<Profile>) => {
      return await apiRequest("PATCH", `/api/profiles/${userId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${userId}`] });
      toast({
        title: "Збережено",
        description: "Поле успішно оновлено",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося зберегти",
        variant: "destructive",
      });
    },
  });

  const handleFieldSave = (fieldName: string, value: any) => {
    updateFieldMutation.mutate({ [fieldName]: value });
  };

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

  const isCommerce = profile.commerceType === "yes" || profile.commerceType === "commerce_only";
  const age = new Date().getFullYear() - new Date(profile.birthDate).getFullYear();

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
            data-testid="button-edit-profile"
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-5 w-5" />
                Завершити
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {profile.name}, {age}
            </h1>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {userEmail}
              </Badge>
              {isCommerce && (
                <Badge variant="default" className="text-sm bg-gradient-to-r from-purple-500 to-blue-500">
                  <DollarSign className="h-3 w-3 mr-1" />
                  Комерційний профіль
                </Badge>
              )}
            </div>
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
                  <EditableText
                    value={profile.customCity || profile.city || ""}
                    onSave={(value) => handleFieldSave("customCity", value)}
                    isEditing={isEditing}
                    placeholder="Місто"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(profile.birthDate).toLocaleDateString('uk-UA')}</span>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <EditableNumber
                      value={profile.height || 0}
                      onSave={(value) => handleFieldSave("height", value)}
                      isEditing={isEditing}
                      placeholder="Зріст"
                      min={100}
                      max={250}
                      unit="см"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <EditableNumber
                      value={profile.weight || 0}
                      onSave={(value) => handleFieldSave("weight", value)}
                      isEditing={isEditing}
                      placeholder="Вага"
                      min={40}
                      max={200}
                      unit="кг"
                    />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <EditableNumber
                      value={profile.penisSize || 0}
                      onSave={(value) => handleFieldSave("penisSize", value)}
                      isEditing={isEditing}
                      placeholder="Розмір"
                      min={5}
                      max={40}
                      unit="см"
                    />
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Тип тіла:</div>
                  <EditableBadgeList
                    values={profile.bodyType ? [profile.bodyType] : []}
                    onSave={(values) => handleFieldSave("bodyType", values[0] || "")}
                    isEditing={isEditing}
                    options={["Худий", "Атлетичний", "Середній", "М'язистий", "Кремезний", "Повний"]}
                    label="Тип тіла"
                    multiSelect={false}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Роль:</div>
                  <EditableBadgeList
                    values={profile.sexRole ? [profile.sexRole] : []}
                    onSave={(values) => handleFieldSave("sexRole", values[0] || "")}
                    isEditing={isEditing}
                    options={["Актив", "Пасив", "Універсал", "Сайд"]}
                    label="Сексуальна роль"
                    multiSelect={false}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Relationship & Lifestyle */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Стиль життя
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Статус стосунків:</span>
                  <EditableBadgeList
                    values={profile.relationshipStatus ? [profile.relationshipStatus] : []}
                    onSave={(values) => handleFieldSave("relationshipStatus", values[0] || "")}
                    isEditing={isEditing}
                    options={["Самотній", "У стосунках", "Одружений", "У відкритих стосунках", "Складно", "Не шукаю стосунків"]}
                    label="Статус"
                    multiSelect={false}
                  />
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">ВІЛ-статус:</span>
                  <EditableBadgeList
                    values={profile.hivStatus ? [profile.hivStatus] : []}
                    onSave={(values) => handleFieldSave("hivStatus", values[0] || "")}
                    isEditing={isEditing}
                    options={["Негативний", "Позитивний", "Невизначений", "Не розголошую"]}
                    label="ВІЛ-статус"
                    multiSelect={false}
                  />
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Алкоголь:</span>
                  <EditableBadgeList
                    values={profile.alcoholUse ? [profile.alcoholUse] : []}
                    onSave={(values) => handleFieldSave("alcoholUse", values[0] || "")}
                    isEditing={isEditing}
                    options={["Ніколи", "Рідко", "Інколи", "Часто"]}
                    label="Алкоголь"
                    multiSelect={false}
                  />
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Куріння:</span>
                  <EditableBadgeList
                    values={profile.smoking ? [profile.smoking] : []}
                    onSave={(values) => handleFieldSave("smoking", values[0] || "")}
                    isEditing={isEditing}
                    options={["Ніколи", "Рідко", "Інколи", "Часто"]}
                    label="Куріння"
                    multiSelect={false}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Additional Info */}
          <motion.div variants={cardVariants} className="lg:col-span-2 space-y-6">
            {/* Dating Goals */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Цілі знайомства
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EditableBadgeList
                  values={profile.datingGoals || []}
                  onSave={(values) => handleFieldSave("datingGoals", values)}
                  isEditing={isEditing}
                  options={["Дружба", "Спілкування", "Побачення", "Серйозні стосунки", "Секс", "Мережування"]}
                  label="Цілі знайомства"
                  multiSelect={true}
                />
              </CardContent>
            </Card>

            {/* About & Looking For */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    Про себе
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableText
                    value={profile.aboutMe || ""}
                    onSave={(value) => handleFieldSave("aboutMe", value)}
                    isEditing={isEditing}
                    multiline={true}
                    placeholder="Розкажіть про себе..."
                    maxLength={500}
                  />
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Шукаю
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableText
                    value={profile.lookingFor || ""}
                    onSave={(value) => handleFieldSave("lookingFor", value)}
                    isEditing={isEditing}
                    multiline={true}
                    placeholder="Кого ви шукаєте..."
                    maxLength={500}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Interests & Languages */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Інтереси
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableBadgeList
                    values={profile.interests || []}
                    onSave={(values) => handleFieldSave("interests", values)}
                    isEditing={isEditing}
                    options={["Спорт", "Музика", "Кіно", "Подорожі", "Книги", "Кулінарія", "Мистецтво", "Технології", "Мода", "Фотографія"]}
                    label="Інтереси"
                    multiSelect={true}
                  />
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Languages className="h-5 w-5 text-primary" />
                    Мови
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <EditableBadgeList
                    values={profile.languages || []}
                    onSave={(values) => handleFieldSave("languages", values)}
                    isEditing={isEditing}
                    options={["Українська", "Англійська", "Російська", "Польська", "Німецька", "Французька", "Іспанська"]}
                    label="Мови"
                    multiSelect={true}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Контакти
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Telegram:</span>
                  <EditableText
                    value={profile.telegram || ""}
                    onSave={(value) => handleFieldSave("telegram", value)}
                    isEditing={isEditing}
                    placeholder="@username"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Instagram:</span>
                  <EditableText
                    value={profile.instagram || ""}
                    onSave={(value) => handleFieldSave("instagram", value)}
                    isEditing={isEditing}
                    placeholder="@username"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Spotify:</span>
                  <EditableText
                    value={profile.spotify || ""}
                    onSave={(value) => handleFieldSave("spotify", value)}
                    isEditing={isEditing}
                    placeholder="@username"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">TikTok:</span>
                  <EditableText
                    value={profile.tiktok || ""}
                    onSave={(value) => handleFieldSave("tiktok", value)}
                    isEditing={isEditing}
                    placeholder="@username"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Twitter:</span>
                  <EditableText
                    value={profile.twitter || ""}
                    onSave={(value) => handleFieldSave("twitter", value)}
                    isEditing={isEditing}
                    placeholder="@username"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <EditableText
                    value={profile.contactEmail || ""}
                    onSave={(value) => handleFieldSave("contactEmail", value)}
                    isEditing={isEditing}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Телефон:</span>
                  <EditableText
                    value={profile.phoneNumber || ""}
                    onSave={(value) => handleFieldSave("phoneNumber", value)}
                    isEditing={isEditing}
                    placeholder="+380..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Commerce Settings */}
            {isCommerce && (
              <>
                {/* Financial */}
                {(profile.rate1h || profile.rate2h || profile.rateNight) && (
                  <Card className="border-primary/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Тарифи
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {profile.rate1h && (
                        <div className="text-center p-3 bg-card rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">1 година</p>
                          <p className="text-2xl font-bold text-primary">{profile.rate1h} ₴</p>
                        </div>
                      )}
                      {profile.rate2h && (
                        <div className="text-center p-3 bg-card rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">2 години</p>
                          <p className="text-2xl font-bold text-primary">{profile.rate2h} ₴</p>
                        </div>
                      )}
                      {profile.rateNight && (
                        <div className="text-center p-3 bg-card rounded-lg border">
                          <p className="text-sm text-muted-foreground mb-1">Ніч</p>
                          <p className="text-2xl font-bold text-primary">{profile.rateNight} ₴</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Service Details & Commerce Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.serviceFormats && profile.serviceFormats.length > 0 && (
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-base">Формати послуг</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 flex-wrap">
                          {profile.serviceFormats.map((format: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {format}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {profile.commerceSexRole && (
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-base">Комерційна роль</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="default">{profile.commerceSexRole}</Badge>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Location Formats & Travel */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.locationFormats && profile.locationFormats.length > 0 && (
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-base">Формати локації</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 flex-wrap">
                          {profile.locationFormats.map((loc: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {loc}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {profile.travelGeography && profile.travelGeography.length > 0 && (
                    <Card className="border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-base">Географія поїздок</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2 flex-wrap">
                          {profile.travelGeography.map((place: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {place}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Availability & Conditions */}
                {(profile.availability?.length || profile.minNotice || profile.meetingConditions?.length) && (
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Графік та умови
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profile.availability && profile.availability.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Доступність:</p>
                          <div className="flex gap-2 flex-wrap">
                            {profile.availability.map((time: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {time}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {profile.minNotice && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Мінімальне попередження: </span>
                          <span>{profile.minNotice}</span>
                        </div>
                      )}
                      {profile.minDuration && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Мінімальна тривалість: </span>
                          <span>{profile.minDuration}</span>
                        </div>
                      )}
                      {profile.meetingConditions && profile.meetingConditions.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Умови зустрічі:</p>
                          <div className="flex gap-2 flex-wrap">
                            {profile.meetingConditions.map((cond: string, i: number) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {cond}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Safety & Health */}
                {(profile.healthSafety?.length || profile.lastStdTest || profile.myLimits || profile.photoVideoConsent || profile.comfortConditions) && (
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Безпека і здоров'я
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profile.healthSafety && profile.healthSafety.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Здоров'я та безпека:</p>
                          <div className="flex gap-2 flex-wrap">
                            {profile.healthSafety.map((item: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {profile.lastStdTest && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Останнє тестування: </span>
                          <span>{profile.lastStdTest}</span>
                        </div>
                      )}
                      {profile.photoVideoConsent && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Фото/відео: </span>
                          <Badge variant="outline" className="text-xs">{profile.photoVideoConsent}</Badge>
                        </div>
                      )}
                      {profile.myLimits && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Мої межі:</p>
                          <p className="text-sm whitespace-pre-wrap">{profile.myLimits}</p>
                        </div>
                      )}
                      {profile.comfortConditions && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Умови комфорту:</p>
                          <p className="text-sm whitespace-pre-wrap">{profile.comfortConditions}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Payment & Fees */}
                {(profile.paymentMethods?.length || profile.travelFee || profile.cancellationFee || profile.transportCosts) && (
                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        Оплата та додаткові збори
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {profile.paymentMethods && profile.paymentMethods.length > 0 && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Способи оплати:</p>
                          <div className="flex gap-2 flex-wrap">
                            {profile.paymentMethods.map((method: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {profile.travelFee && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Вартість виїзду: </span>
                          <span className="font-medium">{profile.travelFee} ₴</span>
                        </div>
                      )}
                      {profile.cancellationFee && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Штраф за скасування: </span>
                          <span className="font-medium">{profile.cancellationFee} ₴</span>
                        </div>
                      )}
                      {profile.transportCosts && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Транспортні витрати: </span>
                          <span>{profile.transportCosts}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Sexual Profile */}
            {(profile.sexExperience || profile.favoritePositions?.length || profile.favoriteActivities?.length || 
              profile.toysAccessories?.length || profile.fetishes?.length || profile.bdsmRoles?.length) && (
              <Card className="border-primary/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Сексуальний профіль
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Experience & Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.sexExperience && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Досвід:</p>
                        <Badge variant="secondary">{profile.sexExperience}</Badge>
                      </div>
                    )}
                    {profile.condomAttitude && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Презервативи:</p>
                        <Badge variant="secondary">{profile.condomAttitude}</Badge>
                      </div>
                    )}
                    {profile.circumcision && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Обрізання:</p>
                        <Badge variant="secondary">{profile.circumcision}</Badge>
                      </div>
                    )}
                    {profile.sexFrequency && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Бажана частота:</p>
                        <Badge variant="secondary">{profile.sexFrequency}</Badge>
                      </div>
                    )}
                    {profile.groupSex && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Груповий секс:</p>
                        <Badge variant="secondary">{profile.groupSex}</Badge>
                      </div>
                    )}
                    {profile.substancesAttitude && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Речовини:</p>
                        <Badge variant="secondary">{profile.substancesAttitude}</Badge>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Multi-select fields */}
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

                  {profile.favoriteActivities && profile.favoriteActivities.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Улюблені активності:</p>
                      <div className="flex gap-2 flex-wrap">
                        {profile.favoriteActivities.map((act: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {act}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.toysAccessories && profile.toysAccessories.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Іграшки/Аксесуари:</p>
                      <div className="flex gap-2 flex-wrap">
                        {profile.toysAccessories.map((toy: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {toy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.meetingPlaces && profile.meetingPlaces.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Місце зустрічі:</p>
                      <div className="flex gap-2 flex-wrap">
                        {profile.meetingPlaces.map((place: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {place}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.afterSex && profile.afterSex.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Після сексу:</p>
                      <div className="flex gap-2 flex-wrap">
                        {profile.afterSex.map((after: string, i: number) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {after}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.fetishes && profile.fetishes.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Фетиші/вподобання:</p>
                      <div className="flex gap-2 flex-wrap">
                        {profile.fetishes.map((fetish: string, i: number) => (
                          <Badge key={i} variant="default" className="text-xs bg-gradient-to-r from-purple-500 to-pink-500">
                            {fetish}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {profile.bdsmRoles && profile.bdsmRoles.length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Роль у BDSM:</p>
                      <div className="flex gap-2 flex-wrap">
                        {profile.bdsmRoles.map((role: string, i: number) => (
                          <Badge key={i} variant="default" className="text-xs bg-gradient-to-r from-purple-600 to-blue-600">
                            {role}
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
      </motion.div>
    </div>
  );
}
