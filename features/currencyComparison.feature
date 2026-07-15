@e2e @currency
Feature: Currency rate comparison

  Scenario: Compare USD and EUR rates between Minfin and Kurs.com.ua
    Given the following currencies are selected:
      | currency |
      | USD      |
      | EUR      |
    When I compare rates from Minfin and Kurs.com.ua
    Then buy and sell comparisons should be available for every currency
    And every collected exchange rate should be positive
