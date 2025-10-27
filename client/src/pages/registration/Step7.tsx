import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, Sparkles, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface PhotoPreview {
  file: File;
  previewUrl: string;
}

interface Step7Props {
  form: UseFormReturn<any>;
}

export default function Step7({ form }: Step7Props) {
  const { toast } = useToast();
  const publicPhotos: PhotoPreview[] = form.watch("publicPhotos") || [];
  const privatePhotos: PhotoPreview[] = form.watch("privatePhotos") || [];

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      [...publicPhotos, ...privatePhotos].forEach(photo => {
        if (photo.previewUrl) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
    };
  }, []);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "public" | "private"
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentPhotos = form.getValues(type === "public" ? "publicPhotos" : "privatePhotos") || [];
    
    if (currentPhotos.length + files.length > 6) {
      toast({
        title: "Забагато фото",
        description: `Максимум 6 фото ${type === "public" ? "в публічній галереї" : "в приватній галереї"}`,
        variant: "destructive",
      });
      return;
    }

    // Create preview URLs for selected files
    const newPhotos: PhotoPreview[] = files.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));

    // Add to form
    const fieldName = type === "public" ? "publicPhotos" : "privatePhotos";
    form.setValue(fieldName, [...currentPhotos, ...newPhotos]);

    toast({
      title: "Фото обрано",
      description: `Обрано ${newPhotos.length} фото. Вони завантажаться при завершенні реєстрації.`,
    });

    // Clear input
    e.target.value = "";
  };

  const removePhoto = (index: number, type: "public" | "private") => {
    const fieldName = type === "public" ? "publicPhotos" : "privatePhotos";
    const current: PhotoPreview[] = form.getValues(fieldName) || [];
    
    // Revoke object URL before removing
    if (current[index]) {
      URL.revokeObjectURL(current[index].previewUrl);
    }
    
    const newPhotos = current.filter((_, i: number) => i !== index);
    form.setValue(fieldName, newPhotos);
    
    toast({
      title: "Фото видалено",
      description: "Фото успішно видалено з галереї",
    });
  };

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-purple-400" />
          <h2 className="text-2xl md:text-3xl font-bold">
            Створи свою таємницю
          </h2>
        </div>
        <div className="space-y-2 text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <ImageIcon className="h-4 w-4" />
            <span className="font-semibold">Публічна галерея:</span> Те, що змусить його зупинитися.
          </p>
          <p className="flex items-center justify-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="font-semibold">Приватна галерея:</span> Те, що змусить його зустрітися.
          </p>
        </div>
        <p className="text-sm text-muted-foreground italic">
          Що сховати, а що показати — вирішуй сам. Заінтригуй тілом, а потім врази обличчям. Або навпаки.
        </p>
        <p className="text-xs font-medium">
          Твоя анкета, твої правила. Вперед!
        </p>
      </div>

      {/* Публічна галерея */}
      <FormField
        control={form.control}
        name="publicPhotos"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Публічна галерея (1-6 фото) *
            </FormLabel>
            <FormDescription>
              Мінімум 1 фото обов'язково, максимум 6. Фото завантажаться при завершенні реєстрації.
            </FormDescription>
            
            {/* Превью фото */}
            {publicPhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {publicPhotos.map((photo: PhotoPreview, index: number) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                    <img
                      src={photo.previewUrl}
                      alt={`Public photo ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index, "public")}
                      data-testid={`button-remove-public-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {publicPhotos.length < 6 && (
              <FormControl>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover-elevate transition-all">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-8 w-8 text-purple-400" />
                    <span className="text-sm text-muted-foreground">
                      Натисніть для вибору фото
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {publicPhotos.length}/6 фото
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, "public")}
                    data-testid="input-public-photos"
                  />
                </label>
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Приватна галерея */}
      <FormField
        control={form.control}
        name="privatePhotos"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Приватна галерея (0-6 фото)
            </FormLabel>
            <FormDescription>
              Відкривається після надання дозволу за запитом іншого користувача. Фото завантажаться при завершенні реєстрації.
            </FormDescription>
            
            {/* Превью фото */}
            {privatePhotos.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {privatePhotos.map((photo: PhotoPreview, index: number) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                    <img
                      src={photo.previewUrl}
                      alt={`Private photo ${index + 1}`}
                      className="w-full h-full object-cover blur-sm group-hover:blur-none transition-all"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-all flex items-center justify-center pointer-events-none">
                      <Lock className="h-6 w-6 text-white group-hover:opacity-0 transition-opacity" />
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removePhoto(index, "private")}
                      data-testid={`button-remove-private-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {privatePhotos.length < 6 && (
              <FormControl>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover-elevate transition-all">
                  <div className="flex flex-col items-center gap-2">
                    <Lock className="h-8 w-8 text-blue-400" />
                    <span className="text-sm text-muted-foreground">
                      Натисніть для вибору фото
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {privatePhotos.length}/6 фото
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e, "private")}
                    data-testid="input-private-photos"
                  />
                </label>
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
