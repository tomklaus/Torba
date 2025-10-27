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
import { Badge } from "@/components/ui/badge";
import { Flame, Info } from "lucide-react";

interface Step10Props {
  form: UseFormReturn<any>;
}

// 1. Досвід
const EXPERIENCE_LEVELS = [
  { value: "beginner", name: "Початківець", description: "Мало досвіду, шукаю порад" },
  { value: "intermediate", name: "Середній", description: "Базовий досвід, хочу більше" },
  { value: "experienced", name: "Досвідчений", description: "Багато практики, можу вести" },
  { value: "expert", name: "Експерт", description: "Професіонал, можу навчати" },
];

// 2. Ставлення до презервативів
const CONDOM_ATTITUDES = [
  { value: "always", name: "Завжди", description: "Обов'язково з презервативом" },
  { value: "usually", name: "Зазвичай", description: "Переважно, але гнучко" },
  { value: "sometimes", name: "Іноді", description: "Залежно від ситуації" },
  { value: "never", name: "Ніколи", description: "Тільки без захисту" },
];

// 3. Обрізання
const CIRCUMCISION = [
  { value: "cut", name: "Обрізаний", description: "Гладкий, чистий" },
  { value: "uncut", name: "Необрізаний", description: "З крайньою плоттю" },
];

// 4. Улюблені пози
const FAVORITE_POSITIONS = [
  { name: "Місіонерська", description: "Очима в очі" },
  { name: "Ззаду", description: "Партнер ззаду" },
  { name: "Наїзник", description: "Партнер зверху" },
  { name: "На боці", description: "Лежачи збоку" },
  { name: "Стоячи", description: "Проти стіни" },
];

// 5. Бажана частота сексу
const SEX_FREQUENCY = [
  { value: "daily", name: "Щоденно" },
  { value: "several_week", name: "Кілька разів на тиждень" },
  { value: "weekly", name: "Приблизно раз на тиждень" },
  { value: "several_month", name: "Кілька разів на місяць" },
  { value: "monthly", name: "Раз на місяць" },
  { value: "several_year", name: "Кілька разів на рік" },
  { value: "depends", name: "Залежить від партнера та настрою" },
  { value: "not_now", name: "Зараз неактуально / Утримання" },
];

// 6. Груповий секс
const GROUP_SEX_ATTITUDE = [
  { value: "love", name: "Люблю", description: "Групові зустрічі, трійки або більше" },
  { value: "sometimes", name: "Іноді", description: "З одним-двома" },
  { value: "no", name: "Ні", description: "Тільки один на один" },
  { value: "want_not_tried", name: "Хочу, але ще не робив" },
  { value: "observer", name: "Спостерігач", description: "Дивлюся" },
];

// 7. Ставлення до речовин у сексі
const SUBSTANCES_ATTITUDE = [
  { value: "no", name: "Ні", description: "Тверезий секс" },
  { value: "light", name: "Іноді", description: "Легкі (поперси)" },
  { value: "yes", name: "Так", description: "Сильніші речовини" },
];

// 8. Улюблені активності (10 варіантів з документа)
const FAVORITE_ACTIVITIES = [
  { name: "Оральний секс", description: "Лизання або смоктання статевого органа" },
  { name: "Анальний секс", description: "Проникнення в анус" },
  { name: "Лизання ануса", description: "Стимуляція ануса язиком" },
  { name: "Взаємний оральний (69)", description: "Одночасний оральний секс обох партнерів" },
  { name: "Фістинг", description: "Введення руки в анус" },
  { name: "Масаж простати", description: "Стимуляція простати пальцем або іграшкою" },
  { name: "Стимуляція сосків", description: "Лизання, кусання або стискання сосків" },
  { name: "Ручна стимуляція", description: "Мастурбація партнера рукою" },
  { name: "Секс із іграшками", description: "Використання вібраторів, пробок чи інших пристроїв" },
  { name: "Легке зв'язування", description: "Використання наручників або мотузок для обмеження рухів" },
];

// 9. Іграшки/Аксесуари
const TOYS_ACCESSORIES = [
  { name: "Вібратори", description: "Пристрої для стимуляції ерогенних зон" },
  { name: "Анальні пробки", description: "Іграшки для анальної підготовки або задоволення" },
  { name: "Наручники", description: "Для зв'язування рук чи ніг" },
  { name: "Мотузки", description: "Для складнішого бондажу" },
  { name: "Підвіс (слінг)", description: "Спеціальна конструкція для анального сексу" },
  { name: "Анальні намиста", description: "Намистини для поступової анальної стимуляції" },
  { name: "Фалоімітатори", description: "Іграшки для проникнення" },
  { name: "Масажери простати", description: "Пристрої для стимуляції простати" },
  { name: "Кільця для пеніса", description: "Обмежують кровотік для тривалішої ерекції" },
  { name: "Маски/Пов'язки на очі", description: "Для закриття очей під час сексу" },
];

// 10. Місце зустрічі
const MEETING_PLACES = [
  { name: "У тебе вдома", description: "У квартирі партнера" },
  { name: "У мене вдома", description: "У моїй квартирі" },
  { name: "Готель", description: "Нейтральне місце" },
  { name: "Сауна/Клуб", description: "Публічне" },
  { name: "Природа", description: "Парк/ліс" },
];

// 11. Після сексу
const AFTER_SEX = [
  { name: "Обіймів/розмов", description: "Емоційний контакт" },
  { name: "Продовжити зустріч", description: "Більше часу разом" },
  { name: "Швидкий душ", description: "Практичний підхід" },
  { name: "Завершити зустріч", description: "Швидке прощання" },
];

// 12. Фетиші/вподобання (15 варіантів)
const FETISHES = [
  { name: "Ведмеді (Bears)", description: "Тяжіння до великих, кремезних та часто волохатих чоловіків" },
  { name: "Шкіра (Leather)", description: "Сексуальний потяг до одягу зі шкіри" },
  { name: "Уніформа (Uniform)", description: "Збудження від вигляду чоловіка у формі" },
  { name: "Спортивний одяг (Sportswear)", description: "Фетиш на спортивний одяг та екіпіровку" },
  { name: "Татусі (Daddies)", description: "Потяг до старших, зрілих та часто домінантних чоловіків" },
  { name: "Спортсмени / Джоки (Jocks)", description: "Тяжіння до чоловіків атлетичної, мускулистої статури" },
  { name: "Твінки (Twinks)", description: "Потяг до молодих (18-25 років), худих, струнких хлопців" },
  { name: "БДСМ (BDSM)", description: "Бондаж, домінування, підкорення, садизм та мазохізм" },
  { name: "Круїзинг (Cruising)", description: "Пошук анонімного та швидкого сексу в громадських місцях" },
  { name: "Фут-фетиш (Foot Fetish)", description: "Сексуальний інтерес до чоловічих ніг, ступень та іноді взуття" },
  { name: "Груповий секс (Group Sex)", description: "Сексуальна активність за участю трьох або більше людей" },
  { name: "Латекс / гума (Latex / Rubber)", description: "Збудження від одягу з латексу або гуми" },
  { name: "Спідня білизна (Underwear Fetish)", description: "Особливий інтерес до чоловічої спідньої білизни" },
  { name: "Вуаєризм (Voyeurism)", description: "Отримання сексуального задоволення від таємного підглядання" },
  { name: "Ексгібіціонізм (Exhibitionism)", description: "Бажання демонструвати своє оголене тіло або сексуальні акти іншим" },
];

// 13. Роль у BDSM (9 варіантів)
const BDSM_ROLES = [
  { name: "Домінант (Dom)", description: "Віддаю перевагу контролю, встановленню правил та психологічному домінуванню" },
  { name: "Майстер / Господар (Master)", description: "Більш глибока форма домінування" },
  { name: "Садист (Sadist)", description: "Отримую сексуальне задоволення від заподіяння партнеру узгодженого фізичного болю" },
  { name: "Сабмісив (Sub)", description: "Отримую задоволення від підкорення, виконання наказів та передачі контролю" },
  { name: "Раб (Slave)", description: "Прагну до повної передачі контролю над собою Майстру/Господарю" },
  { name: "Мазохіст (Masochist)", description: "Отримую сексуальне задоволення від отримання болю, приниження або дискомфорту" },
  { name: "Світч (Switch)", description: "Гнучкий у своїх ролях. Можу отримувати задоволення як від домінування, так і від підкорення" },
  { name: "Кінкі / Практикую різне (Kinky / Experimental)", description: "Мені подобаються нетрадиційні сексуальні практики" },
  { name: "Цікавлюся / Вивчаю (Curious / Learning)", description: "Я новачок у світі BDSM, але мені цікаво спробувати" },
];

// 14. Ставлення до сперми
const CUM_ATTITUDE = [
  { name: "Обожнюю! Ковтаю з насолодою", description: "Це вершина кайфу для мене" },
  { name: "Дуже позитивно", description: "Люблю, коли сперма на тілі чи обличчі — це гаряче й інтимно" },
  { name: "Позитивно", description: "Не проти, якщо це з приємним партнером, додає гостроти" },
  { name: "Нейтрально", description: "Залежить від настрою, можу прийняти, але не фанатію" },
  { name: "Негативно", description: "Не люблю, уникаю, якщо можливо, але можу терпіти" },
  { name: "Категорично проти", description: "Повністю відштовхує, ніколи не контактую з цим" },
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
  const cumAttitude = form.watch("cumAttitude") || [];

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
                    <div className="flex flex-col">
                      <span className="font-medium">{level.name}</span>
                      <span className="text-xs text-muted-foreground">{level.description}</span>
                    </div>
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
                    <div className="flex flex-col">
                      <span className="font-medium">{attitude.name}</span>
                      <span className="text-xs text-muted-foreground">{attitude.description}</span>
                    </div>
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
                    <div className="flex flex-col">
                      <span className="font-medium">{option.name}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FAVORITE_POSITIONS.map((position) => {
            const isSelected = favoritePositions.includes(position.name);
            return (
              <button
                key={position.name}
                type="button"
                onClick={() => toggleItem("favoritePositions", position.name, favoritePositions)}
                className={`p-3 text-left rounded-md border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover-elevate"
                }`}
                data-testid={`tag-position-${position.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Badge variant={isSelected ? "default" : "secondary"} className="mb-1">
                  {position.name}
                </Badge>
                <p className="text-xs text-muted-foreground">{position.description}</p>
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
                    {freq.name}
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
                    <div className="flex flex-col">
                      <span className="font-medium">{attitude.name}</span>
                      {attitude.description && (
                        <span className="text-xs text-muted-foreground">{attitude.description}</span>
                      )}
                    </div>
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
                    <div className="flex flex-col">
                      <span className="font-medium">{attitude.name}</span>
                      <span className="text-xs text-muted-foreground">{attitude.description}</span>
                    </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FAVORITE_ACTIVITIES.map((activity) => {
            const isSelected = favoriteActivities.includes(activity.name);
            return (
              <button
                key={activity.name}
                type="button"
                onClick={() => toggleItem("favoriteActivities", activity.name, favoriteActivities)}
                className={`p-3 text-left rounded-md border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover-elevate"
                }`}
                data-testid={`tag-activity-${activity.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Badge variant={isSelected ? "default" : "secondary"} className="mb-1">
                  {activity.name}
                </Badge>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TOYS_ACCESSORIES.map((toy) => {
            const isSelected = toysAccessories.includes(toy.name);
            return (
              <button
                key={toy.name}
                type="button"
                onClick={() => toggleItem("toysAccessories", toy.name, toysAccessories)}
                className={`p-3 text-left rounded-md border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover-elevate"
                }`}
                data-testid={`tag-toy-${toy.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Badge variant={isSelected ? "default" : "secondary"} className="mb-1">
                  {toy.name}
                </Badge>
                <p className="text-xs text-muted-foreground">{toy.description}</p>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MEETING_PLACES.map((place) => {
            const isSelected = meetingPlaces.includes(place.name);
            return (
              <button
                key={place.name}
                type="button"
                onClick={() => toggleItem("meetingPlaces", place.name, meetingPlaces)}
                className={`p-3 text-left rounded-md border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover-elevate"
                }`}
                data-testid={`tag-place-${place.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Badge variant={isSelected ? "default" : "secondary"} className="mb-1">
                  {place.name}
                </Badge>
                <p className="text-xs text-muted-foreground">{place.description}</p>
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
          <FormLabel>Після сексу я хочу:</FormLabel>
          <FormDescription>Ставлення до емоційного догляду після акту</FormDescription>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AFTER_SEX.map((option) => {
            const isSelected = afterSex.includes(option.name);
            return (
              <button
                key={option.name}
                type="button"
                onClick={() => toggleItem("afterSex", option.name, afterSex)}
                className={`p-3 text-left rounded-md border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover-elevate"
                }`}
                data-testid={`tag-aftersex-${option.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Badge variant={isSelected ? "default" : "secondary"} className="mb-1">
                  {option.name}
                </Badge>
                <p className="text-xs text-muted-foreground">{option.description}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {FETISHES.map((fetish) => {
            const isSelected = fetishes.includes(fetish.name);
            return (
              <button
                key={fetish.name}
                type="button"
                onClick={() => toggleItem("fetishes", fetish.name, fetishes)}
                className={`p-3 text-left rounded-md border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover-elevate"
                }`}
                data-testid={`tag-fetish-${fetish.name.toLowerCase().replace(/\s+/g, "-").replace(/\(/g, "").replace(/\)/g, "")}`}
              >
                <Badge variant={isSelected ? "default" : "secondary"} className="mb-1">
                  {fetish.name}
                </Badge>
                <p className="text-xs text-muted-foreground">{fetish.description}</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BDSM_ROLES.map((role) => {
            const isSelected = bdsmRoles.includes(role.name);
            return (
              <button
                key={role.name}
                type="button"
                onClick={() => toggleItem("bdsmRoles", role.name, bdsmRoles)}
                className={`p-3 text-left rounded-md border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover-elevate"
                }`}
                data-testid={`tag-bdsm-${role.name.toLowerCase().replace(/\s+/g, "-").replace(/\(/g, "").replace(/\)/g, "")}`}
              >
                <Badge variant={isSelected ? "default" : "secondary"} className="mb-1">
                  {role.name}
                </Badge>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {bdsmRoles.length}
        </div>
      </div>

      {/* 14. Ставлення до сперми */}
      <div className="space-y-3">
        <div>
          <FormLabel>Як ви ставитеся до сперми?</FormLabel>
          <FormDescription>Оберіть варіанти, що відповідають вашому ставленню (можна обрати кілька)</FormDescription>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {CUM_ATTITUDE.map((option) => {
            const isSelected = cumAttitude.includes(option.name);
            return (
              <button
                key={option.name}
                type="button"
                onClick={() => toggleItem("cumAttitude", option.name, cumAttitude)}
                className={`p-3 text-left rounded-md border transition-colors ${
                  isSelected
                    ? "bg-primary/10 border-primary"
                    : "bg-card border-border hover-elevate"
                }`}
                data-testid={`tag-cumattitude-${option.name.toLowerCase().replace(/\s+/g, "-").replace(/!/g, "").replace(/\./g, "")}`}
              >
                <Badge variant={isSelected ? "default" : "secondary"} className="mb-1">
                  {option.name}
                </Badge>
                <p className="text-xs text-muted-foreground">{option.description}</p>
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {cumAttitude.length}
        </div>
      </div>
    </div>
  );
}
