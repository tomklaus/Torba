import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Profile } from "@shared/schema";

const editSchema = z.object({
  aboutMe: z.string().max(500).optional(),
  lookingFor: z.string().max(500).optional(),
  relationshipStatus: z.string().optional(),
  bodyType: z.string().optional(),
  hivStatus: z.string().optional(),
  alcoholUse: z.string().optional(),
  smoking: z.string().optional(),
  interests: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  instagram: z.string().optional(),
  telegram: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

const INTERESTS_OPTIONS = [
  "Спорт", "Музика", "Кіно", "Подорожі", "Книги",
  "Кулінарія", "Мистецтво", "Технології", "Мода", "Фотографія"
];

const LANGUAGES_OPTIONS = [
  "Українська", "Англійська", "Російська", "Польська",
  "Німецька", "Французька", "Іспанська"
];

const RELATIONSHIP_STATUS = [
  "Самотній", "У стосунках", "Одружений", "У відкритих стосунках",
  "Складно", "Не шукаю стосунків"
];

const BODY_TYPES = [
  "Худий", "Атлетичний", "Середній", "М'язистий",
  "Кремезний", "Повний"
];

const HIV_STATUS = ["Негативний", "Позитивний", "Невизначений", "Не розголошую"];
const ALCOHOL_OPTIONS = ["Ніколи", "Рідко", "Інколи", "Часто"];
const SMOKING_OPTIONS = ["Ніколи", "Рідко", "Інколи", "Часто"];

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile;
  userId: string;
}

export function EditProfileDialog({ open, onOpenChange, profile, userId }: EditProfileDialogProps) {
  const { toast } = useToast();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests || []);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(profile.languages || []);

  const form = useForm<EditFormData>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      aboutMe: profile.aboutMe || "",
      lookingFor: profile.lookingFor || "",
      relationshipStatus: profile.relationshipStatus || "",
      bodyType: profile.bodyType || "",
      hivStatus: profile.hivStatus || "",
      alcoholUse: profile.alcoholUse || "",
      smoking: profile.smoking || "",
      interests: profile.interests || [],
      languages: profile.languages || [],
      instagram: profile.instagram || "",
      telegram: profile.telegram || "",
      phoneNumber: profile.phoneNumber || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: EditFormData) => {
      return await apiRequest("PATCH", `/api/profiles/${userId}`, {
        ...data,
        interests: selectedInterests,
        languages: selectedLanguages,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/profiles/${userId}`] });
      toast({
        title: "Профіль оновлено",
        description: "Ваші зміни успішно збережено",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Помилка",
        description: error.message || "Не вдалося оновити профіль",
        variant: "destructive",
      });
    },
  });

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (selectedLanguages.includes(lang)) {
      setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
    } else {
      setSelectedLanguages([...selectedLanguages, lang]);
    }
  };

  const onSubmit = (data: EditFormData) => {
    updateMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редагування профілю</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="aboutMe"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Про себе</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Розкажіть про себе..." rows={3} data-testid="textarea-about-me" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lookingFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Шукаю</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Кого ви шукаєте..." rows={3} data-testid="textarea-looking-for" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="relationshipStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Статус стосунків</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-relationship-status">
                          <SelectValue placeholder="Оберіть статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RELATIONSHIP_STATUS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bodyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Тип тіла</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-body-type">
                          <SelectValue placeholder="Оберіть тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {BODY_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hivStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ВІЛ-статус</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-hiv-status">
                          <SelectValue placeholder="Оберіть статус" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {HIV_STATUS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alcoholUse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Алкоголь</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-alcohol">
                          <SelectValue placeholder="Оберіть" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ALCOHOL_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="smoking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Куріння</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-smoking">
                          <SelectValue placeholder="Оберіть" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SMOKING_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Інтереси</FormLabel>
              <div className="flex gap-2 flex-wrap mt-2">
                {INTERESTS_OPTIONS.map((interest) => (
                  <Badge
                    key={interest}
                    variant={selectedInterests.includes(interest) ? "default" : "outline"}
                    className="cursor-pointer hover-elevate"
                    onClick={() => toggleInterest(interest)}
                    data-testid={`badge-interest-${interest.toLowerCase()}`}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <FormLabel>Мови</FormLabel>
              <div className="flex gap-2 flex-wrap mt-2">
                {LANGUAGES_OPTIONS.map((lang) => (
                  <Badge
                    key={lang}
                    variant={selectedLanguages.includes(lang) ? "default" : "outline"}
                    className="cursor-pointer hover-elevate"
                    onClick={() => toggleLanguage(lang)}
                    data-testid={`badge-language-${lang.toLowerCase()}`}
                  >
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="@username" data-testid="input-instagram" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telegram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telegram</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="@username" data-testid="input-telegram" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="+380..." data-testid="input-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
                data-testid="button-cancel-edit"
              >
                Скасувати
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                data-testid="button-save-profile"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Збереження...
                  </>
                ) : (
                  "Зберегти"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
