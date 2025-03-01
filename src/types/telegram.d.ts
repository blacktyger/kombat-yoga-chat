
// Type definitions for Telegram Web App
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
    auth_date: string;
    hash: string;
  };
  colorScheme: 'light' | 'dark';
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  ready: () => void;
  expand: () => void;
  close: () => void;
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp;
  };
}
