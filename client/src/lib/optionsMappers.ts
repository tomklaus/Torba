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
