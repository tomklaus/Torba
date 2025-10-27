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
  Sparkles, Activity, Languages, Mail, Clock, Save,
  Trash2, ImagePlus, Lock
} from "lucide-react";
import { 
  SiTelegram, SiInstagram, SiSpotify, SiTiktok, 
  SiX 
} from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { EditableText, EditableNumber, EditableBadgeList } from "@/components/EditableField";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Profile } from "@shared/schema";
import { 
  valuesToLabels, 
  labelsToValues, 
  getAllLabels, 
  valueToLabel 
} from "@/lib/optionsMappers";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingPrivatePhotos, setUploadingPrivatePhotos] = useState(false);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullscreenPhotoIndex, setFullscreenPhotoIndex] = useState(0);

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

  // Combine public and private photos with metadata
  const allPhotos: Array<{ url: string; isPrivate: boolean }> = [
    ...(profile.publicPhotos || []).map(photo => ({ url: typeof photo === 'string' ? photo : photo.url, isPrivate: false })),
    ...(profile.privatePhotos || []).map(photo => ({ url: typeof photo === 'string' ? photo : photo.url, isPrivate: true })),
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
              <Badge variant="secondary" className="text-sm md:text-base">
                {userEmail}
              </Badge>
              {isCommerce && (
                <Badge variant="default" className="text-sm md:text-base bg-gradient-to-r from-purple-500 to-blue-500">
                  <DollarSign className="h-4 w-4 mr-1" />
                  Комерційний профіль
                </Badge>
              )}
            </div>
          </div>
        </motion.div>

        {/* Desktop 2-column / Mobile 1-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Photos + Basic Info */}
          <motion.div variants={cardVariants} className="lg:col-span-1 space-y-4">
            {/* Photo Gallery */}
            <Card className="overflow-hidden border-2 border-primary/20 shadow-lg shadow-primary/10">
              <CardContent className="p-4">
                {allPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {allPhotos.map((photo, index) => (
                      <motion.div
                        key={photo.url}
                        className="relative aspect-square bg-muted rounded-md overflow-hidden cursor-pointer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          if (!isEditing) {
                            setFullscreenPhotoIndex(index);
                            setIsFullscreenOpen(true);
                          }
                        }}
                        data-testid={`photo-thumbnail-${index}`}
                      >
                        <img
                          src={photo.url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Private badge */}
                        {photo.isPrivate && (
                          <div className="absolute top-2 left-2 bg-pink-500/90 backdrop-blur-sm rounded-full p-1.5">
                            <Lock className="h-3 w-3 text-white" />
                          </div>
                        )}

                        {/* Delete button (in edit mode) */}
                        {isEditing && (
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="absolute top-2 right-2 bg-red-500/90 backdrop-blur-sm rounded-full p-1.5 text-white hover:bg-red-600"
                            onClick={() => {
                              // Remove from appropriate array without confirmation
                              if (photo.isPrivate) {
                                const newPrivate = (profile.privatePhotos || []).filter(p => 
                                  (typeof p === 'string' ? p : p.url) !== photo.url
                                );
                                handleFieldSave("privatePhotos", newPrivate);
                              } else {
                                const newPublic = (profile.publicPhotos || []).filter(p => 
                                  (typeof p === 'string' ? p : p.url) !== photo.url
                                );
                                handleFieldSave("publicPhotos", newPublic);
                              }
                            }}
                            data-testid={`button-delete-photo-${index}`}
                          >
                            <X className="h-4 w-4" />
                          </motion.button>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="aspect-square bg-muted flex items-center justify-center rounded-md">
                    <Camera className="h-16 w-16 text-muted-foreground opacity-50" />
                  </div>
                )}
              </CardContent>

              {/* Add Photo Button (in edit mode) */}
              {isEditing && (
                <div className="p-4 space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="photo-upload-input"
                    data-testid="input-photo-upload"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;

                      // Upload photos
                      const formData = new FormData();
                      Array.from(files).forEach(file => formData.append("photos", file));
                      formData.append("isPrivate", "false"); // Default to public

                      try {
                        setUploadingPhotos(true);
                        const response = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });
                        
                        if (!response.ok) throw new Error("Upload failed");
                        
                        const data = await response.json();
                        const newPhotoUrls = data.urls;

                        // Add to publicPhotos
                        const updatedPublic = [...(profile.publicPhotos || []), ...newPhotoUrls];
                        await handleFieldSave("publicPhotos", updatedPublic);
                        
                        setUploadingPhotos(false);
                        e.target.value = ""; // Reset input
                      } catch (error) {
                        console.error("Photo upload failed:", error);
                        setUploadingPhotos(false);
                        alert("Помилка завантаження фото");
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById("photo-upload-input")?.click()}
                    disabled={uploadingPhotos}
                    data-testid="button-add-photo"
                  >
                    <ImagePlus className="h-4 w-4 mr-2" />
                    {uploadingPhotos ? "Завантаження..." : "Додати публічні фото"}
                  </Button>
                  
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    id="private-photo-upload-input"
                    data-testid="input-private-photo-upload"
                    onChange={async (e) => {
                      const files = e.target.files;
                      if (!files || files.length === 0) return;

                      const formData = new FormData();
                      Array.from(files).forEach(file => formData.append("photos", file));
                      formData.append("isPrivate", "true");

                      try {
                        setUploadingPrivatePhotos(true);
                        const response = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });
                        
                        if (!response.ok) throw new Error("Upload failed");
                        
                        const data = await response.json();
                        const newPhotoUrls = data.urls;

                        const updatedPrivate = [...(profile.privatePhotos || []), ...newPhotoUrls];
                        await handleFieldSave("privatePhotos", updatedPrivate);
                        
                        setUploadingPrivatePhotos(false);
                        e.target.value = "";
                      } catch (error) {
                        console.error("Private photo upload failed:", error);
                        setUploadingPrivatePhotos(false);
                        alert("Помилка завантаження приватних фото");
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    className="w-full border-pink-500/50 text-pink-400"
                    onClick={() => document.getElementById("private-photo-upload-input")?.click()}
                    disabled={uploadingPrivatePhotos}
                    data-testid="button-add-private-photo"
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    {uploadingPrivatePhotos ? "Завантаження..." : "Додати приватні фото"}
                  </Button>
                </div>
              )}
            </Card>

            {/* Basic Info Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <User className="h-6 w-6 text-primary" />
                  Основна інформація
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-base">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <EditableText
                    value={profile.customCity ? `${profile.city} (${profile.customCity})` : (profile.city || "")}
                    onSave={(value) => handleFieldSave("customCity", value)}
                    isEditing={isEditing}
                    placeholder="Місто"
                  />
                </div>
                <div className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>{new Date(profile.birthDate).toLocaleDateString('uk-UA')}</span>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-3 text-base">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-muted-foreground" />
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
                    <Weight className="h-5 w-5 text-muted-foreground" />
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
                    <Activity className="h-5 w-5 text-muted-foreground" />
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
                  <div className="text-base text-muted-foreground">Тип тіла:</div>
                  <EditableBadgeList
                    values={profile.bodyType ? valuesToLabels("bodyType", [profile.bodyType]) : []}
                    onSave={(values) => handleFieldSave("bodyType", labelsToValues("bodyType", values)[0] || "")}
                    isEditing={isEditing}
                    options={getAllLabels("bodyType")}
                    label="Тип тіла"
                    multiSelect={false}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="text-base text-muted-foreground">Роль:</div>
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
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Heart className="h-6 w-6 text-primary" />
                  Стиль життя
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-base text-muted-foreground">Статус стосунків:</span>
                  <EditableBadgeList
                    values={profile.relationshipStatus ? valuesToLabels("relationshipStatus", [profile.relationshipStatus]) : []}
                    onSave={(values) => handleFieldSave("relationshipStatus", labelsToValues("relationshipStatus", values)[0] || "")}
                    isEditing={isEditing}
                    options={getAllLabels("relationshipStatus")}
                    label="Статус"
                    multiSelect={false}
                  />
                </div>
                <div>
                  <span className="text-base text-muted-foreground">ВІЛ-статус:</span>
                  <EditableBadgeList
                    values={profile.hivStatus ? valuesToLabels("hivStatus", [profile.hivStatus]) : []}
                    onSave={(values) => handleFieldSave("hivStatus", labelsToValues("hivStatus", values)[0] || "")}
                    isEditing={isEditing}
                    options={getAllLabels("hivStatus")}
                    label="ВІЛ-статус"
                    multiSelect={false}
                  />
                </div>
                <div>
                  <span className="text-base text-muted-foreground">Алкоголь:</span>
                  <EditableBadgeList
                    values={profile.alcoholUse ? valuesToLabels("alcoholUse", [profile.alcoholUse]) : []}
                    onSave={(values) => handleFieldSave("alcoholUse", labelsToValues("alcoholUse", values)[0] || "")}
                    isEditing={isEditing}
                    options={getAllLabels("alcoholUse")}
                    label="Алкоголь"
                    multiSelect={false}
                  />
                </div>
                <div>
                  <span className="text-base text-muted-foreground">Куріння:</span>
                  <EditableBadgeList
                    values={profile.smoking ? valuesToLabels("smoking", [profile.smoking]) : []}
                    onSave={(values) => handleFieldSave("smoking", labelsToValues("smoking", values)[0] || "")}
                    isEditing={isEditing}
                    options={getAllLabels("smoking")}
                    label="Куріння"
                    multiSelect={false}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Column: Additional Info */}
          <motion.div variants={cardVariants} className="lg:col-span-2 space-y-4">
            {/* Dating Goals */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
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
                  <CardTitle className="flex items-center gap-2 text-xl">
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
                  <CardTitle className="flex items-center gap-2 text-xl">
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
                  <CardTitle className="flex items-center gap-2 text-xl">
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
                  <CardTitle className="flex items-center gap-2 text-xl">
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


            {/* Commerce Settings - Unified */}
            {isCommerce && (
              <Card className="border-primary/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <DollarSign className="h-6 w-6 text-primary" />
                    Комерційна інформація
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Pricing */}
                  <div>
                    <h3 className="text-base font-medium mb-3">Тарифи</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="text-center p-3 bg-card rounded-lg border">
                        <p className="text-base text-muted-foreground mb-1">1 година</p>
                        <EditableNumber
                          value={profile.rate1h || 0}
                          onSave={(value) => handleFieldSave("rate1h", value)}
                          isEditing={isEditing}
                          placeholder="0"
                          min={0}
                          max={50000}
                          unit="₴"
                        />
                      </div>
                      <div className="text-center p-3 bg-card rounded-lg border">
                        <p className="text-base text-muted-foreground mb-1">2 години</p>
                        <EditableNumber
                          value={profile.rate2h || 0}
                          onSave={(value) => handleFieldSave("rate2h", value)}
                          isEditing={isEditing}
                          placeholder="0"
                          min={0}
                          max={50000}
                          unit="₴"
                        />
                      </div>
                      <div className="text-center p-3 bg-card rounded-lg border">
                        <p className="text-base text-muted-foreground mb-1">Ніч</p>
                        <EditableNumber
                          value={profile.rateNight || 0}
                          onSave={(value) => handleFieldSave("rateNight", value)}
                          isEditing={isEditing}
                          placeholder="0"
                          min={0}
                          max={50000}
                          unit="₴"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Service Formats & Commerce Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-base font-medium mb-2">Формати послуг</h3>
                      <EditableBadgeList
                        values={profile.serviceFormats || []}
                        onSave={(values) => handleFieldSave("serviceFormats", values)}
                        isEditing={isEditing}
                        options={["Онлайн", "Офлайн", "Супровід", "Масаж", "Фотосесії", "Відеоконтент"]}
                        label="Формати послуг"
                        multiSelect={true}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-medium mb-2">Комерційна роль</h3>
                      <EditableBadgeList
                        values={profile.commerceSexRole ? [profile.commerceSexRole] : []}
                        onSave={(values) => handleFieldSave("commerceSexRole", values[0] || "")}
                        isEditing={isEditing}
                        options={["Актив", "Пасив", "Універсал", "Сайд"]}
                        label="Роль"
                        multiSelect={false}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Location & Travel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-base font-medium mb-2">Формати локації</h3>
                      <EditableBadgeList
                        values={valuesToLabels("locationFormats", profile.locationFormats || [])}
                        onSave={(values) => handleFieldSave("locationFormats", labelsToValues("locationFormats", values))}
                        isEditing={isEditing}
                        options={getAllLabels("locationFormats")}
                        label="Локація"
                        multiSelect={true}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-medium mb-2">Географія поїздок</h3>
                      <EditableBadgeList
                        values={valuesToLabels("travelGeography", profile.travelGeography || [])}
                        onSave={(values) => handleFieldSave("travelGeography", labelsToValues("travelGeography", values))}
                        isEditing={isEditing}
                        options={getAllLabels("travelGeography")}
                        label="Поїздки"
                        multiSelect={true}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Schedule & Conditions */}
                  <div>
                    <h3 className="text-base font-medium mb-3">Графік та умови</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-base text-muted-foreground mb-2">Доступність:</p>
                        <EditableBadgeList
                          values={valuesToLabels("availability", profile.availability || [])}
                          onSave={(values) => handleFieldSave("availability", labelsToValues("availability", values))}
                          isEditing={isEditing}
                          options={getAllLabels("availability")}
                          label="Доступність"
                          multiSelect={true}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <span className="text-base text-muted-foreground">Мінімальне попередження:</span>
                          <EditableBadgeList
                            values={profile.minNotice ? valuesToLabels("minNotice", [profile.minNotice]) : []}
                            onSave={(values) => handleFieldSave("minNotice", labelsToValues("minNotice", values)[0] || "")}
                            isEditing={isEditing}
                            options={getAllLabels("minNotice")}
                            label="Попередження"
                            multiSelect={false}
                          />
                        </div>
                        <div>
                          <span className="text-base text-muted-foreground">Мінімальна тривалість:</span>
                          <EditableBadgeList
                            values={profile.minDuration ? valuesToLabels("minDuration", [profile.minDuration]) : []}
                            onSave={(values) => handleFieldSave("minDuration", labelsToValues("minDuration", values)[0] || "")}
                            isEditing={isEditing}
                            options={getAllLabels("minDuration")}
                            label="Тривалість"
                            multiSelect={false}
                          />
                        </div>
                      </div>
                      <div>
                        <p className="text-base text-muted-foreground mb-2">Умови зустрічі:</p>
                        <EditableBadgeList
                          values={profile.meetingConditions || []}
                          onSave={(values) => handleFieldSave("meetingConditions", values)}
                          isEditing={isEditing}
                          options={["Передоплата", "Готівка", "Переказ", "Верифікація", "Рекомендації"]}
                          label="Умови"
                          multiSelect={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Safety & Health */}
                  {(profile.healthSafety?.length || profile.lastStdTest || profile.myLimits || profile.photoVideoConsent || profile.comfortConditions) && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-base font-medium mb-3 flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          Безпека і здоров'я
                        </h3>
                        <div className="space-y-2">
                          {profile.healthSafety && profile.healthSafety.length > 0 && (
                            <div>
                              <p className="text-base text-muted-foreground mb-2">Здоров'я та безпека:</p>
                              <div className="flex gap-2 flex-wrap">
                                {profile.healthSafety.map((item: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="text-sm md:text-base">
                                    {item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {profile.lastStdTest && (
                            <div className="text-base">
                              <span className="text-muted-foreground">Останнє тестування: </span>
                              <span>{profile.lastStdTest}</span>
                            </div>
                          )}
                          {profile.photoVideoConsent && (
                            <div className="text-base">
                              <span className="text-muted-foreground">Фото/відео: </span>
                              <Badge variant="outline" className="text-sm md:text-base">{valueToLabel("photoVideoConsent", profile.photoVideoConsent)}</Badge>
                            </div>
                          )}
                          {profile.myLimits && (
                            <div>
                              <p className="text-base text-muted-foreground mb-1">Мої межі:</p>
                              <p className="text-base whitespace-pre-wrap">{profile.myLimits}</p>
                            </div>
                          )}
                          {profile.comfortConditions && (
                            <div>
                              <p className="text-base text-muted-foreground mb-1">Умови комфорту:</p>
                              <p className="text-base whitespace-pre-wrap">{profile.comfortConditions}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Payment & Fees */}
                  {(profile.paymentMethods?.length || (profile.travelFee && profile.travelFee > 0) || (profile.cancellationFee && profile.cancellationFee > 0) || profile.transportCosts) && (
                    <>
                      <Separator />
                      <div>
                        <h3 className="text-base font-medium mb-3">Оплата та додаткові збори</h3>
                        <div className="space-y-2">
                          {profile.paymentMethods && profile.paymentMethods.length > 0 && (
                            <div>
                              <p className="text-base text-muted-foreground mb-2">Способи оплати:</p>
                              <div className="flex gap-2 flex-wrap">
                                {profile.paymentMethods.map((method: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="text-sm md:text-base">
                                    {valueToLabel("paymentMethods", method)}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {profile.travelFee && profile.travelFee > 0 && (
                            <div className="text-base">
                              <span className="text-muted-foreground">Вартість виїзду: </span>
                              <span className="font-medium">{profile.travelFee} ₴</span>
                            </div>
                          )}
                          {profile.cancellationFee && profile.cancellationFee > 0 && (
                            <div className="text-base">
                              <span className="text-muted-foreground">Штраф за скасування: </span>
                              <span className="font-medium">{profile.cancellationFee} ₴</span>
                            </div>
                          )}
                          {profile.transportCosts && (
                            <div className="text-base">
                              <span className="text-muted-foreground">Транспортні витрати: </span>
                              <span>{valueToLabel("transportCosts", profile.transportCosts)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Sexual Profile */}
            {(profile.sexExperience || profile.favoritePositions?.length || profile.favoriteActivities?.length || 
              profile.toysAccessories?.length || profile.fetishes?.length || profile.bdsmRoles?.length) && (
              <Card className="border-primary/20 bg-gradient-to-br from-pink-500/5 to-purple-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Heart className="h-5 w-5 text-primary" />
                    Сексуальний профіль
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Experience & Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-base text-muted-foreground mb-2">Досвід:</p>
                      <EditableBadgeList
                        values={profile.sexExperience ? valuesToLabels("sexExperience", [profile.sexExperience]) : []}
                        onSave={(values) => handleFieldSave("sexExperience", labelsToValues("sexExperience", values)[0] || "")}
                        isEditing={isEditing}
                        options={getAllLabels("sexExperience")}
                        label="Досвід"
                        multiSelect={false}
                      />
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground mb-2">Презервативи:</p>
                      <EditableBadgeList
                        values={profile.condomAttitude ? valuesToLabels("condomAttitude", [profile.condomAttitude]) : []}
                        onSave={(values) => handleFieldSave("condomAttitude", labelsToValues("condomAttitude", values)[0] || "")}
                        isEditing={isEditing}
                        options={getAllLabels("condomAttitude")}
                        label="Презервативи"
                        multiSelect={false}
                      />
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground mb-2">Обрізання:</p>
                      <EditableBadgeList
                        values={profile.circumcision ? valuesToLabels("circumcision", [profile.circumcision]) : []}
                        onSave={(values) => handleFieldSave("circumcision", labelsToValues("circumcision", values)[0] || "")}
                        isEditing={isEditing}
                        options={getAllLabels("circumcision")}
                        label="Обрізання"
                        multiSelect={false}
                      />
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground mb-2">Бажана частота:</p>
                      <EditableBadgeList
                        values={profile.sexFrequency ? valuesToLabels("sexFrequency", [profile.sexFrequency]) : []}
                        onSave={(values) => handleFieldSave("sexFrequency", labelsToValues("sexFrequency", values)[0] || "")}
                        isEditing={isEditing}
                        options={getAllLabels("sexFrequency")}
                        label="Частота"
                        multiSelect={false}
                      />
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground mb-2">Груповий секс:</p>
                      <EditableBadgeList
                        values={profile.groupSex ? valuesToLabels("groupSex", [profile.groupSex]) : []}
                        onSave={(values) => handleFieldSave("groupSex", labelsToValues("groupSex", values)[0] || "")}
                        isEditing={isEditing}
                        options={getAllLabels("groupSex")}
                        label="Груповий секс"
                        multiSelect={false}
                      />
                    </div>
                    <div>
                      <p className="text-base text-muted-foreground mb-2">Речовини:</p>
                      <EditableBadgeList
                        values={profile.substancesAttitude ? valuesToLabels("substancesAttitude", [profile.substancesAttitude]) : []}
                        onSave={(values) => handleFieldSave("substancesAttitude", labelsToValues("substancesAttitude", values)[0] || "")}
                        isEditing={isEditing}
                        options={getAllLabels("substancesAttitude")}
                        label="Речовини"
                        multiSelect={false}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Multi-select fields */}
                  <div>
                    <p className="text-base text-muted-foreground mb-2">Улюблені пози:</p>
                    <EditableBadgeList
                      values={profile.favoritePositions ? valuesToLabels("favoritePositions", profile.favoritePositions) : []}
                      onSave={(values) => handleFieldSave("favoritePositions", labelsToValues("favoritePositions", values))}
                      isEditing={isEditing}
                      options={getAllLabels("favoritePositions")}
                      label="Пози"
                      multiSelect={true}
                    />
                  </div>

                  <div>
                    <p className="text-base text-muted-foreground mb-2">Улюблені активності:</p>
                    <EditableBadgeList
                      values={profile.favoriteActivities ? valuesToLabels("favoriteActivities", profile.favoriteActivities) : []}
                      onSave={(values) => handleFieldSave("favoriteActivities", labelsToValues("favoriteActivities", values))}
                      isEditing={isEditing}
                      options={getAllLabels("favoriteActivities")}
                      label="Активності"
                      multiSelect={true}
                    />
                  </div>

                  <div>
                    <p className="text-base text-muted-foreground mb-2">Іграшки/Аксесуари:</p>
                    <EditableBadgeList
                      values={profile.toysAccessories ? valuesToLabels("toysAccessories", profile.toysAccessories) : []}
                      onSave={(values) => handleFieldSave("toysAccessories", labelsToValues("toysAccessories", values))}
                      isEditing={isEditing}
                      options={getAllLabels("toysAccessories")}
                      label="Іграшки"
                      multiSelect={true}
                    />
                  </div>

                  <div>
                    <p className="text-base text-muted-foreground mb-2">Місце зустрічі:</p>
                    <EditableBadgeList
                      values={profile.meetingPlaces ? valuesToLabels("meetingPlaces", profile.meetingPlaces) : []}
                      onSave={(values) => handleFieldSave("meetingPlaces", labelsToValues("meetingPlaces", values))}
                      isEditing={isEditing}
                      options={getAllLabels("meetingPlaces")}
                      label="Місця"
                      multiSelect={true}
                    />
                  </div>

                  <div>
                    <p className="text-base text-muted-foreground mb-2">Після сексу:</p>
                    <EditableBadgeList
                      values={profile.afterSex ? valuesToLabels("afterSex", profile.afterSex) : []}
                      onSave={(values) => handleFieldSave("afterSex", labelsToValues("afterSex", values))}
                      isEditing={isEditing}
                      options={getAllLabels("afterSex")}
                      label="Після сексу"
                      multiSelect={true}
                    />
                  </div>

                  <div>
                    <p className="text-base text-muted-foreground mb-2">Фетиші/вподобання:</p>
                    <EditableBadgeList
                      values={profile.fetishes ? valuesToLabels("fetishes", profile.fetishes) : []}
                      onSave={(values) => handleFieldSave("fetishes", labelsToValues("fetishes", values))}
                      isEditing={isEditing}
                      options={getAllLabels("fetishes")}
                      label="Фетиші"
                      multiSelect={true}
                    />
                  </div>

                  <div>
                    <p className="text-base text-muted-foreground mb-2">Роль у BDSM:</p>
                    <EditableBadgeList
                      values={profile.bdsmRoles ? valuesToLabels("bdsmRoles", profile.bdsmRoles) : []}
                      onSave={(values) => handleFieldSave("bdsmRoles", labelsToValues("bdsmRoles", values))}
                      isEditing={isEditing}
                      options={getAllLabels("bdsmRoles")}
                      label="BDSM"
                      multiSelect={true}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Media Contacts - Bottom of Page */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Globe className="h-5 w-5 text-primary" />
                  Контакти
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-base">
                      <SiTelegram className="h-4 w-4 text-[#0088cc]" />
                      <span className="text-muted-foreground">Telegram:</span>
                      <EditableText
                        value={profile.telegram || ""}
                        onSave={(value) => handleFieldSave("telegram", value)}
                        isEditing={isEditing}
                        placeholder="@username"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <SiInstagram className="h-4 w-4 text-[#E4405F]" />
                      <span className="text-muted-foreground">Instagram:</span>
                      <EditableText
                        value={profile.instagram || ""}
                        onSave={(value) => handleFieldSave("instagram", value)}
                        isEditing={isEditing}
                        placeholder="@username"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <SiSpotify className="h-4 w-4 text-[#1DB954]" />
                      <span className="text-muted-foreground">Spotify:</span>
                      <EditableText
                        value={profile.spotify || ""}
                        onSave={(value) => handleFieldSave("spotify", value)}
                        isEditing={isEditing}
                        placeholder="@username"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <SiTiktok className="h-4 w-4" />
                      <span className="text-muted-foreground">TikTok:</span>
                      <EditableText
                        value={profile.tiktok || ""}
                        onSave={(value) => handleFieldSave("tiktok", value)}
                        isEditing={isEditing}
                        placeholder="@username"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <SiX className="h-4 w-4" />
                      <span className="text-muted-foreground">Twitter/X:</span>
                      <EditableText
                        value={profile.twitter || ""}
                        onSave={(value) => handleFieldSave("twitter", value)}
                        isEditing={isEditing}
                        placeholder="@username"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Email:</span>
                      <EditableText
                        value={profile.contactEmail || ""}
                        onSave={(value) => handleFieldSave("contactEmail", value)}
                        isEditing={isEditing}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-base">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Телефон:</span>
                      <EditableText
                        value={profile.phoneNumber || ""}
                        onSave={(value) => handleFieldSave("phoneNumber", value)}
                        isEditing={isEditing}
                        placeholder="+380..."
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-4 flex-wrap">
                    {profile.telegram && (
                      <a
                        href={`https://t.me/${profile.telegram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-elevate active-elevate-2 p-3 rounded-lg transition-all"
                        data-testid="link-telegram"
                      >
                        <SiTelegram className="h-8 w-8 text-[#0088cc]" />
                      </a>
                    )}
                    {profile.instagram && (
                      <a
                        href={`https://instagram.com/${profile.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-elevate active-elevate-2 p-3 rounded-lg transition-all"
                        data-testid="link-instagram"
                      >
                        <SiInstagram className="h-8 w-8 text-[#E4405F]" />
                      </a>
                    )}
                    {profile.spotify && (
                      <a
                        href={`https://open.spotify.com/user/${profile.spotify.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-elevate active-elevate-2 p-3 rounded-lg transition-all"
                        data-testid="link-spotify"
                      >
                        <SiSpotify className="h-8 w-8 text-[#1DB954]" />
                      </a>
                    )}
                    {profile.tiktok && (
                      <a
                        href={`https://tiktok.com/@${profile.tiktok.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-elevate active-elevate-2 p-3 rounded-lg transition-all"
                        data-testid="link-tiktok"
                      >
                        <SiTiktok className="h-8 w-8" />
                      </a>
                    )}
                    {profile.twitter && (
                      <a
                        href={`https://twitter.com/${profile.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover-elevate active-elevate-2 p-3 rounded-lg transition-all"
                        data-testid="link-twitter"
                      >
                        <SiX className="h-8 w-8" />
                      </a>
                    )}
                    {profile.contactEmail && (
                      <a
                        href={`mailto:${profile.contactEmail}`}
                        className="hover-elevate active-elevate-2 p-3 rounded-lg transition-all"
                        data-testid="link-email"
                      >
                        <Mail className="h-8 w-8 text-primary" />
                      </a>
                    )}
                    {profile.phoneNumber && (
                      <button
                        onClick={() => {
                          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                          if (isMobile) {
                            window.location.href = `tel:${profile.phoneNumber}`;
                          } else {
                            navigator.clipboard.writeText(profile.phoneNumber!).then(() => {
                              toast({
                                title: "Скопійовано",
                                description: `Номер ${profile.phoneNumber} скопійовано в буфер обміну`,
                              });
                            });
                          }
                        }}
                        className="hover-elevate active-elevate-2 p-3 rounded-lg transition-all"
                        data-testid="button-phone"
                      >
                        <Phone className="h-8 w-8 text-primary" />
                      </button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      {/* Fullscreen Photo Viewer */}
      <AnimatePresence>
        {isFullscreenOpen && allPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            onClick={(e) => {
              // Close if clicking on the background (not on the image)
              if (e.target === e.currentTarget) {
                setIsFullscreenOpen(false);
              }
            }}
            data-testid="fullscreen-viewer"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreenOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full p-3 transition-colors"
              data-testid="button-close-fullscreen"
            >
              <X className="h-6 w-6 text-white" />
            </button>

            {/* Photo Counter */}
            <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
              <span className="text-white text-sm font-medium">
                {fullscreenPhotoIndex + 1} / {allPhotos.length}
              </span>
            </div>

            {/* Private Badge */}
            {allPhotos[fullscreenPhotoIndex]?.isPrivate && (
              <div className="absolute top-20 left-4 z-10 bg-pink-500/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-2">
                <Lock className="h-4 w-4 text-white" />
                <span className="text-white text-sm font-medium">Приватне фото</span>
              </div>
            )}

            {/* Previous Button */}
            {allPhotos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenPhotoIndex((prev) => 
                    prev === 0 ? allPhotos.length - 1 : prev - 1
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full p-3 transition-colors"
                data-testid="button-prev-photo"
              >
                <ChevronLeft className="h-8 w-8 text-white" />
              </button>
            )}

            {/* Photo - clicking on left/right sides navigates */}
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Left click area */}
              {allPhotos.length > 1 && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1/3 cursor-w-resize z-[5]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenPhotoIndex((prev) => 
                      prev === 0 ? allPhotos.length - 1 : prev - 1
                    );
                  }}
                  data-testid="click-area-prev"
                />
              )}

              {/* Center image */}
              <motion.img
                key={fullscreenPhotoIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                src={allPhotos[fullscreenPhotoIndex]?.url}
                alt={`Photo ${fullscreenPhotoIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                data-testid="fullscreen-image"
              />

              {/* Right click area */}
              {allPhotos.length > 1 && (
                <div
                  className="absolute right-0 top-0 bottom-0 w-1/3 cursor-e-resize z-[5]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFullscreenPhotoIndex((prev) => 
                      prev === allPhotos.length - 1 ? 0 : prev + 1
                    );
                  }}
                  data-testid="click-area-next"
                />
              )}
            </div>

            {/* Next Button */}
            {allPhotos.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenPhotoIndex((prev) => 
                    prev === allPhotos.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full p-3 transition-colors"
                data-testid="button-next-photo"
              >
                <ChevronRight className="h-8 w-8 text-white" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
