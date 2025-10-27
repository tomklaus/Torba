import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Info } from "lucide-react";

interface Step8Props {
  form: UseFormReturn<any>;
}

const BODY_TYPES = [
  { value: "skinny", label: "Худий (Skinny)" },
  { value: "slim", label: "Стрункий / Підтягнутий (Slim / Toned)" },
  { value: "athletic", label: "Спортивний (Athletic)" },
  { value: "muscular", label: "Мускулистий (Muscular)" },
  { value: "average", label: "Середній (Average)" },
  { value: "stocky", label: "Кремезний / Збитий (Stocky / Husky)" },
  { value: "chubby", label: "Повний / Ведмідь (Chubby / Bear)" },
];

const RELATIONSHIP_STATUSES = [
  { value: "single", label: "Вільний" },
  { value: "in_relationship", label: "У стосунках" },
  { value: "open_relationship", label: "У вільних стосунках" },
  { value: "married", label: "У шлюбі / У цивільному партнерстві" },
  { value: "divorced", label: "Розлучений" },
];

const HIV_STATUSES = [
  { value: "negative", label: "Негативний" },
  { value: "negative_prep", label: "Негативний (на PrEP)" },
  { value: "positive_uu", label: "Позитивний (невизначуване навантаження, U=U)" },
  { value: "positive", label: "Позитивний" },
  { value: "unknown", label: "Не знаю / Нещодавно не тестувався" },
];

const ALCOHOL_USE = [
  { value: "never", label: "Зовсім не вживаю" },
  { value: "socially", label: "Соціально / В компанії" },
  { value: "weekends", label: "Лише по вихідних" },
  { value: "often", label: "Часто" },
];

const SMOKING = [
  { value: "no_hate", label: "Не курю і не люблю дим" },
  { value: "no_neutral", label: "Не курю, але ставлюся нейтрально" },
  { value: "sometimes", label: "Іноді в компанії" },
  { value: "regular", label: "Курю сигарети регулярно" },
  { value: "vape", label: "Вейп / IQOS / Glo" },
  { value: "hookah", label: "Тільки кальян" },
  { value: "cannabis", label: "Вживаю канабіс / 420 friendly" },
  { value: "quitting", label: "Кидаю курити" },
];

const LANGUAGES = [
  "Українська",
  "Англійська",
  "Польська",
  "Німецька",
  "Французька",
  "Іспанська",
  "Італійська",
  "Російська",
  "Іврит",
  "Турецька",
  "Інша",
];

const INTERESTS_CATEGORIES = {
  art: {
    label: "Мистецтво та творчість",
    tags: [
      "Фотографія", "Малювання", "Дизайн", "Музика", "Гра на гітарі", "Спів / Вокал",
      "Письменництво", "Поезія", "Театр", "Кіно (як мистецтво)", "Артхаус",
      "Архітектура", "Мода / Стиль", "Музеї / Галереї", "Діджитал-арт",
    ],
  },
  sports: {
    label: "Спорт та активний відпочинок",
    tags: [
      "Тренажерний зал / Фітнес", "Біг", "Плавання", "Велосипед", "Йога / Пілатес",
      "Туризм / Хайкінг", "Скелелазіння", "Футбол", "Волейбол", "Баскетбол",
      "Теніс", "Бойові мистецтва", "Танці", "Лижі / Сноуборд", "Кросфіт", "Воркаут",
    ],
  },
  entertainment: {
    label: "Розваги та медіа",
    tags: [
      "Кіно / Серіали", "Netflix", "Відеоігри", "Настільні ігри", "Аніме / Манга",
      "Стендап", "Концерти / Жива музика", "Фестивалі", "Подкасти", "YouTube",
      "Техно / Електронна музика", "Рок-музика", "Поп-музика", "Квізи / Вікторини",
    ],
  },
  travel: {
    label: "Подорожі",
    tags: [
      "Подорожі Україною", "Подорожі за кордон", "Автоподорожі", "Походи з наметами",
      "Пляжний відпочинок", "Гастротуризм", "Дослідження міста",
    ],
  },
  intellect: {
    label: "Інтелект та саморозвиток",
    tags: [
      "Читання книг", "Історія", "Наука / Наукпоп", "Психологія", "Вивчення мов",
      "Програмування / IT", "Фінанси / Інвестиції", "Медитація", "Волонтерство", "Шахи",
    ],
  },
  food: {
    label: "Їжа та напої",
    tags: [
      "Кулінарія / Готування", "Випічка", "Кава / Кавоман", "Вино", "Крафтове пиво",
      "Коктейлі / Барна культура", "Вегетаріанство / Веганство", "Нові заклади", "Здорова їжа",
    ],
  },
  home: {
    label: "Дім та затишок",
    tags: [
      "Домашні тварини", "Собаки", "Коти", "Рослини / Садівництво", "DIY / Хендмейд",
      "Дизайн інтер'єру", "Домосід",
    ],
  },
  lgbtq: {
    label: "Соціальне життя та LGBTQ+ культура",
    tags: [
      "Вечірки / Клуби", "Зустрічі з друзями", "Drag-культура", "Квір-мистецтво",
      "LGBTQ+ активізм", "Прайди", "Ballroom-культура",
    ],
  },
};

export default function Step8({ form }: Step8Props) {
  const selectedInterests = form.watch("interests") || [];
  const selectedLanguages = form.watch("languages") || [];

  const toggleInterest = (tag: string) => {
    const current = selectedInterests;
    if (current.includes(tag)) {
      form.setValue("interests", current.filter((t: string) => t !== tag));
    } else {
      form.setValue("interests", [...current, tag]);
    }
  };

  const toggleLanguage = (lang: string) => {
    const current = selectedLanguages;
    if (current.includes(lang)) {
      form.setValue("languages", current.filter((l: string) => l !== lang));
    } else {
      form.setValue("languages", [...current, lang]);
    }
  };

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center space-y-2 pb-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Зроби свій профіль неперевершеним
          </h2>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          Ти вже створив основу, а тепер час додати найцікавіше — деталі, які роблять тебе унікальним!
        </p>
        <p className="text-xs text-muted-foreground italic">
          Витрать кілька хвилин зараз, щоб заощадити години на незручних розмовах потім.
        </p>
        <div className="flex items-center justify-center gap-2 pt-2 text-xs text-primary">
          <Info className="h-4 w-4" />
          <span>Всі поля опціональні — можеш пропустити цей крок</span>
        </div>
      </div>

      {/* Про себе */}
      <FormField
        control={form.control}
        name="aboutMe"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Про себе</FormLabel>
            <FormDescription>Розкажи про себе, свої захоплення та те, що робить тебе особливим</FormDescription>
            <FormControl>
              <Textarea
                placeholder="Наприклад: Обожнюю мандрувати, готувати нові страви та вечори з друзями. Завжди відкритий до нових знайомств..."
                className="min-h-24 resize-none"
                maxLength={500}
                {...field}
                data-testid="textarea-aboutme"
              />
            </FormControl>
            <div className="text-xs text-muted-foreground text-right">
              {field.value?.length || 0} / 500
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Чого шукаю */}
      <FormField
        control={form.control}
        name="lookingFor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Чого шукаю</FormLabel>
            <FormDescription>Опиши, кого ти хочеш зустріти та що для тебе важливо</FormDescription>
            <FormControl>
              <Textarea
                placeholder="Наприклад: Шукаю адекватного хлопця для серйозних стосунків, з яким можна і кіно подивитись, і в гори піти..."
                className="min-h-24 resize-none"
                maxLength={500}
                {...field}
                data-testid="textarea-lookingfor"
              />
            </FormControl>
            <div className="text-xs text-muted-foreground text-right">
              {field.value?.length || 0} / 500
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Тип статури */}
      <FormField
        control={form.control}
        name="bodyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Тип статури</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-bodytype">
                  <SelectValue placeholder="Оберіть тип статури" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {BODY_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Статус стосунків */}
      <FormField
        control={form.control}
        name="relationshipStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Статус стосунків</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-relationshipstatus">
                  <SelectValue placeholder="Оберіть статус" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {RELATIONSHIP_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Інтереси/хобі */}
      <div className="space-y-4">
        <div>
          <FormLabel>Інтереси та хобі</FormLabel>
          <FormDescription>Обери все, що тобі близько — це допоможе знайти однодумців</FormDescription>
        </div>
        
        {Object.entries(INTERESTS_CATEGORIES).map(([key, category]) => (
          <div key={key} className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">{category.label}</h4>
            <div className="flex flex-wrap gap-2">
              {category.tags.map((tag) => {
                const isSelected = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-input hover-elevate"
                    }`}
                    data-testid={`tag-interest-${tag.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="text-xs text-muted-foreground">
          Обрано: {selectedInterests.length}
        </div>
      </div>

      {/* ВІЛ-статус */}
      <FormField
        control={form.control}
        name="hivStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ВІЛ-статус</FormLabel>
            <FormDescription>Важлива інформація для багатьох. U=U означає, що людина не може передати вірус</FormDescription>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-hivstatus">
                  <SelectValue placeholder="Оберіть статус" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {HIV_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Вживання алкоголю */}
      <FormField
        control={form.control}
        name="alcoholUse"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Вживання алкоголю</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-alcoholuse">
                  <SelectValue placeholder="Оберіть варіант" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {ALCOHOL_USE.map((option) => (
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

      {/* Куріння */}
      <FormField
        control={form.control}
        name="smoking"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Куріння</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger data-testid="select-smoking">
                  <SelectValue placeholder="Оберіть варіант" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SMOKING.map((option) => (
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

      {/* Мови */}
      <div className="space-y-4">
        <div>
          <FormLabel>Мови, якими володію</FormLabel>
          <FormDescription>Обери всі мови, якими можеш спілкуватися</FormDescription>
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => {
            const isSelected = selectedLanguages.includes(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => toggleLanguage(lang)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background border-input hover-elevate"
                }`}
                data-testid={`tag-language-${lang.toLowerCase().replace(/\s+/g, "-")}`}
              >
                {lang}
              </button>
            );
          })}
        </div>
        <div className="text-xs text-muted-foreground">
          Обрано: {selectedLanguages.length}
        </div>
      </div>
    </div>
  );
}
