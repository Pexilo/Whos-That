import ITranslations from "@models/ITranslations";
import fs from "fs";

interface Translations {
  [key: string]: any;
}

class LanguageManager {
  translations: { [lang: string]: Translations } = {};

  constructor() {
    const langFiles = fs.readdirSync("src/lang");

    langFiles.forEach((file) => {
      if (file.endsWith(".json")) {
        const lang = file.split(".")[0];
        const fileContent = fs.readFileSync(`src/lang/${file}`, "utf-8");
        const translations = JSON.parse(fileContent);

        this.translations[lang] = translations;
      }
    });
  }

  getTranslation(key: string, lang: string): string {
    return this.translations[lang]?.[key] ?? this.translations["en"]?.[key];
  }

  getCommandTranslation(lang: string): ITranslations["commands"] {
    return (
      this.translations[lang]?.["commands"] ??
      this.translations["en"]?.["commands"]
    );
  }

  getInterractionTranslation(lang: string): ITranslations["interactions"] {
    return (
      this.translations[lang]?.["interactions"] ??
      this.translations["en"]?.["interactions"]
    );
  }

  getEventTranslation(lang: string): ITranslations["events"] {
    return (
      this.translations[lang]?.["events"] ?? this.translations["en"]?.["events"]
    );
  }

  getUtilsTranslation(lang: string): ITranslations["utils"] {
    return (
      this.translations[lang]?.["utils"] ?? this.translations["en"]?.["utils"]
    );
  }

  getAllTranslations(lang: string): Translations {
    return this.translations[lang];
  }
}

export default LanguageManager;
