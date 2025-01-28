// FUA add more specific rules here and tweak the existing ones below

export function sanitizeText(text: string): string {
  const rules = [
    { pattern: /\bfoo\b/gi, replacement: "bar" },
    { pattern: /\bhello\b/gi, replacement: "hi" },
    { pattern: /\bworld\b/gi, replacement: "earth" },
  ]

  let sanitizedText = text

  for (const rule of rules) {
    sanitizedText = sanitizedText.replace(rule.pattern, rule.replacement)
  }

  return sanitizedText
}