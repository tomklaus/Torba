import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Check, Loader2 } from "lucide-react";
import { z } from "zod";
import type { PhotoWithNsfw } from "@shared/schema";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import Step6 from "./Step6";
import Step7 from "./Step7";

// Схема валідації для всієї реєстрації
const registrationSchema = z.object({
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
  
  // Кроки 3-6 (комерційні, опціонально)
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
  
  // Крок 7 - PhotoWithNsfw objects (url + NSFW scores)
  publicPhotos: z.array(z.object({
    url: z.string(),
    drawingScore: z.number(),
    hentaiScore: z.number(),
    neutralScore: z.number(),
    pornScore: z.number(),
    sexyScore: z.number(),
  })).min(1, "Додайте хоча б 1 фото"),
  privatePhotos: z.array(z.object({
    url: z.string(),
    drawingScore: z.number(),
    hentaiScore: z.number(),
    neutralScore: z.number(),
    pornScore: z.number(),
    sexyScore: z.number(),
  })).default([]),
});

type RegistrationData = z.infer<typeof registrationSchema>;

export default function RegistrationFlow() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const form = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: "",
      birthDate: "",
      city: "",
      customCity: "",
      height: 170,
      weight: 70,
      penisSize: 15,
      sexRole: "",
      datingGoals: [],
      commerceType: "no",
      serviceFormats: [],
      commerceSexRole: "",
      locationFormats: [],
      travelGeography: [],
      availability: [],
      minNotice: "",
      minDuration: "",
      customDuration: "",
      meetingConditions: [],
      healthSafety: [],
      lastStdTest: "",
      photoVideoConsent: "",
      myLimits: "",
      comfortConditions: "",
      paymentMethods: [],
      transportCosts: "",
      publicPhotos: [],
      privatePhotos: [],
    },
    mode: "onChange",
  });

  const commerceType = form.watch("commerceType");
  const isCommerce = commerceType === "yes" || commerceType === "commerce_only";

  // Визначаємо загальну кількість кроків
  const totalSteps = isCommerce ? 7 : 3; // 1, 2, 7 якщо немає комерції; 1, 2, 3, 4, 5, 6, 7 якщо є

  // Функція для отримання номеру наступного кроку
  const getNextStep = (current: number) => {
    if (!isCommerce) {
      // Якщо не комерція: 1 -> 2 -> 7
      if (current === 1) return 2;
      if (current === 2) return 7;
    }
    return current + 1;
  };

  // Функція для отримання номеру попереднього кроку
  const getPrevStep = (current: number) => {
    if (!isCommerce && current === 7) return 2;
    return current - 1;
  };

  const handleNext = async () => {
    // Валідація поточного кроку
    let isValid = true;

    if (currentStep === 1) {
      const fields = ["name", "birthDate", "city", "height", "weight", "penisSize", "sexRole", "datingGoals"] as const;
      isValid = await form.trigger(fields);
    } else if (currentStep === 2) {
      isValid = await form.trigger("commerceType");
    } else if (currentStep === 7) {
      isValid = await form.trigger("publicPhotos");
    }

    if (!isValid) {
      return;
    }

    const nextStep = getNextStep(currentStep);
    if (nextStep <= 7) {
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    const prevStep = getPrevStep(currentStep);
    if (prevStep >= 1) {
      setCurrentStep(prevStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (data: RegistrationData) => {
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      setSubmitError("Помилка: не знайдено userId. Поверніться на сторінку входу.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Підготовка даних для API
      const profileData = {
        userId,
        name: data.name,
        birthDate: data.birthDate,
        city: data.city === "Інше" && data.customCity ? data.customCity : data.city,
        height: data.height,
        weight: data.weight,
        penisSize: data.penisSize,
        sexRole: data.sexRole,
        datingGoals: data.datingGoals,
        commerceType: data.commerceType,
        
        // Комерційні поля (якщо застосовується)
        serviceFormats: data.serviceFormats || [],
        commerceSexRole: data.commerceSexRole || null,
        locationFormats: data.locationFormats || [],
        travelGeography: data.travelGeography || [],
        availability: data.availability || [],
        minNotice: data.minNotice || null,
        minDuration: data.minDuration === "custom" ? data.customDuration : data.minDuration,
        meetingConditions: data.meetingConditions || [],
        healthSafety: data.healthSafety || [],
        lastStdTest: data.lastStdTest || null,
        photoVideoConsent: data.photoVideoConsent || null,
        myLimits: data.myLimits || null,
        comfortConditions: data.comfortConditions || null,
        rate1h: data.rate1h || null,
        rate2h: data.rate2h || null,
        rateNight: data.rateNight || null,
        travelFee: data.travelFee || null,
        cancellationFee: data.cancellationFee || null,
        paymentMethods: data.paymentMethods || [],
        transportCosts: data.transportCosts || null,
        
        // Фото
        publicPhotos: data.publicPhotos,
        privatePhotos: data.privatePhotos || [],
      };

      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Помилка створення профілю");
      }

      // Успішно створено профіль
      setLocation("/profile");
    } catch (err: any) {
      setSubmitError(err.message || "Помилка з'єднання з сервером");
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/10 via-background to-blue-900/10 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Крок {currentStep} з {totalSteps}
            </span>
            <span className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Card */}
        <Card className="border-card-border shadow-xl">
          <CardContent className="pt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                {currentStep === 1 && <Step1 form={form} />}
                {currentStep === 2 && <Step2 form={form} />}
                {currentStep === 3 && <Step3 form={form} />}
                {currentStep === 4 && <Step4 form={form} />}
                {currentStep === 5 && <Step5 form={form} />}
                {currentStep === 6 && <Step6 form={form} />}
                {currentStep === 7 && <Step7 form={form} />}
              </form>
            </Form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t pt-6">
            {submitError && (
              <div className="w-full p-3 bg-destructive/10 border border-destructive/30 rounded-md">
                <p className="text-sm text-destructive text-center" data-testid="text-submit-error">
                  {submitError}
                </p>
              </div>
            )}
            
            <div className="w-full flex gap-3 justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 1 || isSubmitting}
                className="min-w-32"
                data-testid="button-prev"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Назад
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="min-w-32 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  data-testid="button-next"
                >
                  Далі
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={async () => {
                    await form.handleSubmit(handleSubmit)();
                  }}
                  disabled={isSubmitting}
                  className="min-w-32 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  data-testid="button-complete"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Збереження...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Завершити
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
