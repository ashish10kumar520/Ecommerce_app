import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: "http://localhost:9192",
  realm: "dev",
  clientId: "auth-client",
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
