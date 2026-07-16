import { APIRequestContext } from '@playwright/test';

export interface NbuExchangeRate {
  r030: number;
  txt: string;
  rate: number;
  cc: string;
  exchangedate: string;
  special?: string;
}

export interface NbuApiResponse {
  status: number;
  body: unknown;
}

const DEFAULT_NBU_API_URL = 'https://bank.gov.ua';

export class NbuApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl = process.env.NBU_API_URL ?? DEFAULT_NBU_API_URL,
  ) {}

  async getExchangeRate(currency: string, date: string): Promise<NbuApiResponse> {
    const response = await this.request.get(
      `${this.baseUrl}/NBUStatService/v1/statdirectory/exchangenew`,
      {
        params: {
          json: '',
          valcode: currency,
          date,
        },
      },
    );

    const contentType = response.headers()['content-type'] ?? '';
    const body = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    return {
      status: response.status(),
      body,
    };
  }
}
