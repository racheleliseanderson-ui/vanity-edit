import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "en" | "fr" | "es" | "de" | "it" | "pt" | "ja" | "ko" | "zh" | "ar";

export const LOCALES: { id: Locale; label: string; native: string; rtl?: boolean }[] = [
  { id: "en", label: "English", native: "English" },
  { id: "fr", label: "French", native: "Français" },
  { id: "es", label: "Spanish", native: "Español" },
  { id: "de", label: "German", native: "Deutsch" },
  { id: "it", label: "Italian", native: "Italiano" },
  { id: "pt", label: "Portuguese (Brazil)", native: "Português" },
  { id: "ja", label: "Japanese", native: "日本語" },
  { id: "ko", label: "Korean", native: "한국어" },
  { id: "zh", label: "Chinese", native: "中文" },
  { id: "ar", label: "Arabic", native: "العربية", rtl: true },
];

export const isRtl = (l: Locale) => LOCALES.find((x) => x.id === l)?.rtl === true;

/** UI chrome only. Editorial essays, brand notes and engine reasoning stay in English. */
const EN = {
  "nav.salon": "Salon",
  "nav.home": "Home",
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
  "stage.Wear": "Wear",
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
  "edit.print": "Print / save as PDF",
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

  "run.title": "Pipeline runs",
  "run.run": "Run",
  "run.rerun": "Re-run",
  "run.hold": "Hold live update",
  "run.holding": "Holding — inputs are queued",
  "run.reset": "Reset to path defaults",
  "run.revert": "Revert to last saved run",
  "run.save": "Save this run",
  "run.name": "Name this run",
  "run.load": "Load",
  "run.diff": "Diff",
  "run.history": "Run history",
  "run.none": "No runs saved in this browser yet.",
  "run.stale": "Inputs changed since this ran",
  "run.status": "Pipeline status",
  "run.idle": "idle",
  "run.done": "done",
  "run.identical": "These two runs have identical inputs.",
  "region.label": "Region",
} as const;

export type Key = keyof typeof EN;

const FR: Partial<Record<Key, string>> = {
  "nav.salon": "Salon",
  "nav.home": "Accueil",
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
  "stage.Wear": "Tenue",
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
  "edit.print": "Imprimer / enregistrer en PDF",
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
  "nav.home": "Inicio",
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
  "stage.Wear": "Duración",
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
  "edit.print": "Imprimir / guardar como PDF",
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

const DE: Partial<Record<Key, string>> = {
  "nav.salon": "Salon", "nav.home": "Start", "nav.edit": "Die Edit", "nav.products": "Produkte", "nav.desk": "Der Tisch",
  "nav.insights": "Einsichten", "nav.primary": "Haupt", "nav.skip": "Zum Inhalt",
  "settings.title": "Einstellungen", "settings.theme": "Thema", "settings.access": "Barrierefreiheit",
  "settings.language": "Sprache", "settings.cb": "Farbenblind-sicher", "settings.motion": "Bewegung reduzieren",
  "settings.bigType": "Größere Schrift", "settings.close": "Einstellungen schließen",
  "theme.porcelain": "Porzellan", "theme.black": "Schwarz, hoher Kontrast", "theme.white": "Weiß, hoher Kontrast",
  "stage.Match": "Abgleich", "stage.Compare": "Vergleich", "stage.Alternatives": "Alternativen",
  "stage.Wear": "Halt",
  "stage.Tools": "Werkzeuge", "stage.Bag": "Tasche", "stage.Packet": "Dossier",
  "stage.prev": "Vorherige Stufe", "stage.next": "Nächste Stufe",
  "edit.smartPaths": "Kluge Wege", "edit.adjust": "Instrument einstellen", "edit.objects": "Objekte",
  "edit.films": "Filme", "edit.tension": "Spannung", "edit.risk": "Maskenrisiko",
  "edit.addToBag": "Zur Tasche hinzufügen", "edit.inBag": "In der Tasche", "edit.apply": "Anwenden",
  "edit.exportFull": "Entscheidungsdossier exportieren", "edit.print": "Drucken", "edit.applyPath": "Diesen Weg nutzen",
  "search.label": "Suche", "search.lane": "Familie", "search.band": "Preisklasse", "search.houses": "Häuser",
  "run.title": "Durchläufe", "run.run": "Starten", "run.rerun": "Neu starten", "run.hold": "Live-Update anhalten",
  "run.save": "Durchlauf speichern", "run.history": "Verlauf", "run.diff": "Vergleichen", "run.status": "Status",
  "region.label": "Region",
};

const IT: Partial<Record<Key, string>> = {
  "nav.salon": "Salone", "nav.home": "Home", "nav.edit": "L'Edit", "nav.products": "Prodotti", "nav.desk": "Il Banco",
  "nav.insights": "Sguardi", "nav.primary": "Principale", "nav.skip": "Vai al contenuto",
  "settings.title": "Impostazioni", "settings.theme": "Tema", "settings.access": "Accessibilità",
  "settings.language": "Lingua", "settings.cb": "Sicuro per daltonici", "settings.motion": "Riduci il movimento",
  "settings.bigType": "Testo più grande", "settings.close": "Chiudi impostazioni",
  "theme.porcelain": "Porcellana", "theme.black": "Nero a contrasto", "theme.white": "Bianco a contrasto",
  "stage.Match": "Corrispondenza", "stage.Compare": "Confronto", "stage.Alternatives": "Alternative",
  "stage.Wear": "Tenuta",
  "stage.Tools": "Strumenti", "stage.Bag": "Beauty", "stage.Packet": "Dossier",
  "stage.prev": "Fase precedente", "stage.next": "Fase successiva",
  "edit.smartPaths": "Percorsi intelligenti", "edit.adjust": "Regola lo strumento", "edit.objects": "Oggetti",
  "edit.films": "Film", "edit.tension": "Tensione", "edit.risk": "Rischio effetto maschera",
  "edit.addToBag": "Aggiungi al beauty", "edit.inBag": "Nel beauty", "edit.apply": "Applica",
  "edit.exportFull": "Esporta il dossier decisionale", "edit.print": "Stampa", "edit.applyPath": "Usa questo percorso",
  "search.label": "Ricerca", "search.lane": "Famiglia", "search.band": "Fascia di prezzo", "search.houses": "Case",
  "run.title": "Esecuzioni", "run.run": "Esegui", "run.rerun": "Riesegui", "run.hold": "Blocca l'aggiornamento",
  "run.save": "Salva l'esecuzione", "run.history": "Cronologia", "run.diff": "Confronta", "run.status": "Stato",
  "region.label": "Regione",
};

const PT: Partial<Record<Key, string>> = {
  "nav.salon": "Salão", "nav.home": "Início", "nav.edit": "A Edição", "nav.products": "Produtos", "nav.desk": "A Bancada",
  "nav.insights": "Olhares", "nav.primary": "Principal", "nav.skip": "Ir para o conteúdo",
  "settings.title": "Ajustes", "settings.theme": "Tema", "settings.access": "Acessibilidade",
  "settings.language": "Idioma", "settings.cb": "Seguro para daltonismo", "settings.motion": "Reduzir movimento",
  "settings.bigType": "Texto maior", "settings.close": "Fechar ajustes",
  "theme.porcelain": "Porcelana", "theme.black": "Preto de alto contraste", "theme.white": "Branco de alto contraste",
  "stage.Match": "Correspondência", "stage.Compare": "Comparar", "stage.Alternatives": "Alternativas",
  "stage.Wear": "Duración",
  "stage.Tools": "Ferramentas", "stage.Bag": "Nécessaire", "stage.Packet": "Dossiê",
  "stage.prev": "Etapa anterior", "stage.next": "Próxima etapa",
  "edit.smartPaths": "Caminhos inteligentes", "edit.adjust": "Ajustar o instrumento", "edit.objects": "Objetos",
  "edit.films": "Camadas", "edit.tension": "Tensão", "edit.risk": "Risco de máscara",
  "edit.addToBag": "Adicionar ao nécessaire", "edit.inBag": "No nécessaire", "edit.apply": "Aplicar",
  "edit.exportFull": "Exportar o dossiê de decisão", "edit.print": "Imprimir", "edit.applyPath": "Usar este caminho",
  "search.label": "Busca", "search.lane": "Família", "search.band": "Faixa de preço", "search.houses": "Casas",
  "run.title": "Execuções", "run.run": "Executar", "run.rerun": "Reexecutar", "run.hold": "Pausar atualização",
  "run.save": "Salvar execução", "run.history": "Histórico", "run.diff": "Comparar", "run.status": "Estado",
  "region.label": "Região",
};

const JA: Partial<Record<Key, string>> = {
  "nav.salon": "サロン", "nav.home": "ホーム", "nav.edit": "エディット", "nav.products": "製品", "nav.desk": "デスク",
  "nav.insights": "考察", "nav.primary": "メイン", "nav.skip": "本文へ",
  "settings.title": "設定", "settings.theme": "テーマ", "settings.access": "アクセシビリティ",
  "settings.language": "言語", "settings.cb": "色覚に配慮", "settings.motion": "動きを減らす",
  "settings.bigType": "文字を大きく", "settings.close": "設定を閉じる",
  "theme.porcelain": "ポーセリン", "theme.black": "高コントラスト（黒）", "theme.white": "高コントラスト（白）",
  "stage.Match": "マッチ", "stage.Compare": "比較", "stage.Alternatives": "代替案",
  "stage.Tools": "ツール", "stage.Bag": "ポーチ", "stage.Packet": "ドシエ",
  "stage.prev": "前の段階", "stage.next": "次の段階",
  "edit.smartPaths": "スマートパス", "edit.adjust": "instrumentを調整", "edit.objects": "アイテム数",
  "edit.films": "膜の数", "edit.tension": "張力", "edit.risk": "厚塗りリスク",
  "edit.addToBag": "ポーチに追加", "edit.inBag": "ポーチ内", "edit.apply": "適用",
  "edit.exportFull": "決定ドシエを書き出す", "edit.print": "印刷", "edit.applyPath": "このパスを使う",
  "search.label": "検索", "search.lane": "系統", "search.band": "価格帯", "search.houses": "ブランド",
  "run.title": "実行", "run.run": "実行", "run.rerun": "再実行", "run.hold": "自動更新を停止",
  "run.save": "この実行を保存", "run.history": "履歴", "run.diff": "差分", "run.status": "状態",
  "region.label": "地域",
};

const KO: Partial<Record<Key, string>> = {
  "nav.salon": "살롱", "nav.home": "홈", "nav.edit": "에디트", "nav.products": "제품", "nav.desk": "데스크",
  "nav.insights": "인사이트", "nav.primary": "주요", "nav.skip": "본문으로",
  "settings.title": "설정", "settings.theme": "테마", "settings.access": "접근성",
  "settings.language": "언어", "settings.cb": "색약 안전", "settings.motion": "동작 줄이기",
  "settings.bigType": "큰 글자", "settings.close": "설정 닫기",
  "theme.porcelain": "포슬린", "theme.black": "고대비 검정", "theme.white": "고대비 흰색",
  "stage.Match": "매치", "stage.Compare": "비교", "stage.Alternatives": "대안",
  "stage.Tools": "도구", "stage.Bag": "파우치", "stage.Packet": "도시에",
  "stage.prev": "이전 단계", "stage.next": "다음 단계",
  "edit.smartPaths": "스마트 경로", "edit.adjust": "인스트루먼트 조정", "edit.objects": "개수",
  "edit.films": "레이어", "edit.tension": "긴장도", "edit.risk": "두꺼움 위험",
  "edit.addToBag": "파우치에 추가", "edit.inBag": "파우치에 있음", "edit.apply": "적용",
  "edit.exportFull": "결정 도시에 내보내기", "edit.print": "인쇄", "edit.applyPath": "이 경로 사용",
  "search.label": "검색", "search.lane": "계열", "search.band": "가격대", "search.houses": "브랜드",
  "run.title": "실행", "run.run": "실행", "run.rerun": "다시 실행", "run.hold": "실시간 갱신 중지",
  "run.save": "실행 저장", "run.history": "기록", "run.diff": "차이", "run.status": "상태",
  "region.label": "지역",
};

const ZH: Partial<Record<Key, string>> = {
  "nav.salon": "沙龙", "nav.home": "首页", "nav.edit": "编辑台", "nav.products": "产品", "nav.desk": "工作台",
  "nav.insights": "洞察", "nav.primary": "主要", "nav.skip": "跳到正文",
  "settings.title": "设置", "settings.theme": "主题", "settings.access": "无障碍",
  "settings.language": "语言", "settings.cb": "色盲友好", "settings.motion": "减少动效",
  "settings.bigType": "更大字号", "settings.close": "关闭设置",
  "theme.porcelain": "瓷白", "theme.black": "高对比黑", "theme.white": "高对比白",
  "stage.Match": "匹配", "stage.Compare": "对比", "stage.Alternatives": "替代方案",
  "stage.Tools": "工具", "stage.Bag": "化妆包", "stage.Packet": "档案",
  "stage.prev": "上一步", "stage.next": "下一步",
  "edit.smartPaths": "智能路径", "edit.adjust": "调整仪器", "edit.objects": "件数",
  "edit.films": "层数", "edit.tension": "张力", "edit.risk": "厚重风险",
  "edit.addToBag": "加入化妆包", "edit.inBag": "已在包中", "edit.apply": "应用",
  "edit.exportFull": "导出决策档案", "edit.print": "打印", "edit.applyPath": "使用此路径",
  "search.label": "搜索", "search.lane": "类别", "search.band": "价格区间", "search.houses": "品牌",
  "run.title": "运行", "run.run": "运行", "run.rerun": "重新运行", "run.hold": "暂停实时更新",
  "run.save": "保存此次运行", "run.history": "历史", "run.diff": "差异", "run.status": "状态",
  "region.label": "地区",
};

const AR: Partial<Record<Key, string>> = {
  "nav.salon": "الصالون", "nav.home": "الرئيسية", "nav.edit": "التحرير", "nav.products": "المنتجات", "nav.desk": "المكتب",
  "nav.insights": "قراءات", "nav.primary": "الرئيسية", "nav.skip": "الانتقال إلى المحتوى",
  "settings.title": "الإعدادات", "settings.theme": "المظهر", "settings.access": "إمكانية الوصول",
  "settings.language": "اللغة", "settings.cb": "آمن لعمى الألوان", "settings.motion": "تقليل الحركة",
  "settings.bigType": "خط أكبر", "settings.close": "إغلاق الإعدادات",
  "theme.porcelain": "بورسلين", "theme.black": "أسود عالي التباين", "theme.white": "أبيض عالي التباين",
  "stage.Match": "المطابقة", "stage.Compare": "المقارنة", "stage.Alternatives": "البدائل",
  "stage.Tools": "الأدوات", "stage.Bag": "الحقيبة", "stage.Packet": "الملف",
  "stage.prev": "المرحلة السابقة", "stage.next": "المرحلة التالية",
  "edit.smartPaths": "مسارات ذكية", "edit.adjust": "اضبط الأداة", "edit.objects": "العناصر",
  "edit.films": "الطبقات", "edit.tension": "التوتر", "edit.risk": "خطر الطبقة السميكة",
  "edit.addToBag": "أضف إلى الحقيبة", "edit.inBag": "في الحقيبة", "edit.apply": "تطبيق",
  "edit.exportFull": "تصدير ملف القرار", "edit.print": "طباعة", "edit.applyPath": "استخدم هذا المسار",
  "search.label": "بحث", "search.lane": "الفئة", "search.band": "نطاق السعر", "search.houses": "الدور",
  "run.title": "التشغيل", "run.run": "تشغيل", "run.rerun": "إعادة التشغيل", "run.hold": "إيقاف التحديث الحي",
  "run.save": "حفظ التشغيل", "run.history": "السجل", "run.diff": "الفرق", "run.status": "الحالة",
  "region.label": "المنطقة",
};

const DICTS: Record<Locale, Partial<Record<Key, string>>> = {
  en: EN, fr: FR, es: ES, de: DE, it: IT, pt: PT, ja: JA, ko: KO, zh: ZH, ar: AR,
};
const KEY = "mi-locale";

interface I18nCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: Key) => string;
  rtl: boolean;
}

const Ctx = createContext<I18nCtx>({ locale: "en", setLocale: () => {}, t: (k) => EN[k], rtl: false });

const isLocale = (v: unknown): v is Locale => LOCALES.some((l) => l.id === v);

function applyLocale(l: Locale) {
  document.documentElement.lang = l === "pt" ? "pt-BR" : l;
  document.documentElement.dir = isRtl(l) ? "rtl" : "ltr";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(KEY);
      if (isLocale(stored)) {
        setLocaleState(stored);
        applyLocale(stored);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    applyLocale(l);
    try {
      window.localStorage.setItem(KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  const value = useMemo<I18nCtx>(
    () => ({ locale, setLocale, rtl: isRtl(locale), t: (key: Key) => DICTS[locale][key] ?? EN[key] }),
    [locale, setLocale],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n() {
  return useContext(Ctx);
}
