import { GeoLocation } from '@/types/geolocation';

const STORAGE_KEY = 'oceane_sheets_webhook';
const DEFAULT_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbx79HTZS7HZvCgVQPExi0Uvt0t7UffL-4WZXWjMjHCl4-BPViuBNHi3mqCVoWyufymvfQ/exec';

export const getGoogleSheetsWebhook = (): string | null => {
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_WEBHOOK_URL;
};

export const setGoogleSheetsWebhook = (url: string): void => {
  localStorage.setItem(STORAGE_KEY, url);
};

export const saveLocationToGoogleSheets = async (
  location: GeoLocation,
  webhookUrl: string
): Promise<boolean> => {
  try {
    const data = {
      timestamp: new Date().toISOString(),
      latitude: location.latitude,
      longitude: location.longitude,
      city: location.city || 'Unknown',
      region: location.region || 'Unknown',
      country: location.country || 'Unknown',
      source: window.location.origin,
      userAgent: navigator.userAgent,
    };

    console.log('Saving location to Google Sheets:', data);

    // Using no-cors because Google Apps Script doesn't send CORS headers properly
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // With no-cors, we can't check the response, but the request is sent
    return true;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return false;
  }
};
