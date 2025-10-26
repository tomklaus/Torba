import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Step2Props {
  form: UseFormReturn<any>;
}

export default function Step2({ form }: Step2Props) {
  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold">
          Твої умови гри
        </h2>
        <p className="text-lg text-muted-foreground">
          Бізнес чи задоволення? Або все одразу?
        </p>
        <p className="text-sm text-muted-foreground">
          Давай визначимо вайб твого профілю, щоб усі одразу розуміли правила гри.
        </p>
      </div>

      <FormField
        control={form.control}
        name="commerceType"
        render={({ field }) => (
          <FormItem className="space-y-6">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-4"
              >
                {/* Так */}
                <div className="flex items-start space-x-4 p-6 rounded-lg border-2 border-border hover-elevate transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="yes" id="yes" data-testid="radio-yes" />
                  <Label
                    htmlFor="yes"
                    className="flex-1 cursor-pointer space-y-1"
                  >
                    <div className="font-semibold text-lg">Так</div>
                    <div className="text-sm text-muted-foreground">
                      Я відкритий до всього.
                    </div>
                  </Label>
                </div>

                {/* Ні */}
                <div className="flex items-start space-x-4 p-6 rounded-lg border-2 border-border hover-elevate transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="no" id="no" data-testid="radio-no" />
                  <Label
                    htmlFor="no"
                    className="flex-1 cursor-pointer space-y-1"
                  >
                    <div className="font-semibold text-lg">Ні</div>
                    <div className="text-sm text-muted-foreground">
                      Тільки романтика і спілкування.
                    </div>
                  </Label>
                </div>

                {/* Тільки комерція */}
                <div className="flex items-start space-x-4 p-6 rounded-lg border-2 border-border hover-elevate transition-all cursor-pointer has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value="commerce_only" id="commerce_only" data-testid="radio-commerce-only" />
                  <Label
                    htmlFor="commerce_only"
                    className="flex-1 cursor-pointer space-y-1"
                  >
                    <div className="font-semibold text-lg">
                      Тільки для комерції
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Строго по ділу.
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Підказка для commerce_only */}
      {form.watch("commerceType") === "commerce_only" && (
        <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-sm text-yellow-200">
            <span className="font-semibold">Обереш останній варіант?</span> Ми додамо спеціальний знак до твого ніку. 
            Це як фейс-контроль для твоїх повідомлень: проходять лише ті, хто готовий до твоїх умов.
          </p>
        </div>
      )}

      <p className="text-center text-sm text-muted-foreground italic">
        Твій вибір — твій комфорт.
      </p>
    </div>
  );
}
