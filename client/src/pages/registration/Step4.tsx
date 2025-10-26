import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { LOCATION_FORMATS, TRAVEL_GEOGRAPHY, AVAILABILITY_OPTIONS, MIN_NOTICE_OPTIONS, MIN_DURATION_OPTIONS } from "@/lib/constants";

interface Step4Props {
  form: UseFormReturn<any>;
}

export default function Step4({ form }: Step4Props) {
  const showTravelGeography = form.watch("locationFormats")?.includes("outcall");
  const showCustomDuration = form.watch("minDuration") === "other";

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">
          Налаштування комерційних зустрічей
        </h2>
        <p className="text-muted-foreground">
          Блок 2: Локація та графік доступності
        </p>
      </div>

      {/* Формат локації */}
      <FormField
        control={form.control}
        name="locationFormats"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Формат локації
            </FormLabel>
            <div className="space-y-3 mt-3">
              {LOCATION_FORMATS.map((location) => (
                <FormField
                  key={location.value}
                  control={form.control}
                  name="locationFormats"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(location.value)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            return checked
                              ? field.onChange([...current, location.value])
                              : field.onChange(current.filter((value: string) => value !== location.value));
                          }}
                          data-testid={`checkbox-location-${location.value}`}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm leading-snug cursor-pointer">
                        {location.label}
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

      {/* Географія виїзду (показується якщо обрано outcall) */}
      {showTravelGeography && (
        <FormField
          control={form.control}
          name="travelGeography"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Географія виїзду
              </FormLabel>
              <div className="space-y-3 mt-3">
                {TRAVEL_GEOGRAPHY.map((geo) => (
                  <FormField
                    key={geo.value}
                    control={form.control}
                    name="travelGeography"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(geo.value)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              return checked
                                ? field.onChange([...current, geo.value])
                                : field.onChange(current.filter((value: string) => value !== geo.value));
                            }}
                            data-testid={`checkbox-geography-${geo.value}`}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm leading-snug cursor-pointer">
                          {geo.label}
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
      )}

      {/* Графік доступності */}
      <FormField
        control={form.control}
        name="availability"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Графік доступності
            </FormLabel>
            <div className="space-y-3 mt-3">
              {AVAILABILITY_OPTIONS.map((avail) => (
                <FormField
                  key={avail.value}
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(avail.value)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            return checked
                              ? field.onChange([...current, avail.value])
                              : field.onChange(current.filter((value: string) => value !== avail.value));
                          }}
                          data-testid={`checkbox-availability-${avail.value}`}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm leading-snug cursor-pointer">
                        {avail.label}
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

      {/* Мінімальний час на попередження */}
      <FormField
        control={form.control}
        name="minNotice"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Мінімальний час на попередження
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 text-base" data-testid="select-min-notice">
                  <SelectValue placeholder="Оберіть час" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {MIN_NOTICE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Мінімальна тривалість зустрічі */}
      <FormField
        control={form.control}
        name="minDuration"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Мінімальна тривалість зустрічі
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-12 text-base" data-testid="select-min-duration">
                  <SelectValue placeholder="Оберіть тривалість" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {MIN_DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Своя тривалість (якщо обрано "Інше") */}
      {showCustomDuration && (
        <FormField
          control={form.control}
          name="customDuration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Вкажіть свою тривалість</FormLabel>
              <FormControl>
                <Input
                  placeholder="Наприклад: 4 години"
                  {...field}
                  className="h-12 text-base"
                  data-testid="input-custom-duration"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
