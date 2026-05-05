declare const window: Window & {
  RUNTIME_CONFIG?: {
    API_URL?: string;
  };
};

const isCodespace = typeof window !== 'undefined' &&
  window.location?.hostname?.endsWith('.app.github.dev');

const codespaceApiUrl = isCodespace
  ? `https://${window.location.hostname.replace('-5137', '-3000')}`
  : null;

export const API_BASE_URL =
  window.RUNTIME_CONFIG?.API_URL ||
  codespaceApiUrl ||
  'http://localhost:3000';

export const API_ENDPOINTS = {
  issuers: '/api/issuers',
  cardholders: '/api/cardholders',
  cards: '/api/cards',
  merchants: '/api/merchants',
  transactions: '/api/transactions',
  disputes: '/api/disputes',
  settlements: '/api/settlements',
};
