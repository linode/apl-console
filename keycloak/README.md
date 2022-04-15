# Local development

Run keycloak locally with `otomi` theme mounted.

```
docker run -p 8080:8080 -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin -v $PWD/keycloak/themes/otomi:/opt/jboss/keycloak/themes/otomi jboss/keycloak
```

Next:

- go to http://localhost:8080/auth/admin/main/console/#/realms/main/theme-settings and login with default credentials,
- set login theme to `otomi`,
- logout from keycloak in order to see login page with `otomi` theme,
- modify code on this directory and observe changes after web page reload.

# References

- https://www.keycloak.org/docs/latest/server_development/#creating-a-theme
