import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flame, Info } from "lucide-react";

interface Step10Props {
  form: UseFormReturn<any>;
}

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Початківець: Мало досвіду, шукаю порад" },
  { value: "intermediate", label: "Середній: Базовий досвід, хочу більше" },
  { value: "experienced", label: "Досвідчений: Багато практики, можу вести" },
  { value: "expert", label: "Експерт: Професіонал, можу навчати" },
];

const CONDOM_ATTITUDES = [
  { value: "always", label: "Завжди: Обов'язково з презервативом" },
  { value: "usually", label: "Зазвичай: Переважно, але гнучко" },
  { value: "sometimes", label: "Іноді: Залежно від ситуації" },
  { value: "never", label: "Ніколи: Тільки без захисту" },
];

const CIRCUMCISION = [
  { value: "cut", label: "Обрізаний: Гладкий, чистий" },
  { value: "uncut", label: "Необрізаний: З крайньою плоттю" },
];

const FAVORITE_POSITIONS = [
  "Місіонерська", "Догі-стайл", "Ковбой", "Зворотний ковбой", "69",
  "Ложечки", "Стоячи", "На боці", "З підняттям ніг", "На стільці",
  "Проти стіни", "На краю ліжка",
];

const DRUGS_ATTITUDE = [
  { value: "never", label: "Ніколи: Не вживаю і не підтримую" },
  { value: "sometimes", label: "Іноді: Легкі (поперси)" },
  { value: "yes", label: "Так: Сильніші речовини" },
];

const FAVORITE_ACTIVITIES = [
  "Оральний секс", "Римінг", "Мастурбація", "Масаж", "Поцілунки",
  "Обійми та ніжності", "Dirty talk", "Ерот фото/відео", "Рольові ігри",
  "BDSM (легкий)", "BDSM (хардкор)", "Бондаж", "Фетиш взуття",
  "Фетиш білизни", "Фетиш спортивного одягу", "Фетиш шкіри/латексу",
  "Груповий секс", "Swinging", "Експерименти з іграшками",
];

export default function Step10({ form }: Step10Props) {
  const selectedPositions = form.watch("favoritePositions") || [];
  const selectedActivities = form.watch("favoriteActivities") || [];

  const togglePosition = (position: string) => {
    const current = selectedPositions;
    if (current.includes(position)) {
      form.setValue("favoritePositions", current.filter((p: string) => p !== position));
    } else {
      form.setValue("favoritePositions", [...current, position]);
    }
  };

  const toggleActivity = (activity: string) => {
    const current = selectedActivities;
    if (current.includes(activity)) {
      form.setValue("favoriteActivities", current.filter((a: string) => a !== activity));
    } else {
      form.setValue("favoriteActivities", [...current, activity]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center space-y-2 pb-4">
        <div className="flex items-center justify-center gap-2">
          <Flame className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Сексуальний профіль
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Уяви, що це меню в ресторані. Чим детальніший опис страви, тим менше шансів отримати броколі, якщо ти мріяв про стейк.
        </p>
        <p className="text-xs text-muted-foreground italic">
          Заповни профіль — і нехай твої ідеальні "гурмани" знайдуть тебе самі!
        </p>
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-primary">
          <Info className="h-4 w-4" />
          <span>Всі поля опціональні — можеш пропустити цей крок</span>
        </div>
      </div>

      {/* Досвід */}
      <FormField
        control={form.control}
        name="sexExperience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Досвід</FormLabel>
            <FormDescription>Показує твій рівень практики, щоб привабити партнерів із подібним досвідом</FormDescription>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-sexexperience">
                  <SelectValue placeholder="Оберіть рівень досвіду" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Ставлення до презервативів */}
      <FormField
        control={form.control}
        name="condomAttitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ставлення до презервативів</FormLabel>
            <FormDescription>Визначає вподобання щодо захисту для безпеки та сумісності</FormDescription>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-condomattitude">
                  <SelectValue placeholder="Оберіть варіант" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CONDOM_ATTITUDES.map((attitude) => (
                  <SelectItem key={attitude.value} value={attitude.value}>
                    {attitude.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Обрізання */}
      <FormField
        control={form.control}
        name="circumcision"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Обрізання</FormLabel>
            <FormDescription>Естетичний і тактильний аспект</FormDescription>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-circumcision">
                  <SelectValue placeholder="Оберіть варіант" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CIRCUMCISION.map((option) => (
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

      {/* Улюблені пози */}
      <div className="space-y-4">
        <div>
          <FormLabel>Улюблені пози</FormLabel>
          <FormDescription>Конкретні пози для швидкого збігу за вподобаннями</FormDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {FAVORITE_POSITIONS.map((position) => {
            const isSelected = selectedPositions.includes(position);
            return (
              <button
                key={position}
                type="button"
                onClick={() => togglePosition(position)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover-elevate"
                }`}
                data-testid={`tag-position-${position.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {position}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {selectedPositions.length}
        </div>
      </div>

      {/* Ставлення до наркотиків */}
      <FormField
        control={form.control}
        name="drugsAttitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ставлення до наркотиків</FormLabel>
            <FormDescription>Важливо для безпеки та сумісності</FormDescription>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-drugsattitude">
                  <SelectValue placeholder="Оберіть варіант" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {DRUGS_ATTITUDE.map((attitude) => (
                  <SelectItem key={attitude.value} value={attitude.value}>
                    {attitude.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Улюблені активності */}
      <div className="space-y-4">
        <div>
          <FormLabel>Улюблені активності</FormLabel>
          <FormDescription>Обери все, що тебе цікавить — від ніжностей до експериментів</FormDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {FAVORITE_ACTIVITIES.map((activity) => {
            const isSelected = selectedActivities.includes(activity);
            return (
              <button
                key={activity}
                type="button"
                onClick={() => toggleActivity(activity)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover-elevate"
                }`}
                data-testid={`tag-activity-${activity.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-")}`}
              >
                {activity}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {selectedActivities.length}
        </div>
      </div>
    </div>
  );
}
