import ITranslations from "@models/ITranslations";
import fs from "fs";

interface Translations {
  [key: string]: any; // TODO: better typing
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
    const translations = this.translations[lang];
    if (translations && translations[key]) {
      return translations[key];
    } else {
      return this.translations["en"][key];
    }
  }

  getCommandTranslation(lang: string): ITranslations["commands"] {
    const translations = this.translations[lang];
    if (translations && translations["commands"]) {
      return translations["commands"];
    } else {
      return this.translations["en"]["commands"];
    }
  }

  getInterractionTranslation(lang: string): ITranslations["interactions"] {
    const translations = this.translations[lang];
    if (translations && translations["interactions"]) {
      return translations["interactions"];
    } else {
      return this.translations["en"]["interactions"];
    }
  }

  getEventTranslation(lang: string): ITranslations["events"] {
    const translations = this.translations[lang];
    if (translations && translations["events"]) {
      return translations["events"];
    } else {
      return this.translations["en"]["events"];
    }
  }

  getUtilsTranslation(lang: string): ITranslations["utils"] {
    const translations = this.translations[lang];
    if (translations && translations["utils"]) {
      return translations["utils"];
    } else {
      return this.translations["en"]["utils"];
    }
  }

  getAllTranslations(lang: string): Translations {
    return this.translations[lang];
  }
}

export default LanguageManager;
