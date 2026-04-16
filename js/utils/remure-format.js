const LOWER_WORDS = new Set([
  "de", "del", "la", "las", "los", "y", "a", "en", "para", "con", "al", "por"
]);

const ACRONYMS = new Set([
  "IMDAI", "REMURE", "REMUVID", "REMTYS", "SIPINNA", "DIF", "PDF",
  "ZOFEMAT", "SM", "SE", "H", "CFE", "API", "URL"
]);

function normalizeSpaces(text) {
  return String(text ?? "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitWordPunctuation(word) {
  const match = String(word).match(/^([(\["'¿¡]*)(.*?)([)\]"'.,;:!?]*)$/);
  if (!match) {
    return { prefix: "", core: word, suffix: "" };
  }

  return {
    prefix: match[1] || "",
    core: match[2] || "",
    suffix: match[3] || ""
  };
}

function formatCoreWord(core, index) {
  if (!core) return "";

  const upper = core.toUpperCase();
  const lower = core.toLowerCase();

  if (ACRONYMS.has(upper)) {
    return upper === "H" ? "H." : upper;
  }

  if (index > 0 && LOWER_WORDS.has(lower)) {
    return lower;
  }

  if (/^\d+$/.test(core)) {
    return core;
  }

  return core.charAt(0).toUpperCase() + core.slice(1).toLowerCase();
}

function smartTitleCase(text) {
  const clean = normalizeSpaces(text);

  return clean
    .split(" ")
    .map((word, index) => {
      const { prefix, core, suffix } = splitWordPunctuation(word);
      return `${prefix}${formatCoreWord(core, index)}${suffix}`;
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeText(text) {
  return String(text ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function formatDependenciaLabel(id) {
  return smartTitleCase(id);
}

export function formatRegulacionLabel(name) {
  const raw = String(name ?? "").trim();

  const onlyLetters = raw.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "");
  const looksUppercase =
    onlyLetters &&
    onlyLetters === onlyLetters.toUpperCase();

  if (!looksUppercase) {
    return normalizeSpaces(raw);
  }

  return smartTitleCase(raw);
}