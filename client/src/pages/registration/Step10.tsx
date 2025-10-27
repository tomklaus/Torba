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

// 1. Досвід
const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Початківець: Мало досвіду, шукаю порад" },
  { value: "intermediate", label: "Середній: Базовий досвід, хочу більше" },
  { value: "experienced", label: "Досвідчений: Багато практики, можу вести" },
  { value: "expert", label: "Експерт: Професіонал, можу навчати" },
];

// 2. Ставлення до презервативів
const CONDOM_ATTITUDES = [
  { value: "always", label: "Завжди: Обов'язково з презервативом" },
  { value: "usually", label: "Зазвичай: Переважно, але гнучко" },
  { value: "sometimes", label: "Іноді: Залежно від ситуації" },
  { value: "never", label: "Ніколи: Тільки без захисту" },
];

// 3. Обрізання
const CIRCUMCISION = [
  { value: "cut", label: "Обрізаний: Гладкий, чистий" },
  { value: "uncut", label: "Необрізаний: З крайньою плоттю" },
];

// 4. Улюблені пози
const FAVORITE_POSITIONS = [
  "Місіонерська: Очима в очі",
  "Ззаду: Партнер ззаду",
  "Наїзник: Партнер зверху",
  "На боці: Лежачи збоку",
  "Стоячи: Проти стіни",
];

// 5. Бажана частота сексу
const SEX_FREQUENCY = [
  { value: "daily", label: "Щоденно" },
  { value: "several_week", label: "Кілька разів на тиждень" },
  { value: "weekly", label: "Приблизно раз на тиждень" },
  { value: "several_month", label: "Кілька разів на місяць" },
  { value: "monthly", label: "Раз на місяць" },
  { value: "several_year", label: "Кілька разів на рік" },
  { value: "depends", label: "Залежить від партнера та настрою" },
  { value: "not_now", label: "Зараз неактуально / Утримання" },
];

// 6. Груповий секс
const GROUP_SEX_ATTITUDE = [
  { value: "love", label: "Люблю: Групові зустрічі, трійки або більше" },
  { value: "sometimes", label: "Іноді: З одним-двома" },
  { value: "no", label: "Ні: Тільки один на один" },
  { value: "want_not_tried", label: "Хочу, але ще не робив" },
  { value: "observer", label: "Спостерігач: Дивлюся" },
];

// 7. Ставлення до речовин у сексі
const SUBSTANCES_ATTITUDE = [
  { value: "no", label: "Ні: Тверезий секс" },
  { value: "light", label: "Іноді: Легкі (поперси)" },
  { value: "yes", label: "Так: Сильніші речовини" },
];

// 8. Улюблені активності (10 варіантів з документа)
const FAVORITE_ACTIVITIES = [
  "Оральний секс: Лизання або смоктання статевого органа",
  "Анальний секс: Проникнення в анус",
  "Лизання ануса: Стимуляція ануса язиком",
  "Взаємний оральний (69): Одночасний оральний секс обох партнерів",
  "Фістинг: Введення руки в анус",
  "Масаж простати: Стимуляція простати пальцем або іграшкою",
  "Стимуляція сосків: Лизання, кусання або стискання сосків",
  "Ручна стимуляція: Мастурбація партнера рукою",
  "Секс із іграшками: Використання вібраторів, пробок чи інших пристроїв",
  "Легке зв'язування: Використання наручників або мотузок для обмеження рухів",
];

// 9. Іграшки/Аксесуари
const TOYS_ACCESSORIES = [
  "Вібратори: Пристрої для стимуляції ерогенних зон",
  "Анальні пробки: Іграшки для анальної підготовки або задоволення",
  "Наручники: Для зв'язування рук чи ніг",
  "Мотузки: Для складнішого бондажу",
  "Підвіс (слінг): Спеціальна конструкція для анального сексу",
  "Анальні намиста: Намистини для поступової анальної стимуляції",
  "Фалоімітатори: Іграшки для проникнення",
  "Масажери простати: Пристрої для стимуляції простати",
  "Кільця для пеніса: Обмежують кровотік для тривалішої ерекції",
  "Маски/Пов'язки на очі: Для закриття очей під час сексу",
];

// 10. Місце зустрічі
const MEETING_PLACES = [
  "Дома: Ваша/його квартира",
  "Готель: Нейтральне місце",
  "Сауна/Клуб: Публічне",
  "Природа: Парк/ліс",
];

// 11. Після сексу
const AFTER_SEX = [
  "Обійми/Розмова: Чутливий для найкращих",
  "Швидкий душ: Практичний",
  "Ніч разом: Романтичний",
  "Нічого: Встаю і йду",
];

// 12. Фетиші/вподобання (14 варіантів)
const FETISHES = [
  "Ведмеді (Bears): Тяжіння до великих, кремезних та часто волохатих чоловіків",
  "Шкіра (Leather): Сексуальний потяг до одягу зі шкіри",
  "Уніформа (Uniform): Збудження від вигляду чоловіка у формі",
  "Спортивний одяг (Sportswear): Фетиш на спортивний одяг та екіпіровку",
  "Татусі (Daddies): Потяг до старших, зрілих та часто домінантних чоловіків",
  "Спортсмени / Джоки (Jocks): Тяжіння до чоловіків атлетичної, мускулистої статури",
  "Твінки (Twinks): Потяг до молодих (18-25 років), худих, струнких хлопців",
  "БДСМ (BDSM): Бондаж, домінування, підкорення, садизм та мазохізм",
  "Круїзинг (Cruising): Пошук анонімного та швидкого сексу в громадських місцях",
  "Фут-фетиш (Foot Fetish): Сексуальний інтерес до чоловічих ніг, ступень та іноді взуття",
  "Груповий секс (Group Sex): Сексуальна активність за участю трьох або більше людей",
  "Латекс / гума (Latex / Rubber): Збудження від одягу з латексу або гуми",
  "Спідня білизна (Underwear Fetish): Особливий інтерес до чоловічої спідньої білизни",
  "Вуаєризм (Voyeurism): Отримання сексуального задоволення від таємного підглядання",
  "Ексгібіціонізм (Exhibitionism): Бажання демонструвати своє оголене тіло або сексуальні акти іншим",
];

// 13. Роль у BDSM (9 варіантів)
const BDSM_ROLES = [
  "Домінант (Dom): Віддаю перевагу контролю, встановленню правил та психологічному домінуванню",
  "Майстер / Господар (Master): Більш глибока форма домінування",
  "Садист (Sadist): Отримую сексуальне задоволення від заподіяння партнеру узгодженого фізичного болю",
  "Сабмісив (Sub): Отримую задоволення від підкорення, виконання наказів та передачі контролю",
  "Раб (Slave): Прагну до повної передачі контролю над собою Майстру/Господарю",
  "Мазохіст (Masochist): Отримую сексуальне задоволення від отримання болю, приниження або дискомфорту",
  "Світч (Switch): Гнучкий у своїх ролях. Можу отримувати задоволення як від домінування, так і від підкорення",
  "Кінкі / Практикую різне (Kinky / Experimental): Мені подобаються нетрадиційні сексуальні практики",
  "Цікавлюся / Вивчаю (Curious / Learning): Я новачок у світі BDSM, але мені цікаво спробувати",
];

export default function Step10({ form }: Step10Props) {
  // Watch all multi-select fields
  const favoritePositions = form.watch("favoritePositions") || [];
  const favoriteActivities = form.watch("favoriteActivities") || [];
  const toysAccessories = form.watch("toysAccessories") || [];
  const meetingPlaces = form.watch("meetingPlaces") || [];
  const afterSex = form.watch("afterSex") || [];
  const fetishes = form.watch("fetishes") || [];
  const bdsmRoles = form.watch("bdsmRoles") || [];

  // Toggle helpers
  const toggleItem = (fieldName: string, item: string, currentArray: string[]) => {
    if (currentArray.includes(item)) {
      form.setValue(fieldName, currentArray.filter((x: string) => x !== item));
    } else {
      form.setValue(fieldName, [...currentArray, item]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center space-y-3 pb-4">
        <div className="flex items-center justify-center gap-2">
          <Flame className="h-8 w-8 text-orange-500" />
          <h2 className="text-2xl md:text-3xl font-bold">
            Сексуальний профіль
          </h2>
        </div>
        <div className="space-y-2 text-muted-foreground max-w-2xl mx-auto">
          <p className="text-base font-semibold">Навіщо це заповнювати?</p>
          <p className="text-sm">
            Уяви, що це меню в ресторані. Чим детальніший опис страви, тим менше шансів отримати броколі, якщо ти мріяв про стейк. 😉
          </p>
          <p className="text-sm font-medium">
            Заповни профіль — і нехай твої ідеальні "гурмани" знайдуть тебе самі! 🔥
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-primary">
          <Info className="h-4 w-4" />
          <span>Всі поля опціональні — можеш пропустити цей крок</span>
        </div>
      </div>

      {/* 1. Досвід */}
      <FormField
        control={form.control}
        name="sexExperience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Досвід</FormLabel>
            <FormDescription>Показує ваш рівень практики, щоб привабити партнерів із подібним досвідом</FormDescription>
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

      {/* 2. Ставлення до презервативів */}
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

      {/* 3. Обрізання */}
      <FormField
        control={form.control}
        name="circumcision"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Обрізання</FormLabel>
            <FormDescription>Естетичний і тактильний аспект, впливає на вподобання</FormDescription>
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

      {/* 4. Улюблені пози */}
      <div className="space-y-3">
        <div>
          <FormLabel>Улюблені пози</FormLabel>
          <FormDescription>Конкретні пози для швидкого збігу за вподобаннями</FormDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {FAVORITE_POSITIONS.map((position) => {
            const isSelected = favoritePositions.includes(position);
            return (
              <button
                key={position}
                type="button"
                onClick={() => toggleItem("favoritePositions", position, favoritePositions)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover-elevate"
                }`}
                data-testid={`tag-position-${position.split(":")[0].toLowerCase().replace(/\s+/g, "-")}`}
              >
                {position}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {favoritePositions.length}
        </div>
      </div>

      {/* 5. Бажана частота сексу */}
      <FormField
        control={form.control}
        name="sexFrequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Бажана частота сексу</FormLabel>
            <FormDescription>Оберіть, яка частота інтимних стосунків для вас є найкомфортнішою</FormDescription>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-sexfrequency">
                  <SelectValue placeholder="Оберіть варіант" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SEX_FREQUENCY.map((freq) => (
                  <SelectItem key={freq.value} value={freq.value}>
                    {freq.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* 6. Груповий секс */}
      <FormField
        control={form.control}
        name="groupSex"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Груповий секс</FormLabel>
            <FormDescription>Ставлення до множинних партнерів</FormDescription>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-groupsex">
                  <SelectValue placeholder="Оберіть варіант" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {GROUP_SEX_ATTITUDE.map((attitude) => (
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

      {/* 7. Ставлення до речовин у сексі */}
      <FormField
        control={form.control}
        name="substancesAttitude"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ставлення до речовин у сексі</FormLabel>
            <FormDescription>Чесність щодо використання речовин для безпеки</FormDescription>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-substances">
                  <SelectValue placeholder="Оберіть варіант" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SUBSTANCES_ATTITUDE.map((attitude) => (
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

      {/* 8. Улюблені активності */}
      <div className="space-y-3">
        <div>
          <FormLabel>Улюблені активності</FormLabel>
          <FormDescription>Перелік сексуальних актів, які ви віддаєте перевагу, щоб визначити сумісність із потенційними партнерами</FormDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {FAVORITE_ACTIVITIES.map((activity) => {
            const isSelected = favoriteActivities.includes(activity);
            return (
              <button
                key={activity}
                type="button"
                onClick={() => toggleItem("favoriteActivities", activity, favoriteActivities)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover-elevate"
                }`}
                data-testid={`tag-activity-${activity.split(":")[0].toLowerCase().replace(/\s+/g, "-")}`}
              >
                {activity}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {favoriteActivities.length}
        </div>
      </div>

      {/* 9. Іграшки/Аксесуари */}
      <div className="space-y-3">
        <div>
          <FormLabel>Іграшки/Аксесуари</FormLabel>
          <FormDescription>Вподобання щодо використання секс-іграшок чи аксесуарів під час інтимних зустрічей</FormDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {TOYS_ACCESSORIES.map((toy) => {
            const isSelected = toysAccessories.includes(toy);
            return (
              <button
                key={toy}
                type="button"
                onClick={() => toggleItem("toysAccessories", toy, toysAccessories)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover-elevate"
                }`}
                data-testid={`tag-toy-${toy.split(":")[0].toLowerCase().replace(/\s+/g, "-")}`}
              >
                {toy}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {toysAccessories.length}
        </div>
      </div>

      {/* 10. Місце зустрічі */}
      <div className="space-y-3">
        <div>
          <FormLabel>Місце зустрічі</FormLabel>
          <FormDescription>Де ви комфортно займаєтеся сексом</FormDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {MEETING_PLACES.map((place) => {
            const isSelected = meetingPlaces.includes(place);
            return (
              <button
                key={place}
                type="button"
                onClick={() => toggleItem("meetingPlaces", place, meetingPlaces)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover-elevate"
                }`}
                data-testid={`tag-place-${place.split(":")[0].toLowerCase().replace(/\s+/g, "-")}`}
              >
                {place}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {meetingPlaces.length}
        </div>
      </div>

      {/* 11. Після сексу */}
      <div className="space-y-3">
        <div>
          <FormLabel>Після сексу</FormLabel>
          <FormDescription>Ставлення до емоційного догляду після акту</FormDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {AFTER_SEX.map((option) => {
            const isSelected = afterSex.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => toggleItem("afterSex", option, afterSex)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover-elevate"
                }`}
                data-testid={`tag-aftersex-${option.split(":")[0].toLowerCase().replace(/\s+/g, "-")}`}
              >
                {option}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {afterSex.length}
        </div>
      </div>

      {/* 12. Фетиші/вподобання */}
      <div className="space-y-3">
        <div>
          <FormLabel>Фетиші/вподобання</FormLabel>
          <FormDescription>Оберіть ваші сексуальні інтереси та фетиші</FormDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {FETISHES.map((fetish) => {
            const isSelected = fetishes.includes(fetish);
            return (
              <button
                key={fetish}
                type="button"
                onClick={() => toggleItem("fetishes", fetish, fetishes)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover-elevate"
                }`}
                data-testid={`tag-fetish-${fetish.split(":")[0].toLowerCase().replace(/\s+/g, "-").replace(/\(/g, "").replace(/\)/g, "")}`}
              >
                {fetish}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {fetishes.length}
        </div>
      </div>

      {/* 13. Роль у BDSM */}
      <div className="space-y-3">
        <div>
          <FormLabel>Роль у BDSM</FormLabel>
          <FormDescription>Оберіть вашу роль або ролі у BDSM практиках (можна обрати кілька)</FormDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {BDSM_ROLES.map((role) => {
            const isSelected = bdsmRoles.includes(role);
            return (
              <button
                key={role}
                type="button"
                onClick={() => toggleItem("bdsmRoles", role, bdsmRoles)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover-elevate"
                }`}
                data-testid={`tag-bdsm-${role.split(":")[0].toLowerCase().replace(/\s+/g, "-").replace(/\(/g, "").replace(/\)/g, "")}`}
              >
                {role}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {bdsmRoles.length}
        </div>
      </div>
    </div>
  );
}
