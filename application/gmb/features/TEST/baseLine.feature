Feature: Test Shadow dom

    @testShadow
    Scenario: Impersonate - Base workflow
        Given I navigate to the test page
        When I get an element count within the shadow dom
        And I click an element within the shadow dom
        And I enter text in an element within the shadow dom
        And I wait 500 milli-seconds






