import { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UKRAINIAN_CITIES, SEX_ROLES, DATING_GOALS } from "@/lib/constants";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";

interface Step1Props {
  form: UseFormReturn<any>;
}

export default function Step1({ form }: Step1Props) {
  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold">
          Привіт! Давай знайомитись.
        </h2>
        <p className="text-muted-foreground">
          Це твій перший крок до неймовірних зустрічей. Заповни анкету, і наш алгоритм почне творити магію!
        </p>
      </div>

      <div className="space-y-6">
        {/* Ім'я */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Як тебе називати?
              </FormLabel>
              <FormDescription>
                Твоє ім'я або нікнейм, під яким тебе впізнають.
              </FormDescription>
              <FormControl>
                <Input
                  placeholder="Ім'я"
                  {...field}
                  maxLength={50}
                  className="h-12 text-base"
                  data-testid="input-name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Дата народження */}
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Твій день народження?
              </FormLabel>
              <FormDescription>
                У профілі відображається як вік або як категорія (наприклад, 31-35)
              </FormDescription>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="h-12 text-base"
                  data-testid="input-birthdate"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Місто */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Де тебе шукати?
              </FormLabel>
              <FormDescription>
                Оберіть найближче до вас місто з довідника
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base" data-testid="select-city">
                    <SelectValue placeholder="Оберіть місто" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {UKRAINIAN_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Точна назва міста */}
        <FormField
          control={form.control}
          name="customCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Не знайшов? Вибери найближче до тебе, а тут напиши як називається твоє
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Назва твого міста"
                  {...field}
                  className="h-12 text-base"
                  data-testid="input-custom-city"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      

        {/* Статура */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">Трохи про статуру:</h3>
            <p className="text-sm text-muted-foreground italic">
              Чесність тут — твій найкращий друг. Кожен знайде свого поціновувача!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Зріст */}
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Зріст (см)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="175"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseInt(e.target.value))}
                      className="h-12 text-base"
                      data-testid="input-height"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Вага */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Вага (кг)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="70"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseInt(e.target.value))}
                      className="h-12 text-base"
                      data-testid="input-weight"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Розмір члена */}
        <FormField
          control={form.control}
          name="penisSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Розмір твого скарбу (в см)
              </FormLabel>
              <FormDescription>
                Будьмо відвертими — це важливий фільтр для багатьох. Вкажи чесно, щоб уникнути непорозумінь і знайти ідеальний match.
              </FormDescription>
              <FormControl>
                <Input
                  type="number"
                  placeholder="15"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value === "" ? undefined : parseInt(e.target.value))}
                  className="h-12 text-base max-w-xs"
                  data-testid="input-penis-size"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Роль у сексі */}
        <FormField
          control={form.control}
          name="sexRole"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Хто ти в цій грі?
              </FormLabel>
              <FormDescription>
                Обери свою домінуючу роль, щоб одразу знайти правильного партнера.
              </FormDescription>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="h-12 text-base" data-testid="select-sex-role">
                    <SelectValue placeholder="Оберіть роль" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SEX_ROLES.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Цілі знайомства */}
        <FormField
          control={form.control}
          name="datingGoals"
          render={() => (
            <FormItem>
              <FormLabel className="text-base font-medium">
                Навіщо ти тут?
              </FormLabel>
              <FormDescription>
                Серйозні стосунки, легкий флірт чи гарячі експерименти? Можна обрати все, що до душі!
              </FormDescription>
              <div className="space-y-3 mt-3">
                {DATING_GOALS.map((goal) => (
                  <FormField
                    key={goal}
                    control={form.control}
                    name="datingGoals"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(goal)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              return checked
                                ? field.onChange([...current, goal])
                                : field.onChange(current.filter((value: string) => value !== goal));
                            }}
                            data-testid={`checkbox-goal-${goal.slice(0, 20)}`}
                          />
                        </FormControl>
                        <FormLabel className="font-normal text-sm leading-snug cursor-pointer">
                          {goal}
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
      </div>
    </div>
  );
}
