import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MEETING_CONDITIONS, HEALTH_SAFETY, PHOTO_VIDEO_CONSENT } from "@/lib/constants";

interface Step5Props {
  form: UseFormReturn<any>;
}

export default function Step5({ form }: Step5Props) {
  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">
          Налаштування комерційних зустрічей
        </h2>
        <p className="text-muted-foreground">
          Блок 3: Безпека, межі та умови
        </p>
      </div>

      {/* Обов'язкові умови зустрічі */}
      <FormField
        control={form.control}
        name="meetingConditions"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Обов'язкові умови зустрічі
            </FormLabel>
            <div className="space-y-3 mt-3">
              {MEETING_CONDITIONS.map((condition) => (
                <FormField
                  key={condition}
                  control={form.control}
                  name="meetingConditions"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(condition)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            return checked
                              ? field.onChange([...current, condition])
                              : field.onChange(current.filter((value: string) => value !== condition));
                          }}
                          data-testid={`checkbox-condition-${condition.slice(0, 20)}`}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm leading-snug cursor-pointer">
                        {condition}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Захист та здоров'я */}
      <FormField
        control={form.control}
        name="healthSafety"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Захист та здоров'я
            </FormLabel>
            <div className="space-y-3 mt-3">
              {HEALTH_SAFETY.map((safety) => (
                <FormField
                  key={safety}
                  control={form.control}
                  name="healthSafety"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(safety)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            return checked
                              ? field.onChange([...current, safety])
                              : field.onChange(current.filter((value: string) => value !== safety));
                          }}
                          data-testid={`checkbox-safety-${safety.slice(0, 20)}`}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm leading-snug cursor-pointer">
                        {safety}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Дата останнього тесту на ІПСШ */}
      <FormField
        control={form.control}
        name="lastStdTest"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Дата останнього тесту на ІПСШ
            </FormLabel>
            <FormDescription>
              Формат: місяць/рік (наприклад, 01/2025)
            </FormDescription>
            <FormControl>
              <Input
                type="month"
                {...field}
                className="h-12 text-base max-w-xs"
                data-testid="input-std-test"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Згода на фото/відео зйомку */}
      <FormField
        control={form.control}
        name="photoVideoConsent"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Згода на фото/відео зйомку
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-3"
              >
                {PHOTO_VIDEO_CONSENT.map((consent) => (
                  <div key={consent.value} className="flex items-start space-x-3">
                    <RadioGroupItem value={consent.value} id={consent.value} data-testid={`radio-consent-${consent.value}`} />
                    <Label htmlFor={consent.value} className="cursor-pointer text-sm leading-snug">
                      {consent.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Мої межі */}
      <FormField
        control={form.control}
        name="myLimits"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Мої межі (чого я не роблю)
            </FormLabel>
            <FormDescription>
              Вкажіть загальні межі без зайвих деталей. Наприклад: "Не практикую певні BDSM-практики", "Не зустрічаюся з парами"
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Вкажіть ваші межі..."
                {...field}
                className="min-h-24 resize-none"
                data-testid="textarea-limits"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Бажані умови для комфорту */}
      <FormField
        control={form.control}
        name="comfortConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Бажані умови для комфорту
            </FormLabel>
            <FormDescription>
              Опишіть, що важливо для вашого комфорту. Наприклад: "наявність чистого рушника та душу", "кондиціонер у літній період"
            </FormDescription>
            <FormControl>
              <Textarea
                placeholder="Опишіть умови..."
                {...field}
                className="min-h-24 resize-none"
                data-testid="textarea-comfort"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
