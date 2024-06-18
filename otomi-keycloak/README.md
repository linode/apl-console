# Local development

Run keycloak locally with `otomi` theme mounted.

```
docker run -p 8084:8080 -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -v $PWD/keycloak/themes/otomi:/opt/keycloak/themes/otomi -v $PWD/keycloak/providers:/opt/keycloak/providers keycloak/keycloak start-dev
```

Next:

- go to http://localhost:8084/admin/master/console/#/master/realm-settings/themes and login with default credentials,
- set login theme to `otomi`,
- logout from keycloak in order to see login page with `otomi` theme,
- modify code on this directory and observe changes after web page reload.

# Deploying new theme

- navigate to otomi-console/otomi-keycloak/theme
- make sure java and the full JDK are installed on the machine
- run command `jar cf otomi.jar -C otomi `
- This will create a jar file in the child resources folder
- move this file to the otomi-console root directory, overriding the old otomi.jar
- the jar file will be consumed in the build step, so there is no manual deploy step

# References

- https://www.keycloak.org/docs/latest/server_development/#creating-a-theme
