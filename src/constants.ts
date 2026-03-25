import { PantoneStyle } from './types';

export const PANTONE_STYLES: PantoneStyle[] = [
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    primary: '#0F4C81',
    secondary: '#D5E1EF',
    accent: '#FF7F50', // Coral
    bg: '#FFFFFF',
    text: '#1A1A1A'
  },
  {
    id: 'very-peri',
    name: 'Very Peri',
    primary: '#6667AB',
    secondary: '#E0E1F0',
    accent: '#FF7F50',
    bg: '#FFFFFF',
    text: '#1A1A1A'
  },
  {
    id: 'peach-fuzz',
    name: 'Peach Fuzz',
    primary: '#FFBE98',
    secondary: '#FFF1E6',
    accent: '#FF7F50',
    bg: '#FFFFFF',
    text: '#1A1A1A'
  },
  {
    id: 'ultimate-gray',
    name: 'Ultimate Gray & Illuminating',
    primary: '#939597',
    secondary: '#F5DF4D',
    accent: '#FF7F50',
    bg: '#FFFFFF',
    text: '#1A1A1A'
  },
  {
    id: 'viva-magenta',
    name: 'Viva Magenta',
    primary: '#BB2649',
    secondary: '#F5E6E9',
    accent: '#FF7F50',
    bg: '#FFFFFF',
    text: '#1A1A1A'
  },
  {
    id: 'emerald',
    name: 'Emerald',
    primary: '#009473',
    secondary: '#E6F4F1',
    accent: '#FF7F50',
    bg: '#FFFFFF',
    text: '#1A1A1A'
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz & Serenity',
    primary: '#F7CAC9',
    secondary: '#92A8D1',
    accent: '#FF7F50',
    bg: '#FFFFFF',
    text: '#1A1A1A'
  },
  {
    id: 'tangerine-tango',
    name: 'Tangerine Tango',
    primary: '#DD4124',
    secondary: '#F9EBE9',
    accent: '#FF7F50',
    bg: '#FFFFFF',
    text: '#1A1A1A'
  },
  {
    id: 'greenery',
    name: 'Greenery',
    primary: '#88B04B',
    secondary: '#F3F7ED',
    accent: '#FF7F50',
    bg: '#FFFFFF',
    text: '#1A1A1A'
  },
  {
    id: 'marsala',
    name: 'Marsala',
    primary: '#955251',
    secondary: '#F4EEEE',
    accent: '#FF7F50',
    bg: '#FFFFFF',
    text: '#1A1A1A'
  }
];

export const TRANSLATIONS = {
  en: {
    title: 'SmartMed Review 4.3',
    subtitle: 'Regulatory Intelligence Workspace',
    noteInput: '510(k) Review Notes',
    notePlaceholder: 'Paste your submission review notes or markdown here...',
    organizeBtn: 'Transform to Organized Doc',
    organizedTitle: 'Organized Review Document',
    instructionsTitle: 'Report Instructions / Sample',
    instructionsPlaceholder: 'Paste report instructions or a sample report here...',
    generateReportBtn: 'Generate Review Report',
    reportTitle: 'Final Review Report',
    followUpTitle: '20 Comprehensive Follow-up Questions',
    next: 'Next Step',
    back: 'Back',
    edit: 'Edit Content',
    save: 'Save Changes',
    generating: 'AI is thinking...',
    langLabel: 'Language',
    themeLabel: 'Theme',
    styleLabel: 'Pantone Style',
    light: 'Light',
    dark: 'Dark',
    step1: 'Review Notes',
    step2: 'Organized Doc',
    step3: 'Instructions',
    step4: 'Final Report',
    step5: 'Follow-ups'
  },
  'zh-TW': {
    title: '智慧醫材審查 4.3',
    subtitle: '法規智慧工作空間',
    noteInput: '510(k) 審查筆記',
    notePlaceholder: '在此貼上您的提交審查筆記或 Markdown...',
    organizeBtn: '轉換為結構化文件',
    organizedTitle: '結構化審查文件',
    instructionsTitle: '報告指令 / 範本',
    instructionsPlaceholder: '在此貼上報告指令或範本報告...',
    generateReportBtn: '生成審查報告',
    reportTitle: '最終審查報告',
    followUpTitle: '20 個全面性後續問題',
    next: '下一步',
    back: '返回',
    edit: '編輯內容',
    save: '儲存變更',
    generating: 'AI 正在思考...',
    langLabel: '語言',
    themeLabel: '主題',
    styleLabel: 'Pantone 風格',
    light: '淺色',
    dark: '深色',
    step1: '審查筆記',
    step2: '結構化文件',
    step3: '報告指令',
    step4: '最終報告',
    step5: '後續問題'
  }
};
