
// Type definitions for Telegram WebApp
export interface TelegramWebApp {
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

// Mock the Telegram WebApp object for local development
export const createMockTelegramWebApp = (): TelegramWebApp => {
  return {
    initData: 'mock_init_data',
    initDataUnsafe: {
      query_id: 'mock_query_id',
      user: {
        id: 123456789,
        first_name: 'Mock',
        last_name: 'User',
        username: 'mockuser',
        language_code: 'en',
      },
      auth_date: new Date().toISOString(),
      hash: 'mock_hash',
    },
    colorScheme: 'light',
    viewportHeight: window.innerHeight,
    viewportStableHeight: window.innerHeight,
    isExpanded: true,
    ready: () => console.log('Telegram WebApp is ready'),
    expand: () => console.log('Telegram WebApp expanded'),
    close: () => console.log('Telegram WebApp closed'),
  };
};

// Get the real Telegram WebApp or a mock if not in Telegram
export const getTelegramWebApp = (): TelegramWebApp => {
  if (window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  
  return createMockTelegramWebApp();
};

// Add window.Telegram type definition
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}
