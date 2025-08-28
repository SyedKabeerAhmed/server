import axios from 'axios';
import { config } from '../config';
import { HttpError } from '../errors/HttpError';

export const currencyClient = axios.create({
  baseURL: 'https://api.freecurrencyapi.com/v1',
  timeout: 10000,
});
currencyClient.interceptors.request.use((req) => {
  req.headers = req.headers ?? {};
  req.headers['apikey'] = config.freeCurrencyApiKey;
  return req;
});

export async function getCurrencies() {
  try {
    const { data } = await currencyClient.get('/currencies');
    return data.data as Record<string, any>;
  } catch (e: any) {
    throw new HttpError(502, 'Currency upstream error', e?.response?.data ?? e?.message);
  }
}

export async function getLatest(base: string, symbols?: string) {
  try {
    const { data } = await currencyClient.get('/latest', {
      params: { base_currency: base, currencies: symbols || undefined }
    });
    return data.data as Record<string, number>;
  } catch (e: any) {
    throw new HttpError(502, 'Currency upstream error', e?.response?.data ?? e?.message);
  }
}
