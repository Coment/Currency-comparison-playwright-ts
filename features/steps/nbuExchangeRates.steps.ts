import { createBdd } from 'playwright-bdd';
import {
  NbuApiResponse,
  NbuExchangeRate,
} from '../../api/NbuApiClient';
import { expect, test } from '../../fixtures/testFixtures';

const { When, Then } = createBdd(test);

When(
  'I request the NBU exchange rate for {string} on {string}',
  async ({ nbuApiClient, nbuApiScenario }, currency: string, date: string) => {
    nbuApiScenario.response = await nbuApiClient.getExchangeRate(currency, date);
  }
);

Then(
  'the API response status should be {int}',
  async ({ nbuApiScenario }, expectedStatus: number) => {
    const response = getApiResponse(nbuApiScenario.response);

    expect(response.status).toBe(expectedStatus);
  }
);

Then(
  'the response should contain currency {string}',
  async ({ nbuApiScenario }, currency: string) => {
    const rates = getExchangeRates(nbuApiScenario.response);

    expect(findRate(rates, currency)).toBeDefined();
  }
);

Then(
  'the returned exchange rate for {string} should be positive',
  async ({ nbuApiScenario }, currency: string) => {
    const rates = getExchangeRates(nbuApiScenario.response);
    const exchangeRate = findRate(rates, currency);

    expect(exchangeRate, `No exchange rate returned for ${currency}`).toBeDefined();
    expect(exchangeRate!.rate).toBeGreaterThan(0);
  }
);

function getApiResponse(
  response: NbuApiResponse | undefined
): NbuApiResponse {
  if (!response) {
    throw new Error('NBU API request has not been executed');
  }

  return response;
}

function getExchangeRates(
  response: NbuApiResponse | undefined
): NbuExchangeRate[] {
  const { body } = getApiResponse(response);

  expect(Array.isArray(body), 'NBU API response should be an array').toBeTruthy();

  return body as NbuExchangeRate[];
}

function findRate(
  rates: NbuExchangeRate[],
  currency: string
): NbuExchangeRate | undefined {
  return rates.find(({ cc }) => cc === currency);
}
