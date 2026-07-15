@api @nbu
Feature: NBU exchange rate API

  Scenario Outline: Request an exchange rate by currency and date
    When I request the NBU exchange rate for "<currency>" on "<date>"
    Then the API response status should be 200
    And the response should contain currency "<currency>"
    And the returned exchange rate for "<currency>" should be positive

    Examples:
      | currency | date     |
      | USD      | 20250901 |
      | EUR      | 20250901 |
