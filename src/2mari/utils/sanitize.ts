export function sanitizeText(text: string): string {
  const rules = [
    { pattern: /\bperhaps\b/gi, replacement: "maybe" },
    { pattern: /\butilize\b/gi, replacement: "use" },
    { pattern: /\bthus\b/gi, replacement: "so" },
    { pattern: /\bhowever\b/gi, replacement: "but" },
    { pattern: /\bin order to\b/gi, replacement: "to" },
    { pattern: /\bcommence\b/gi, replacement: "start" },
    { pattern: /\bterminate\b/gi, replacement: "end" },
    { pattern: /\bsubsequently\b/gi, replacement: "later" },
    { pattern: /\bnevertheless\b/gi, replacement: "still" },
    { pattern: /\bdue to the fact that\b/gi, replacement: "because" },
    { pattern: /\bin light of the fact that\b/gi, replacement: "because" },
    { pattern: /\bfor the purpose of\b/gi, replacement: "for" },
    { pattern: /\babsolutely\b/gi, replacement: "" },
    { pattern: /\bactually\b/gi, replacement: "" },
    { pattern: /\bbasically\b/gi, replacement: "" },
    { pattern: /\bdefinitely\b/gi, replacement: "" },
    { pattern: /\bessentially\b/gi, replacement: "" },
    { pattern: /\bextremely\b/gi, replacement: "" },
    { pattern: /\bfrankly\b/gi, replacement: "" },
    { pattern: /\bgenuinely\b/gi, replacement: "" },
    { pattern: /\bhopefully\b/gi, replacement: "" },
    { pattern: /\binterestingly\b/gi, replacement: "" },
    { pattern: /\bmight as well\b/gi, replacement: "" },
    { pattern: /\bmost likely\b/gi, replacement: "" },
    { pattern: /\bpractically\b/gi, replacement: "" },
    { pattern: /\breally\b/gi, replacement: "" },
    { pattern: /\bsimply\b/gi, replacement: "" },
    { pattern: /\bsort of\b/gi, replacement: "" },
    { pattern: /\bsupposedly\b/gi, replacement: "" },
    { pattern: /\bto be honest\b/gi, replacement: "" },
    { pattern: /\btruly\b/gi, replacement: "" },
    { pattern: /\bvery\b/gi, replacement: "" },
    { pattern: /\bwondering if\b/gi, replacement: "" },
    { pattern: /\byou know\b/gi, replacement: "" },
    { pattern: /\bI mean\b/gi, replacement: "" },
    { pattern: /\bkind of\b/gi, replacement: "" },
    { pattern: /\bsorta\b/gi, replacement: "" },
    { pattern: /\bsomewhat\b/gi, replacement: "" },
    { pattern: /\bneedless to say\b/gi, replacement: "" },
    { pattern: /\bit goes without saying\b/gi, replacement: "" }
  ];

  let sanitizedText = text;

  for (const rule of rules) {
    sanitizedText = sanitizedText.replace(rule.pattern, rule.replacement);
  }

  return sanitizedText.trim();
}