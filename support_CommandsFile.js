// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (email, countryCode, cookiesAccepted = true) => {
  cy.fixture("updatedUsers").then((data) => {
    const countryUsers = data[countryCode] || [];
    const user = countryUsers.find((user) => user.UserAccount === email);

    if (!user || !user.Password) {
      cy.log(
        "No active user found with the given email or user does not have a password."
      );
      return;
    }

    const apiUrl = Cypress.env("apiUrl");
    cy.intercept("POST", `${apiUrl}/v6/secm/oam/oauth2/token`).as("token");

    // Visit the login page
    cy.visit(Cypress.env("url"));

    // Perform login steps
    cy.get("#cwc-input-0").type(user.UserAccount);
    cy.get("#cwc-input-1").type(user.Password);
    cy.get("#cmx-login-form-submit-btn").click();

    cy.wait("@token").then((response) => {
      const data = response.response.body;
      console.log('data', data)
      // Save tokens to Cypress environment variables
      Cypress.env("client").globals = {};
      Cypress.env("client").globals.accessToken = data.oauth2.access_token;
      Cypress.env("client").globals.headers = {
        Authorization: `Bearer ${data.oauth2.access_token}`,
        jwt: data.jwt
      };
      Cypress.env("header", `Bearer ${data.oauth2.access_token}`);
      Cypress.env("jwt", data.jwt);
    });
    cy.wait(6000);
    // Check if the error message is displayed
    cy.get("h1").then((e) => {
      const headerText = e[0].text();
      if (headerText.includes("Welcome to CEMEX Go")) {
        cy.log("LOGGED IN CX");
      } else {
        cy.log("NOT LOGGED IN");
      }
    });
  });
});

Cypress.Commands.add("handleCookieConsent", () => {
  cy.log("Checking for cookie consent popup");
  cy.get("body").then(($body) => {
    if (
      $body.find("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll")
        .length > 0
    ) {
      cy.log("Cookie consent popup found, clicking allow all");
      cy.get("#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll").click({
        force: true,
      });
    } else {
      cy.log("No cookie consent popup found");
    }
  });
});

Cypress.Commands.add(
  "ifElementExists",
  (
    rootPath,
    elementLoc,
    exec,
    execElse = () => {},
    execElseVisible = () => {}
  ) => {
    cy.get(rootPath).then(($body) => {
      if ($body.find(elementLoc).length > 0) {
        cy.get(elementLoc).then(($dialog) => {
          if ($dialog.is(":visible")) {
            exec();
          } else {
            execElseVisible();
          }
        });
      } else execElse();
    });
  }
);

Cypress.Commands.add("captureApiCall", (req, res) => {
  apiCalls.push({
    url: req.url,
    method: req.method,
    request: req.body,
    response: res.body,
    status: res.statusCode,
  });
  console.log(`${req.method} request to ${req.url}:`, {
    request: req.body,
    response: res.body,
    status: res.statusCode,
  });
});
