export function getResourceIcon(resourceName = "") {
  const name = resourceName.toLowerCase();

  if (
    name.includes("tenis") ||
    name.includes("tennis") ||
    name.includes("padel")
  ) {
    return "sports_tennis";
  }

  if (
    name.includes("futbol") ||
    name.includes("fútbol") ||
    name.includes("futbito")
  ) {
    return "sports_soccer"; // o 'stadium'
  }

  if (
    name.includes("biblio") ||
    name.includes("sala") ||
    name.includes("estudio")
  ) {
    return "local_library"; // o 'meeting_room'
  }

  if (name.includes("piscina")) {
    return "pool";
  }

  if (name.includes("gimnasio")) {
    return "fitness_center";
  }

  // Default fallback
  return "location_on";
}
