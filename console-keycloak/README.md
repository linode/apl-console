# Local development

Run keycloak locally with `APL` theme mounted, from the main project directory.

```sh
docker run --name keycloak --rm -p 8084:8080 -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=admin -v $PWD/console-keycloak/APL/theme/APL:/opt/keycloak/themes/APL keycloak/keycloak start-dev
```

Next:

- go to http://localhost:8084/admin/master/console/#/master/realm-settings/themes and login with default credentials,
- set login theme to `APL`,
- logout from keycloak in order to see login page with `APL` theme,
- modify code on this directory and observe changes after web page reload.

# Deploying new theme

- navigate to apl-console/console-keycloak
- make sure java and the full JDK are installed on the machine
- run command `jar cf APL.jar -C APL .`
- This will create a jar file in the child resources folder
- the jar file will be consumed in the build step, so there is no manual deploy step

# References

- https://www.keycloak.org/docs/latest/server_development/#creating-a-theme
