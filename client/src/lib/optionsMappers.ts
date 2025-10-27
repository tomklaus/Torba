// Утиліти для конвертації value <-> label для полів профілю

import {
  LOCATION_FORMATS,
  TRAVEL_GEOGRAPHY,
  AVAILABILITY_OPTIONS,
  MIN_NOTICE_OPTIONS,
  MIN_DURATION_OPTIONS,
  PHOTO_VIDEO_CONSENT,
  PAYMENT_METHODS,
  TRANSPORT_COSTS,
} from "./constants";

// Константи для Step8 (додаткові поля)
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

// Константи для Step 10 (сексуальний профіль)
const SEX_EXPERIENCE = [
  { value: "beginner", label: "Початківець" },
  { value: "intermediate", label: "Середній" },
  { value: "experienced", label: "Досвідчений" },
  { value: "expert", label: "Експерт" },
];

const CONDOM_ATTITUDE = [
  { value: "always", label: "Завжди" },
  { value: "usually", label: "Зазвичай" },
  { value: "sometimes", label: "Іноді" },
  { value: "never", label: "Ніколи" },
];

const CIRCUMCISION = [
  { value: "cut", label: "Обрізаний" },
  { value: "uncut", label: "Необрізаний" },
];

const FAVORITE_POSITIONS = [
  { value: "missionary", label: "Місіонерська" },
  { value: "doggy", label: "Ззаду" },
  { value: "cowboy", label: "Наїзник" },
  { value: "side", label: "На боці" },
  { value: "standing", label: "Стоячи" },
];

const SEX_FREQUENCY = [
  { value: "daily", label: "Щоденно" },
  { value: "several_week", label: "Кілька разів на тиждень" },
  { value: "once_week", label: "Раз на тиждень" },
  { value: "several_month", label: "Кілька разів на місяць" },
  { value: "once_month", label: "Раз на місяць" },
  { value: "several_year", label: "Кілька разів на рік" },
  { value: "depends", label: "Залежить від партнера" },
  { value: "abstaining", label: "Зараз неактуально/Утримання" },
];

const GROUP_SEX = [
  { value: "love", label: "Люблю" },
  { value: "sometimes", label: "Іноді" },
  { value: "no", label: "Ні" },
  { value: "want", label: "Хочу але ще не робив" },
  { value: "spectator", label: "Спостерігач" },
];

const SUBSTANCES_ATTITUDE = [
  { value: "no", label: "Ні (тверезий)" },
  { value: "light", label: "Іноді (легкі поперси)" },
  { value: "heavy", label: "Так (сильніші)" },
];

const FAVORITE_ACTIVITIES = [
  { value: "oral", label: "Оральний" },
  { value: "anal", label: "Анальний" },
  { value: "rimming", label: "Лизання ануса" },
  { value: "69", label: "69" },
  { value: "fisting", label: "Фістинг" },
  { value: "prostate", label: "Масаж простати" },
  { value: "nipple", label: "Стимуляція сосків" },
  { value: "handjob", label: "Ручна стимуляція" },
  { value: "toys", label: "Секс з іграшками" },
  { value: "bondage_light", label: "Легке зв'язування" },
];

const TOYS_ACCESSORIES = [
  { value: "vibrators", label: "Вібратори" },
  { value: "plugs", label: "Анальні пробки" },
  { value: "handcuffs", label: "Наручники" },
  { value: "ropes", label: "Мотузки" },
  { value: "sling", label: "Підвіс" },
  { value: "beads", label: "Анальні намиста" },
  { value: "dildos", label: "Фалоімітатори" },
  { value: "prostate_massagers", label: "Масажери простати" },
  { value: "cock_rings", label: "Кільця для пеніса" },
  { value: "masks", label: "Маски/Пов'язки" },
];

const MEETING_PLACES = [
  { value: "home", label: "Дома" },
  { value: "hotel", label: "Готель" },
  { value: "sauna", label: "Сауна/Клуб" },
  { value: "nature", label: "Природа" },
];

const AFTER_SEX = [
  { value: "cuddle", label: "Обійми/Розмова" },
  { value: "shower", label: "Швидкий душ" },
  { value: "sleep_together", label: "Ніч разом" },
  { value: "nothing", label: "Нічого" },
];

const FETISHES = [
  { value: "bears", label: "Bears" },
  { value: "leather", label: "Leather" },
  { value: "uniform", label: "Uniform" },
  { value: "sportswear", label: "Sportswear" },
  { value: "daddies", label: "Daddies" },
  { value: "jocks", label: "Jocks" },
  { value: "twinks", label: "Twinks" },
  { value: "bdsm", label: "BDSM" },
  { value: "cruising", label: "Cruising" },
  { value: "foot", label: "Foot Fetish" },
  { value: "group", label: "Group Sex" },
  { value: "latex", label: "Latex/Rubber" },
  { value: "underwear", label: "Underwear Fetish" },
  { value: "voyeurism", label: "Voyeurism" },
  { value: "exhibitionism", label: "Exhibitionism" },
];

const BDSM_ROLES = [
  { value: "dom", label: "Dom" },
  { value: "master", label: "Master" },
  { value: "sadist", label: "Sadist" },
  { value: "sub", label: "Sub" },
  { value: "slave", label: "Slave" },
  { value: "masochist", label: "Masochist" },
  { value: "switch", label: "Switch" },
  { value: "kinky", label: "Kinky/Experimental" },
  { value: "curious", label: "Curious/Learning" },
];

// Мапа типу поля -> опції
const OPTIONS_MAP = {
  locationFormats: LOCATION_FORMATS,
  travelGeography: TRAVEL_GEOGRAPHY,
  availability: AVAILABILITY_OPTIONS,
  minNotice: MIN_NOTICE_OPTIONS,
  minDuration: MIN_DURATION_OPTIONS,
  photoVideoConsent: PHOTO_VIDEO_CONSENT,
  paymentMethods: PAYMENT_METHODS,
  transportCosts: TRANSPORT_COSTS,
  alcoholUse: ALCOHOL_USE,
  smoking: SMOKING,
  bodyType: BODY_TYPES,
  relationshipStatus: RELATIONSHIP_STATUSES,
  hivStatus: HIV_STATUSES,
  sexExperience: SEX_EXPERIENCE,
  condomAttitude: CONDOM_ATTITUDE,
  circumcision: CIRCUMCISION,
  favoritePositions: FAVORITE_POSITIONS,
  sexFrequency: SEX_FREQUENCY,
  groupSex: GROUP_SEX,
  substancesAttitude: SUBSTANCES_ATTITUDE,
  favoriteActivities: FAVORITE_ACTIVITIES,
  toysAccessories: TOYS_ACCESSORIES,
  meetingPlaces: MEETING_PLACES,
  afterSex: AFTER_SEX,
  fetishes: FETISHES,
  bdsmRoles: BDSM_ROLES,
};

type FieldType = keyof typeof OPTIONS_MAP;

// Конвертує value -> label
export function valueToLabel(fieldType: FieldType, value: string): string {
  const options = OPTIONS_MAP[fieldType];
  if (!options) return value;
  
  const option = options.find((opt) => opt.value === value);
  return option ? option.label : value;
}

// Конвертує label -> value
export function labelToValue(fieldType: FieldType, label: string): string {
  const options = OPTIONS_MAP[fieldType];
  if (!options) return label;
  
  const option = options.find((opt) => opt.label === label);
  return option ? option.value : label;
}

// Конвертує масив values -> масив labels
export function valuesToLabels(fieldType: FieldType, values: string[]): string[] {
  return values.map((value) => valueToLabel(fieldType, value));
}

// Конвертує масив labels -> масив values
export function labelsToValues(fieldType: FieldType, labels: string[]): string[] {
  return labels.map((label) => labelToValue(fieldType, label));
}

// Отримує всі labels для певного типу поля
export function getAllLabels(fieldType: FieldType): string[] {
  const options = OPTIONS_MAP[fieldType];
  if (!options) return [];
  return options.map((opt) => opt.label);
}

// Отримує всі values для певного типу поля
export function getAllValues(fieldType: FieldType): string[] {
  const options = OPTIONS_MAP[fieldType];
  if (!options) return [];
  return options.map((opt) => opt.value);
}
