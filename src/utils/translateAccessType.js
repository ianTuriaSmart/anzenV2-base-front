export function translateAccessType(alias, t) {
  if (alias.endsWith("_young")) return t("young");
  if (alias.endsWith("_family")) return t("family");
  if (alias.endsWith("_reduced")) return t("reduced");

  const normalizedAlias = alias.split("_")[0];

  if (["daily", "monthly", "annual", "months3"].includes(normalizedAlias)) {
    return t("adult");
  }

  if (["season"].includes(normalizedAlias)) {
    return t("season");
  }

  // Casos como bonus10, weeks5, etc.
  const match = normalizedAlias.match(/^([a-z]+)(\d+)$/);
  if (match) {
    const [, type, count] = match;

    const templates = {
      days: "daysTemplate",
      weeks: "weeksTemplate",
      months: "monthsTemplate",
      bonus: "bonusTemplate",
    };

    const key = templates[type];
    return key ? t(key, { count }) : alias;
  }

  // Si no encaja con nada anterior, devolver alias sin traducir
  return alias;
}
