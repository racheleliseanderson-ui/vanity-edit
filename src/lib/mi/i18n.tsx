import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "en" | "fr" | "es";

export const LOCALES: { id: Locale; label: string; native: string }[] = [
  { id: "en", label: "English", native: "English" },
  { id: "fr", label: "French", native: "Français" },
  { id: "es", label: "Spanish", native: "Español" },
];

/** UI chrome only. Editorial essays, brand notes and engine reasoning stay in English. */
const EN = {
  "nav.salon": "Salon",
  "nav.edit": "The Edit",
  "nav.products": "Products",
  "nav.desk": "Desk",
  "nav.insights": "Insights",
  "nav.primary": "Primary",
  "nav.skip": "Skip to content",

  "settings.title": "Settings",
  "settings.open": "Open display and language settings",
  "settings.theme": "Theme",
  "settings.access": "Accessibility",
  "settings.language": "Language",
  "settings.langNote": "Interface labels translate. Editorial writing and the engine's reasoning stay in English.",
  "settings.cb": "Colour-blind safe",
  "settings.cbNote": "Recolours meters and diffs, and adds shape and text cues.",
  "settings.motion": "Reduce motion",
  "settings.bigType": "Larger type",
  "settings.close": "Close settings",

  "theme.noir": "Noir",
  "theme.porcelain": "Porcelain",
  "theme.black": "High-contrast black",
  "theme.white": "High-contrast white",

  "stage.Match": "Match",
  "stage.Compare": "Compare",
  "stage.Alternatives": "Alternatives",
  "stage.Tools": "Tools",
  "stage.Bag": "Bag",
  "stage.Kit": "Kit",
  "stage.Packet": "Packet",
  "stage.tablist": "Stages of the edit",
  "stage.prev": "Previous stage",
  "stage.next": "Next stage",

  "edit.smartPaths": "Smart paths",
  "edit.adjust": "Adjust the instrument",
  "edit.closePanel": "Close the instrument",
  "edit.goals": "Goals",
  "edit.skin": "Skin",
  "edit.lifestyle": "Lifestyle",
  "edit.tolerance": "Tolerance & desire",
  "edit.filters": "Filters & budget",
  "edit.shade": "Undertone & depth",
  "edit.bagNow": "What is in the bag now",
  "edit.objects": "Objects",
  "edit.films": "Films",
  "edit.tension": "Tension",
  "edit.risk": "Pancake risk",
  "edit.addToBag": "Add to the bag edit",
  "edit.inBag": "In the bag",
  "edit.apply": "Apply this move",
  "edit.compareIt": "Compare it",
  "edit.exportFull": "Export the full packet",
  "edit.exportCompare": "Export the compare packet",
  "edit.print": "Print this summary",
  "edit.applyPath": "Use this path",
  "edit.undoPath": "Undo",

  "search.label": "Search",
  "search.lane": "Lane",
  "search.band": "Price band",
  "search.prefs": "Preferences",
  "search.houses": "Houses",
  "search.sort": "Sort results",
  "search.clear": "Clear everything",
  "search.recent": "Recent searches",
  "search.thin": "Thin films only",
  "search.shown": "shown",
  "search.filtersOn": "filters on",

  "sets.title": "Scenario sets",
  "sets.save": "Save this set",
  "sets.name": "Name this set",
  "sets.rename": "Rename",
  "sets.duplicate": "Duplicate",
  "sets.delete": "Delete",
  "sets.undo": "Undo delete",
  "sets.copyLink": "Copy link",
  "sets.import": "Import from a link",
  "sets.manage": "Manage sets",
} as const;

export type Key = keyof typeof EN;

const FR: Partial<Record<Key, string>> = {
  "nav.salon": "Salon",
  "nav.edit": "L'Édit",
  "nav.products": "Produits",
  "nav.desk": "Le Bureau",
  "nav.insights": "Regards",
  "nav.primary": "Principal",
  "nav.skip": "Aller au contenu",
  "settings.title": "Réglages",
  "settings.open": "Ouvrir les réglages d'affichage et de langue",
  "settings.theme": "Thème",
  "settings.access": "Accessibilité",
  "settings.language": "Langue",
  "settings.langNote": "Les libellés de l'interface sont traduits. Les textes éditoriaux et le raisonnement du moteur restent en anglais.",
  "settings.cb": "Sûr pour le daltonisme",
  "settings.cbNote": "Recolore les jauges et les écarts, et ajoute des repères de forme et de texte.",
  "settings.motion": "Réduire les animations",
  "settings.bigType": "Texte plus grand",
  "settings.close": "Fermer les réglages",
  "theme.noir": "Noir",
  "theme.porcelain": "Porcelaine",
  "theme.black": "Noir contrasté",
  "theme.white": "Blanc contrasté",
  "stage.Match": "Accord",
  "stage.Compare": "Comparer",
  "stage.Alternatives": "Alternatives",
  "stage.Tools": "Outils",
  "stage.Bag": "Trousse",
  "stage.Kit": "Kit",
  "stage.Packet": "Dossier",
  "stage.tablist": "Étapes de l'édit",
  "stage.prev": "Étape précédente",
  "stage.next": "Étape suivante",
  "edit.smartPaths": "Chemins intelligents",
  "edit.adjust": "Régler l'instrument",
  "edit.closePanel": "Fermer l'instrument",
  "edit.goals": "Objectifs",
  "edit.skin": "Peau",
  "edit.lifestyle": "Mode de vie",
  "edit.tolerance": "Tolérance & désir",
  "edit.filters": "Filtres & budget",
  "edit.shade": "Sous-ton & profondeur",
  "edit.bagNow": "Ce qu'il y a déjà dans la trousse",
  "edit.objects": "Objets",
  "edit.films": "Films",
  "edit.tension": "Tension",
  "edit.risk": "Risque d'effet plâtre",
  "edit.addToBag": "Ajouter à la trousse",
  "edit.inBag": "Dans la trousse",
  "edit.apply": "Appliquer ce changement",
  "edit.compareIt": "Comparer",
  "edit.exportFull": "Exporter le dossier complet",
  "edit.exportCompare": "Exporter le dossier comparatif",
  "edit.print": "Imprimer ce résumé",
  "edit.applyPath": "Utiliser ce chemin",
  "edit.undoPath": "Annuler",
  "search.label": "Recherche",
  "search.lane": "Famille",
  "search.band": "Tranche de prix",
  "search.prefs": "Préférences",
  "search.houses": "Maisons",
  "search.sort": "Trier les résultats",
  "search.clear": "Tout effacer",
  "search.recent": "Recherches récentes",
  "search.thin": "Films fins seulement",
  "search.shown": "affichés",
  "search.filtersOn": "filtres actifs",
  "sets.title": "Jeux de scénarios",
  "sets.save": "Enregistrer ce jeu",
  "sets.name": "Nommer ce jeu",
  "sets.rename": "Renommer",
  "sets.duplicate": "Dupliquer",
  "sets.delete": "Supprimer",
  "sets.undo": "Annuler la suppression",
  "sets.copyLink": "Copier le lien",
  "sets.import": "Importer depuis un lien",
  "sets.manage": "Gérer les jeux",
};

const ES: Partial<Record<Key, string>> = {
  "nav.salon": "Salón",
  "nav.edit": "La Edición",
  "nav.products": "Productos",
  "nav.desk": "El Escritorio",
  "nav.insights": "Miradas",
  "nav.primary": "Principal",
  "nav.skip": "Ir al contenido",
  "settings.title": "Ajustes",
  "settings.open": "Abrir ajustes de pantalla e idioma",
  "settings.theme": "Tema",
  "settings.access": "Accesibilidad",
  "settings.language": "Idioma",
  "settings.langNote": "Las etiquetas de la interfaz se traducen. Los textos editoriales y el razonamiento del motor siguen en inglés.",
  "settings.cb": "Seguro para daltonismo",
  "settings.cbNote": "Recolorea medidores y diferencias, y añade pistas de forma y texto.",
  "settings.motion": "Reducir movimiento",
  "settings.bigType": "Texto más grande",
  "settings.close": "Cerrar ajustes",
  "theme.noir": "Noir",
  "theme.porcelain": "Porcelana",
  "theme.black": "Negro de alto contraste",
  "theme.white": "Blanco de alto contraste",
  "stage.Match": "Coincidencia",
  "stage.Compare": "Comparar",
  "stage.Alternatives": "Alternativas",
  "stage.Tools": "Herramientas",
  "stage.Bag": "Neceser",
  "stage.Kit": "Kit",
  "stage.Packet": "Dosier",
  "stage.tablist": "Etapas de la edición",
  "stage.prev": "Etapa anterior",
  "stage.next": "Etapa siguiente",
  "edit.smartPaths": "Rutas inteligentes",
  "edit.adjust": "Ajustar el instrumento",
  "edit.closePanel": "Cerrar el instrumento",
  "edit.goals": "Objetivos",
  "edit.skin": "Piel",
  "edit.lifestyle": "Estilo de vida",
  "edit.tolerance": "Tolerancia y deseo",
  "edit.filters": "Filtros y presupuesto",
  "edit.shade": "Subtono y profundidad",
  "edit.bagNow": "Lo que ya hay en el neceser",
  "edit.objects": "Objetos",
  "edit.films": "Capas",
  "edit.tension": "Tensión",
  "edit.risk": "Riesgo de efecto máscara",
  "edit.addToBag": "Añadir al neceser",
  "edit.inBag": "En el neceser",
  "edit.apply": "Aplicar este cambio",
  "edit.compareIt": "Comparar",
  "edit.exportFull": "Exportar el dosier completo",
  "edit.exportCompare": "Exportar el dosier comparativo",
  "edit.print": "Imprimir este resumen",
  "edit.applyPath": "Usar esta ruta",
  "edit.undoPath": "Deshacer",
  "search.label": "Búsqueda",
  "search.lane": "Familia",
  "search.band": "Rango de precio",
  "search.prefs": "Preferencias",
  "search.houses": "Casas",
  "search.sort": "Ordenar resultados",
  "search.clear": "Borrar todo",
  "search.recent": "Búsquedas recientes",
  "search.thin": "Solo capas finas",
  "search.shown": "mostrados",
  "search.filtersOn": "filtros activos",
  "sets.title": "Conjuntos de escenarios",
  "sets.save": "Guardar este conjunto",
  "sets.name": "Nombrar este conjunto",
  "sets.rename": "Renombrar",
  "sets.duplicate": "Duplicar",
  "sets.delete": "Eliminar",
  "sets.undo": "Deshacer eliminación",
  "sets.copyLink": "Copiar enlace",
  "sets.import": "Importar desde un enlace",
  "sets.manage": "Gestionar conjuntos",
};

const DICTS: Record<Locale, Partial<Record<Key, string>>> = { en: EN, fr: FR, es: ES };
const KEY = "mi-locale";

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: Key) => string;
}

const Ctx = createContext<I18nCtx>({ locale: "en", setLocale: () => {}, t: (k) => EN[k] });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(KEY);
      if (stored === "fr" || stored === "es" || stored === "en") {
        setLocaleState(stored);
        document.documentElement.lang = stored;
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.documentElement.lang = l;
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<I18nCtx>(
    () => ({ locale, setLocale, t: (key: Key) => DICTS[locale][key] ?? EN[key] }),
    [locale, setLocale],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
