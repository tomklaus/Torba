import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SERVICE_FORMATS } from "@/lib/constants";

interface Step3Props {
  form: UseFormReturn<any>;
}

export default function Step3({ form }: Step3Props) {
  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">
          Налаштування комерційних зустрічей
        </h2>
        <p className="text-muted-foreground">
          Блок 1: Формати послуг та моя роль
        </p>
      </div>

      {/* Формати послуг */}
      <FormField
        control={form.control}
        name="serviceFormats"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Формати послуг, що пропонуються
            </FormLabel>
            <FormDescription>
              Оберіть усі формати послуг, які ви готові надавати
            </FormDescription>
            <div className="space-y-3 mt-3">
              {SERVICE_FORMATS.map((service) => (
                <FormField
                  key={service}
                  control={form.control}
                  name="serviceFormats"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(service)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            return checked
                              ? field.onChange([...current, service])
                              : field.onChange(current.filter((value: string) => value !== service));
                          }}
                          data-testid={`checkbox-service-${service.slice(0, 20)}`}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm leading-snug cursor-pointer">
                        {service}
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

      {/* Роль у сексі для комерції */}
      <FormField
        control={form.control}
        name="commerceSexRole"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Моя роль у сексі
            </FormLabel>
            <FormDescription>
              Оберіть вашу основну роль
            </FormDescription>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Актив" id="role-top" data-testid="radio-role-top" />
                  <Label htmlFor="role-top" className="cursor-pointer">Актив</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Пасив" id="role-bottom" data-testid="radio-role-bottom" />
                  <Label htmlFor="role-bottom" className="cursor-pointer">Пасив</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="Універсал" id="role-vers" data-testid="radio-role-vers" />
                  <Label htmlFor="role-vers" className="cursor-pointer">Універсал</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
