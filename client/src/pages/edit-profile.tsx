import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Loader2, X } from "lucide-react";
import { z } from "zod";
import type { Profile } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Step1 from "./registration/Step1";
import Step2 from "./registration/Step2";
import Step3 from "./registration/Step3";
import Step4 from "./registration/Step4";
import Step5 from "./registration/Step5";
import Step6 from "./registration/Step6";
import Step7 from "./registration/Step7";
import Step8 from "./registration/Step8";
import Step9 from "./registration/Step9";
import Step10 from "./registration/Step10";

// Схема для редагування (така ж як registration, але фото опціональні)
const editProfileSchema = z.object({
  // Крок 1
  name: z.string().min(1, "Ім'я обов'язкове").max(50, "Максимум 50 символів"),
  birthDate: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18 && age <= 100;
  }, "Вік має бути від 18 до 100 років"),
  city: z.string().min(1, "Оберіть місто"),
  customCity: z.string().optional(),
  height: z.coerce.number().min(100, "Мінімум 100 см").max(250, "Максимум 250 см"),
  weight: z.coerce.number().min(30, "Мінімум 30 кг").max(300, "Максимум 300 кг"),
  penisSize: z.coerce.number().min(1, "Вкажіть розмір").max(50, "Максимум 50 см"),
  sexRole: z.string().min(1, "Оберіть роль"),
  datingGoals: z.array(z.string()).min(1, "Оберіть хоча б одну ціль"),
  
  // Крок 2
  commerceType: z.enum(["no", "yes", "commerce_only"]),
  
  // Кроки 3-6
  serviceFormats: z.array(z.string()).optional(),
  commerceSexRole: z.string().optional(),
  locationFormats: z.array(z.string()).optional(),
  travelGeography: z.array(z.string()).optional(),
  availability: z.array(z.string()).optional(),
  minNotice: z.string().optional(),
  minDuration: z.string().optional(),
  customDuration: z.string().optional(),
  meetingConditions: z.array(z.string()).optional(),
  healthSafety: z.array(z.string()).optional(),
  lastStdTest: z.string().optional(),
  photoVideoConsent: z.string().optional(),
  myLimits: z.string().optional(),
  comfortConditions: z.string().optional(),
  rate1h: z.coerce.number().optional(),
  rate2h: z.coerce.number().optional(),
  rateNight: z.coerce.number().optional(),
  travelFee: z.coerce.number().optional(),
  cancellationFee: z.coerce.number().optional(),
  paymentMethods: z.array(z.string()).optional(),
  transportCosts: z.string().optional(),
  
  // Крок 7 - фото тепер опціональні (можна залишити існуючі)
  publicPhotos: z.array(z.object({
    file: z.any().optional(),
    previewUrl: z.string(),
    url: z.string().optional(), // Existing photo URL from imgbb
  })).optional(),
  privatePhotos: z.array(z.object({
    file: z.any().optional(),
    previewUrl: z.string(),
    url: z.string().optional(),
  })).optional(),
  
  // Крок 8
  aboutMe: z.string().max(500, "Максимум 500 символів").optional(),
  lookingFor: z.string().max(500, "Максимум 500 символів").optional(),
  bodyType: z.string().optional(),
  relationshipStatus: z.string().optional(),
  interests: z.array(z.string()).optional(),
  hivStatus: z.string().optional(),
  alcoholUse: z.string().optional(),
  smoking: z.string().optional(),
  languages: z.array(z.string()).optional(),
  
  // Крок 9
  instagram: z.string().optional(),
  spotify: z.string().optional(),
  tiktok: z.string().optional(),
  telegram: z.string().optional(),
  twitter: z.string().optional(),
  contactEmail: z.string().email("Невірний формат email").or(z.literal("")).optional(),
  phoneNumber: z.string().optional(),
  
  // Крок 10
  sexExperience: z.string().optional(),
  condomAttitude: z.string().optional(),
  circumcision: z.string().optional(),
  favoritePositions: z.array(z.string()).optional(),
  sexFrequency: z.string().optional(),
  groupSex: z.string().optional(),
  substancesAttitude: z.string().optional(),
  favoriteActivities: z.array(z.string()).optional(),
  toysAccessories: z.array(z.string()).optional(),
  meetingPlaces: z.array(z.string()).optional(),
  afterSex: z.array(z.string()).optional(),
  fetishes: z.array(z.string()).optional(),
  bdsmRoles: z.array(z.string()).optional(),
});

type EditProfileData = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setLocation("/");
    }
  }, [userId, setLocation]);

  // Fetch existing profile
  const { data: profile, isLoading } = useQuery<Profile>({
    queryKey: [`/api/profiles/${userId}`],
    enabled: !!userId,
  });

  const form = useForm<EditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: profile ? {
      name: profile.name,
      birthDate: profile.birthDate,
      city: profile.city,
      customCity: profile.customCity || "",
      height: profile.height,
      weight: profile.weight,
      penisSize: profile.penisSize,
      sexRole: profile.sexRole,
      datingGoals: profile.datingGoals || [],
      commerceType: profile.commerceType as "no" | "yes" | "commerce_only",
      serviceFormats: profile.serviceFormats || [],
      commerceSexRole: profile.commerceSexRole || "",
      locationFormats: profile.locationFormats || [],
      travelGeography: profile.travelGeography || [],
      availability: profile.availability || [],
      minNotice: profile.minNotice || "",
      minDuration: profile.minDuration || "",
      customDuration: profile.customDuration || "",
      meetingConditions: profile.meetingConditions || [],
      healthSafety: profile.healthSafety || [],
      lastStdTest: profile.lastStdTest || "",
      photoVideoConsent: profile.photoVideoConsent || "",
      myLimits: profile.myLimits || "",
      comfortConditions: profile.comfortConditions || "",
      rate1h: profile.rate1h || undefined,
      rate2h: profile.rate2h || undefined,
      rateNight: profile.rateNight || undefined,
      travelFee: profile.travelFee || undefined,
      cancellationFee: profile.cancellationFee || undefined,
      paymentMethods: profile.paymentMethods || [],
      transportCosts: profile.transportCosts || "",
      publicPhotos: (profile.publicPhotos || []).map(p => ({
        previewUrl: p.url,
        url: p.url,
      })),
      privatePhotos: (profile.privatePhotos || []).map(p => ({
        previewUrl: p.url,
        url: p.url,
      })),
      aboutMe: profile.aboutMe || "",
      lookingFor: profile.lookingFor || "",
      bodyType: profile.bodyType || "",
      relationshipStatus: profile.relationshipStatus || "",
      interests: profile.interests || [],
      hivStatus: profile.hivStatus || "",
      alcoholUse: profile.alcoholUse || "",
      smoking: profile.smoking || "",
      languages: profile.languages || [],
      instagram: profile.instagram || "",
      spotify: profile.spotify || "",
      tiktok: profile.tiktok || "",
      telegram: profile.telegram || "",
      twitter: profile.twitter || "",
      contactEmail: profile.contactEmail || "",
      phoneNumber: profile.phoneNumber || "",
      sexExperience: profile.sexExperience || "",
      condomAttitude: profile.condomAttitude || "",
      circumcision: profile.circumcision || "",
      favoritePositions: profile.favoritePositions || [],
      sexFrequency: profile.sexFrequency || "",
      groupSex: profile.groupSex || "",
      substancesAttitude: profile.substancesAttitude || "",
      favoriteActivities: profile.favoriteActivities || [],
      toysAccessories: profile.toysAccessories || [],
      meetingPlaces: profile.meetingPlaces || [],
      afterSex: profile.afterSex || [],
      fetishes: profile.fetishes || [],
      bdsmRoles: profile.bdsmRoles || [],
    } : {},
  });

  // Reset form when profile loads
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name,
        birthDate: profile.birthDate,
        city: profile.city,
        customCity: profile.customCity || "",
        height: profile.height,
        weight: profile.weight,
        penisSize: profile.penisSize,
        sexRole: profile.sexRole,
        datingGoals: profile.datingGoals || [],
        commerceType: profile.commerceType as "no" | "yes" | "commerce_only",
        serviceFormats: profile.serviceFormats || [],
        commerceSexRole: profile.commerceSexRole || "",
        locationFormats: profile.locationFormats || [],
        travelGeography: profile.travelGeography || [],
        availability: profile.availability || [],
        minNotice: profile.minNotice || "",
        minDuration: profile.minDuration || "",
        customDuration: profile.customDuration || "",
        meetingConditions: profile.meetingConditions || [],
        healthSafety: profile.healthSafety || [],
        lastStdTest: profile.lastStdTest || "",
        photoVideoConsent: profile.photoVideoConsent || "",
        myLimits: profile.myLimits || "",
        comfortConditions: profile.comfortConditions || "",
        rate1h: profile.rate1h || undefined,
        rate2h: profile.rate2h || undefined,
        rateNight: profile.rateNight || undefined,
        travelFee: profile.travelFee || undefined,
        cancellationFee: profile.cancellationFee || undefined,
        paymentMethods: profile.paymentMethods || [],
        transportCosts: profile.transportCosts || "",
        publicPhotos: (profile.publicPhotos || []).map(p => ({
          previewUrl: p.url,
          url: p.url,
        })),
        privatePhotos: (profile.privatePhotos || []).map(p => ({
          previewUrl: p.url,
          url: p.url,
        })),
        aboutMe: profile.aboutMe || "",
        lookingFor: profile.lookingFor || "",
        bodyType: profile.bodyType || "",
        relationshipStatus: profile.relationshipStatus || "",
        interests: profile.interests || [],
        hivStatus: profile.hivStatus || "",
        alcoholUse: profile.alcoholUse || "",
        smoking: profile.smoking || "",
        languages: profile.languages || [],
        instagram: profile.instagram || "",
        spotify: profile.spotify || "",
        tiktok: profile.tiktok || "",
        telegram: profile.telegram || "",
        twitter: profile.twitter || "",
        contactEmail: profile.contactEmail || "",
        phoneNumber: profile.phoneNumber || "",
        sexExperience: profile.sexExperience || "",
        condomAttitude: profile.condomAttitude || "",
        circumcision: profile.circumcision || "",
        favoritePositions: profile.favoritePositions || [],
        sexFrequency: profile.sexFrequency || "",
        groupSex: profile.groupSex || "",
        substancesAttitude: profile.substancesAttitude || "",
        favoriteActivities: profile.favoriteActivities || [],
        toysAccessories: profile.toysAccessories || [],
        meetingPlaces: profile.meetingPlaces || [],
        afterSex: profile.afterSex || [],
        fetishes: profile.fetishes || [],
        bdsmRoles: profile.bdsmRoles || [],
      });
    }
  }, [profile, form]);

  const commerceType = form.watch("commerceType");
  const totalSteps = commerceType === "no" ? 7 : 10; // Skip steps 3-6 if no commerce
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    let fieldsToValidate: (keyof EditProfileData)[] = [];
    
    if (currentStep === 1) {
      fieldsToValidate = ["name", "birthDate", "city", "height", "weight", "penisSize", "sexRole", "datingGoals"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["commerceType"];
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }

    // Skip commerce steps if commerceType is "no"
    if (commerceType === "no") {
      if (currentStep === 2) {
        setCurrentStep(7); // Skip to photos
      } else if (currentStep >= 7) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (commerceType === "no" && currentStep === 7) {
      setCurrentStep(2); // Jump back to commerce type
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: EditProfileData) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // TODO: Handle photo upload for new photos
      // For now, just send existing photo URLs
      const payload = {
        ...data,
        publicPhotos: data.publicPhotos?.map(p => ({ url: p.url || p.previewUrl, nsfwTags: [] })) || [],
        privatePhotos: data.privatePhotos?.map(p => ({ url: p.url || p.previewUrl, nsfwTags: [] })) || [],
      };

      await apiRequest("PATCH", `/api/profiles/${userId}`, payload);
      
      await queryClient.invalidateQueries({ queryKey: [`/api/profiles/${userId}`] });
      
      toast({
        title: "Профіль оновлено",
        description: "Ваші зміни збережено успішно",
      });
      
      setLocation("/profile");
    } catch (error: any) {
      setSubmitError(error.message || "Помилка при збереженні профілю");
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося оновити профіль",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-blue-900/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardContent className="pt-6 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Завантаження профілю...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-blue-900/10 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Редагування профілю
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/profile")}
            data-testid="button-cancel-edit"
          >
            <X className="h-4 w-4 mr-2" />
            Скасувати
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Крок {currentStep} з {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardContent className="pt-6">
                {currentStep === 1 && <Step1 form={form} />}
                {currentStep === 2 && <Step2 form={form} />}
                {currentStep === 3 && <Step3 form={form} />}
                {currentStep === 4 && <Step4 form={form} />}
                {currentStep === 5 && <Step5 form={form} />}
                {currentStep === 6 && <Step6 form={form} />}
                {currentStep === 7 && <Step7 form={form} />}
                {currentStep === 8 && <Step8 form={form} />}
                {currentStep === 9 && <Step9 form={form} />}
                {currentStep === 10 && <Step10 form={form} />}
              </CardContent>

              <CardFooter className="flex justify-between gap-4 border-t pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isSubmitting}
                  data-testid="button-back"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Назад
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    data-testid="button-next"
                  >
                    Далі
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    data-testid="button-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Збереження...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Зберегти
                      </>
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>

            {submitError && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">{submitError}</p>
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
