const quotes = [
  "Один чистий день має вагу. Збери сьогоднішній.",
  "Фокус на наступну годину, не на все життя.",
  "Твій streak будується маленькими рішеннями.",
  "Дискомфорт тимчасовий, повага до себе довша.",
  "Ти не зобов'язаний реагувати на імпульс.",
  "Кожна пауза перед дією - це +1 до контролю."
];

export function getDailyMotivation(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 100000;
  }
  return quotes[hash % quotes.length];
}
