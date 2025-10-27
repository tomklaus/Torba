import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { PAYMENT_METHODS, TRANSPORT_COSTS } from "@/lib/constants";

interface Step6Props {
  form: UseFormReturn<any>;
}

export default function Step6({ form }: Step6Props) {
  const showTransportCosts = form.watch("locationFormats")?.includes("outcall");

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">
          Налаштування комерційних зустрічей
        </h2>
        <p className="text-muted-foreground">
          Блок 4: Фінансові умови
        </p>
      </div>

      {/* Базові тарифи */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Базові тарифи</h3>
        <p className="text-sm text-muted-foreground">
          Вкажіть ваші тарифи (необов'язково). Залиште порожнім, якщо обговорюється індивідуально.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rate1h"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тариф за 1 годину (грн)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="h-12 text-base"
                    data-testid="input-rate-1h"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rate2h"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тариф за 2 години (грн)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1800"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="h-12 text-base"
                    data-testid="input-rate-2h"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rateNight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Тариф за ніч (грн)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="5000"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="h-12 text-base"
                    data-testid="input-rate-night"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="travelFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Доплата за виїзд (грн)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="500"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="h-12 text-base"
                    data-testid="input-travel-fee"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Політика скасування */}
      <FormField
        control={form.control}
        name="cancellationFee"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Штраф за скасування зустрічі (грн)
            </FormLabel>
            <FormDescription>
              Сума додається до наступного замовлення
            </FormDescription>
            <FormControl>
              <Input
                type="number"
                placeholder="300"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                className="h-12 text-base max-w-xs"
                data-testid="input-cancellation-fee"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Способи оплати */}
      <FormField
        control={form.control}
        name="paymentMethods"
        render={() => (
          <FormItem>
            <FormLabel className="text-base font-medium">
              Способи оплати
            </FormLabel>
            <div className="space-y-3 mt-3">
              {PAYMENT_METHODS.map((method) => (
                <FormField
                  key={method.value}
                  control={form.control}
                  name="paymentMethods"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(method.value)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            return checked
                              ? field.onChange([...current, method.value])
                              : field.onChange(current.filter((value: string) => value !== method.value));
                          }}
                          data-testid={`checkbox-payment-${method.value}`}
                        />
                      </FormControl>
                      <FormLabel className="font-normal text-sm leading-snug cursor-pointer">
                        {method.label}
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

      {/* Транспортні витрати (показується якщо обрано outcall в Step4) */}
      {showTransportCosts && (
        <FormField
          control={form.control}
          name="transportCosts"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Транспортні витрати (для виїзду)
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="space-y-3"
                >
                  {TRANSPORT_COSTS.map((cost) => (
                    <div key={cost.value} className="flex items-start space-x-3">
                      <RadioGroupItem value={cost.value} id={cost.value} data-testid={`radio-transport-${cost.value}`} />
                      <Label htmlFor={cost.value} className="cursor-pointer text-sm leading-snug">
                        {cost.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
