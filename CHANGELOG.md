# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.


## [4.8.2](https://github.com/linode/apl-console/compare/v4.8.1...v4.8.2) (2025-08-20)

### Features

* APL-1042 - Network Policies rework ([#632](https://github.com/linode/apl-console/issues/632)) 

### Bug Fixes

* Unknown and wrong pod label ([#637](https://github.com/linode/apl-console/issues/637))

## [4.8.1](https://github.com/linode/apl-console/compare/v4.8.0...v4.8.1) (2025-08-13)

### Reverts

* APL-1042 - Network Policies rework ([#632](https://github.com/linode/apl-console/issues/632)) 

## [4.8.0](https://github.com/linode/apl-console/compare/v4.7.0...v4.8.0) (2025-08-04)


### Features

* Network Policies Page ([#609](https://github.com/linode/apl-console/issues/609)) ([159e317](https://github.com/linode/apl-console/commit/159e3176319b36e079596624f37225fc70fe8367))
* add Kubeflow Pipelines ([#579](https://github.com/linode/apl-console/issues/579)) ([3f012cf](https://github.com/linode/apl-console/commit/3f012cfd8a7ff0ae3ecbfe90da09a305a8484948))


### Bug Fixes

* http proxy middleware ([#615](https://github.com/linode/apl-console/issues/615)) ([f1540c0](https://github.com/linode/apl-console/commit/f1540c07cc6f9098bf3e267a68821c1ea1eb17ee))
* rerouted index ts to named files for readability ([#617](https://github.com/linode/apl-console/issues/617)) ([7cf5bc9](https://github.com/linode/apl-console/commit/7cf5bc9ca17b069f7eebbf2f19e055843df1946b))


### Reverts

* http-proxy-middleware changes ([#619](https://github.com/linode/apl-console/issues/619)) ([bda41ce](https://github.com/linode/apl-console/commit/bda41ced2122215a8a4fc13819a88d6b379c59a0)), closes [#615](https://github.com/linode/apl-console/issues/615) [#616](https://github.com/linode/apl-console/issues/616)


### Others

* **deps:** bump @mui/styles from 5.16.14 to 6.4.12 ([#590](https://github.com/linode/apl-console/issues/590)) ([593f0c9](https://github.com/linode/apl-console/commit/593f0c98d19217267ea6bc2e9250245c8d985a00))
* **deps:** bump @types/lodash from 4.17.15 to 4.17.17 ([#588](https://github.com/linode/apl-console/issues/588)) ([5d11100](https://github.com/linode/apl-console/commit/5d11100ba9da78b167652e52bbe3e4bcd54daa02))
* **deps:** bump axios from 1.7.9 to 1.10.0 ([#592](https://github.com/linode/apl-console/issues/592)) ([2fed476](https://github.com/linode/apl-console/commit/2fed4769eb0c4872fddc67ef57d6ed022e987947))
* **deps:** bump http-proxy-middleware from 0.21.0 to 3.0.5 ([#591](https://github.com/linode/apl-console/issues/591)) ([bdfe7ab](https://github.com/linode/apl-console/commit/bdfe7aba117ba25e79d1fd614b92bae94f85a0ed))
* **deps:** bump ncipollo/release-action ([#603](https://github.com/linode/apl-console/issues/603)) ([89b4301](https://github.com/linode/apl-console/commit/89b4301ab50367575e387508767658118a59fc8b))
* **deps:** bump node from 20.19.2-alpine to 20.19.3-alpine ([#600](https://github.com/linode/apl-console/issues/600)) ([73551b4](https://github.com/linode/apl-console/commit/73551b49575b94bd1fb9439e1e0643799284c9e9))
* **deps:** bump the docker-dependencies group with 2 updates ([#604](https://github.com/linode/apl-console/issues/604)) ([0163a8d](https://github.com/linode/apl-console/commit/0163a8d4fd4b9f6a901ee2de419047f18412d5a2))
* upgrade http-proxy-middleware ([#616](https://github.com/linode/apl-console/issues/616)) ([cffe915](https://github.com/linode/apl-console/commit/cffe9151ee0731dc85c9d36e4ce2ee0e096eceb5))

## [4.7.0](https://github.com/linode/apl-console/compare/v4.6.0...v4.7.0) (2025-07-31)


### Features

* allow users to define empty env values in builds ([#606](https://github.com/linode/apl-console/issues/606)) ([ebb7c52](https://github.com/linode/apl-console/commit/ebb7c52d0bdff4c43d3491e72ffd8ea0a38888a6))
* enhance dependabot configuration for auto-approval and grouping of dependencies ([#601](https://github.com/linode/apl-console/issues/601)) ([6896aed](https://github.com/linode/apl-console/commit/6896aed2276abe9ac9544117b2ec390d7ca1de37))
* hide default platform storage class in cluster settings page ([#614](https://github.com/linode/apl-console/issues/614)) ([764c196](https://github.com/linode/apl-console/commit/764c1965ece618711af6d12c7cbe139bef3c97fa))


### Bug Fixes

* add optional value label for environment variables in build creation ([#611](https://github.com/linode/apl-console/issues/611)) ([435daa8](https://github.com/linode/apl-console/commit/435daa8445ac8e3e6fdf4e197dbb630bace1ffc5))
* improve error handling and re-routing ([#607](https://github.com/linode/apl-console/issues/607)) ([43617e7](https://github.com/linode/apl-console/commit/43617e76ba05b44a77c5730d93e313cbb22d0f52))
* limit team name length to a maximum of 9 characters ([#612](https://github.com/linode/apl-console/issues/612)) ([59a2979](https://github.com/linode/apl-console/commit/59a29799a9c22e093412f3833f515a7c477d9715))

## [4.6.0](https://github.com/linode/apl-console/compare/v4.5.0...v4.6.0) (2025-06-24)


### Features

* update users table for team admins ([#594](https://github.com/linode/apl-console/issues/594)) ([e8c46de](https://github.com/linode/apl-console/commit/e8c46dea83d8ddf69453c04c6a54861939626a58))


### Bug Fixes

* enhance service creation form with correct useCname data ([#598](https://github.com/linode/apl-console/issues/598)) ([830783a](https://github.com/linode/apl-console/commit/830783a4fa3130ea2a92fca8ed6f0669681497c8))
* form validation error for useORCS ([#596](https://github.com/linode/apl-console/issues/596)) ([7bfe3c5](https://github.com/linode/apl-console/commit/7bfe3c528de252542b9aa18dc81a21673de23748))
* remove session corrupt state notification ([#599](https://github.com/linode/apl-console/issues/599)) ([00fe560](https://github.com/linode/apl-console/commit/00fe560ec125227574f1da81de73a219b0cf2401))
* replaced apl-docs with techdocs ([#587](https://github.com/linode/apl-console/issues/587)) ([b7d2ef1](https://github.com/linode/apl-console/commit/b7d2ef111870b1aca89f385feb620dd104f93708))
* webhook inconsistent render issue ([#595](https://github.com/linode/apl-console/issues/595)) ([5a3c2fe](https://github.com/linode/apl-console/commit/5a3c2fec46c777a598523a2fdf8dd4f4632d7d23))


### CI

* added pr auto updater ([#597](https://github.com/linode/apl-console/issues/597)) ([a5b4aa4](https://github.com/linode/apl-console/commit/a5b4aa45a41d30769801b9e22bb0b44f804e969f))

## [4.5.0](https://github.com/linode/apl-console/compare/v4.4.0...v4.5.0) (2025-06-17)


### Features

* new sealed secret form ([#573](https://github.com/linode/apl-console/issues/573)) ([0d39ba6](https://github.com/linode/apl-console/commit/0d39ba6a7a603d7469c7ea949c0beab07215c062))
* simplify the connect cloudtty flow ([#583](https://github.com/linode/apl-console/issues/583)) ([b47ca1b](https://github.com/linode/apl-console/commit/b47ca1b5df61bc3c278b0b17871249a8c2c27efa))


### Bug Fixes

* app.tsx router ([#580](https://github.com/linode/apl-console/issues/580)) ([82d25e9](https://github.com/linode/apl-console/commit/82d25e9f6108c4ba6c060a48fba9a8a691301050))
* disable download kubeconfig when apiserver not configured ([#584](https://github.com/linode/apl-console/issues/584)) ([5597ffa](https://github.com/linode/apl-console/commit/5597ffad4f3aabd937bcd63867d384da41c46a69))
* get team app details ([#582](https://github.com/linode/apl-console/issues/582)) ([2844057](https://github.com/linode/apl-console/commit/284405722c0d33c5e3a5c61afcdc847370f2e09a))
* secret descriptions ([#581](https://github.com/linode/apl-console/issues/581)) ([18494d6](https://github.com/linode/apl-console/commit/18494d64dd39455d87402147e3d18e9963f942df))
* very tempory fix for workload character limit ([#585](https://github.com/linode/apl-console/issues/585)) ([fbeb18e](https://github.com/linode/apl-console/commit/fbeb18e05116d79388153d1c27aff900723b0d4d))


### Others

* **deps:** bump @commitlint/config-conventional from 11.0.0 to 19.8.1 ([#576](https://github.com/linode/apl-console/issues/576)) ([b79902a](https://github.com/linode/apl-console/commit/b79902a79dd2936602a7876a8c6216124ff2a2d1))
* **deps:** bump i18next-http-backend from 1.4.1 to 3.0.2 ([#577](https://github.com/linode/apl-console/issues/577)) ([c90319d](https://github.com/linode/apl-console/commit/c90319d87fbec337383439ccfe3177eeef1f291c))
* **deps:** bump react-hook-form from 7.54.2 to 7.57.0 ([#575](https://github.com/linode/apl-console/issues/575)) ([a4b602d](https://github.com/linode/apl-console/commit/a4b602d4a16b62484d4a6774a39d0797fdbcaeff))
* **deps:** bump simplebar-react from 2.4.3 to 3.3.1 ([#574](https://github.com/linode/apl-console/issues/574)) ([991a5bf](https://github.com/linode/apl-console/commit/991a5bf5366eea8e57ac100c69148af058b0d3ed))


### Code Refactoring

* socket dependency and clean up code ([#586](https://github.com/linode/apl-console/issues/586)) ([810ee59](https://github.com/linode/apl-console/commit/810ee59f23fe7e62da89df6d12515e885e66c5e6))

## [4.4.0](https://github.com/linode/apl-console/compare/v4.3.0...v4.4.0) (2025-06-03)


### Features

* breadcrumb calibration ([#563](https://github.com/linode/apl-console/issues/563)) ([f7efe03](https://github.com/linode/apl-console/commit/f7efe038ab9a94385e920bc5d095535c16f30268))
* only have team select on team view ([#562](https://github.com/linode/apl-console/issues/562)) ([713e0d8](https://github.com/linode/apl-console/commit/713e0d8cb75fb20dc9344fb6744c89579129c64d))


### Bug Fixes

* alertmanager not showing if disabled and isAdmin ([#570](https://github.com/linode/apl-console/issues/570)) ([9b8b96a](https://github.com/linode/apl-console/commit/9b8b96a732bcfaa422a3763aa3f8347c1134a35f))
* getTeam(s) queries ([#571](https://github.com/linode/apl-console/issues/571)) ([d8f1c2e](https://github.com/linode/apl-console/commit/d8f1c2ead822c6d2ee91fc7e35a8b0668634594f))
* policy pages ([#569](https://github.com/linode/apl-console/issues/569)) ([4d57d6d](https://github.com/linode/apl-console/commit/4d57d6d1e227baa4ebf0bcf6483e785bde04f3b3))
* read only view permissions for team settings page ([#565](https://github.com/linode/apl-console/issues/565)) ([7b883f7](https://github.com/linode/apl-console/commit/7b883f7f7dcae7b3b80f7a1021924d11cbc08a7d))
* remove capitalize from catalog card title ([#566](https://github.com/linode/apl-console/issues/566)) ([5885d91](https://github.com/linode/apl-console/commit/5885d91c3964feb5bda5e7c7a9f2acc14bf9d7bb))


### Others

* add code owners ([#564](https://github.com/linode/apl-console/issues/564)) ([315f107](https://github.com/linode/apl-console/commit/315f107dd75a41b4b961e3c56079101f015315da))
* **deps:** bump @hkdobrev/run-if-changed from 0.3.1 to 0.6.3 ([#561](https://github.com/linode/apl-console/issues/561)) ([35f6437](https://github.com/linode/apl-console/commit/35f64378a253d93c360e6d32044cdaad56b83d20))
* **deps:** bump @monaco-editor/react from 4.6.0 to 4.7.0 ([#558](https://github.com/linode/apl-console/issues/558)) ([efcbd4a](https://github.com/linode/apl-console/commit/efcbd4a36d8dc36044a2b012ddcc390b63b4e52d))
* **deps:** bump @testing-library/react from 16.2.0 to 16.3.0 ([#560](https://github.com/linode/apl-console/issues/560)) ([d54dccc](https://github.com/linode/apl-console/commit/d54dcccc71f4015dd83946e860fcf339bdb7dfb2))
* **deps:** bump cspell from 5.21.2 to 9.0.2 ([#572](https://github.com/linode/apl-console/issues/572)) ([2f0c7a0](https://github.com/linode/apl-console/commit/2f0c7a09e0dde09dd8bc9be54e356cfb09a72196))
* **deps:** bump node from 20.19.1-alpine to 20.19.2-alpine ([#568](https://github.com/linode/apl-console/issues/568)) ([c6d698d](https://github.com/linode/apl-console/commit/c6d698d097241645cc3df0c9eb803c576b0edf91))
* **deps:** bump tss-react from 3.7.0 to 4.9.18 ([#559](https://github.com/linode/apl-console/issues/559)) ([cbcbf17](https://github.com/linode/apl-console/commit/cbcbf17870d79f2bd83627c37123f600c78d75e5))

## [4.3.0](https://github.com/linode/apl-console/compare/v4.2.0...v4.3.0) (2025-05-14)


### Features

* update logout parameters as required by Keycloak and clean up theme ([#545](https://github.com/linode/apl-console/issues/545)) ([9456acf](https://github.com/linode/apl-console/commit/9456acfb1bb2d1a210f2acf10af873903b0415c3))


### Bug Fixes

* app header, no capital in team name and no dashboard team admin ([#552](https://github.com/linode/apl-console/issues/552)) ([e57e13e](https://github.com/linode/apl-console/commit/e57e13e1aa4fbfaf69bc0c6fba03223e1d59805a))
* map undefined error ([#554](https://github.com/linode/apl-console/issues/554)) ([4e72c94](https://github.com/linode/apl-console/commit/4e72c9487d8cddc4903c9454989250600f13e568))
* navconfig permission function ([#555](https://github.com/linode/apl-console/issues/555)) ([911341c](https://github.com/linode/apl-console/commit/911341c4e4622c01bedcf32642ec3443bd4a14a5))
* removed limits cpu and memory ([#553](https://github.com/linode/apl-console/issues/553)) ([6ef7510](https://github.com/linode/apl-console/commit/6ef75104a8a2a07c5c9aa5c8705d3a39b133506f))
* ui team journal changes pt.2 ([#548](https://github.com/linode/apl-console/issues/548)) ([43c4e02](https://github.com/linode/apl-console/commit/43c4e02581dba85eebda52e8d3d51e77b218b369))
* ui team journal changes pt.3 ([#549](https://github.com/linode/apl-console/issues/549)) ([bc00f0e](https://github.com/linode/apl-console/commit/bc00f0e4486468f5d3b6ba594704776421f80af9))
* ui team journal changes pt.4 ([#550](https://github.com/linode/apl-console/issues/550)) ([9b11b64](https://github.com/linode/apl-console/commit/9b11b640b284dc2f5297ac7ede128a7a96e40428))


### Others

* **deps:** bump nginx from 1.27.3-alpine to 1.27.5-alpine ([#546](https://github.com/linode/apl-console/issues/546)) ([bdfedef](https://github.com/linode/apl-console/commit/bdfedef765be296f0461731e70e7a419896541b0))
* **deps:** bump node from 20.18.2-alpine to 20.19.1-alpine ([#551](https://github.com/linode/apl-console/issues/551)) ([8e99f15](https://github.com/linode/apl-console/commit/8e99f158565126ec76cdc15c575b0401ef14fd76))

## [4.2.0](https://github.com/linode/apl-console/compare/v4.1.0...v4.2.0) (2025-04-25)


### Features

* build page using new form components ([#536](https://github.com/linode/apl-console/issues/536)) ([ae2ae8a](https://github.com/linode/apl-console/commit/ae2ae8a1c70ae6a18f3efcb63b39dda817d4e71a))
* service page using form components ([#525](https://github.com/linode/apl-console/issues/525)) ([ccbc6df](https://github.com/linode/apl-console/commit/ccbc6df6fe10c624914821ea94b69599b95e3a28))
* static team settings page  ([#531](https://github.com/linode/apl-console/issues/531)) ([14f08b2](https://github.com/linode/apl-console/commit/14f08b27febe805ad7c4340617e4d743d8d1c996))
* update redirects between the theme view and team selection ([#544](https://github.com/linode/apl-console/issues/544)) ([a5d6d15](https://github.com/linode/apl-console/commit/a5d6d1562b7be02d9339f453771234da15d23c3d))


### Bug Fixes

* cluster settings ([#542](https://github.com/linode/apl-console/issues/542)) ([7011d9e](https://github.com/linode/apl-console/commit/7011d9e9379da4de82486e0ba2923fe416eb55c5))
* header team dropdown selection ([#541](https://github.com/linode/apl-console/issues/541)) ([6831bfc](https://github.com/linode/apl-console/commit/6831bfc516ec213425220658dbff0bdea9a9a259))
* redux store generation ([#540](https://github.com/linode/apl-console/issues/540)) ([b3f9603](https://github.com/linode/apl-console/commit/b3f960337c79a9e48463d55997011859e444c3c7))
* team UI rework ([#547](https://github.com/linode/apl-console/issues/547)) ([40e2c48](https://github.com/linode/apl-console/commit/40e2c489bc7f135aa97ddd0be416da25a43a08f1))

## [4.1.0](https://github.com/linode/apl-console/compare/v4.0.0...v4.1.0) (2025-04-07)


### Bug Fixes

* improve error handling ([#527](https://github.com/linode/apl-console/issues/527)) ([eb68c56](https://github.com/linode/apl-console/commit/eb68c569aba779e63f3cdaceb2cc8463b5861fdb))
* show sealed secrets  ([#534](https://github.com/linode/apl-console/issues/534)) ([9931c4a](https://github.com/linode/apl-console/commit/9931c4a168217b942300d64aa65d216ee34b218c))
* use name instead of id for teams ([#537](https://github.com/linode/apl-console/issues/537)) ([50f4a2a](https://github.com/linode/apl-console/commit/50f4a2abdbb9199f517e7f821fefc41478d20406))

## [4.0.0](https://github.com/linode/apl-console/compare/v3.6.0...v4.0.0) (2025-03-17)

### Features

- change the use of id to name ([#518](https://github.com/linode/apl-console/issues/518)) ([f9d91ec](https://github.com/linode/apl-console/commit/f9d91ecd2cf999145165b17bfc9c15bb885cc7af))

### [3.6.1](https://github.com/linode/apl-console/compare/v3.5.0...v3.6.1) (2025-03-13)

### Features

- add code repository page ([#512](https://github.com/linode/apl-console/issues/512)) ([269d229](https://github.com/linode/apl-console/commit/269d229450ba4a3874165d025a476a4d82ebad0e))
- add self-service option for admins to add external helm charts to the catalog ([#519](https://github.com/linode/apl-console/issues/519)) ([11f5800](https://github.com/linode/apl-console/commit/11f58000a650ae897fb6fe4be07b8bf3d630a4a8))
- hide code repositories pages ([#526](https://github.com/linode/apl-console/issues/526)) ([3cd82bb](https://github.com/linode/apl-console/commit/3cd82bb08671ce58a20bfc0f1e7e04e4d7aca045))
- update add new helm chart ([#524](https://github.com/linode/apl-console/issues/524)) ([3d94fb2](https://github.com/linode/apl-console/commit/3d94fb2a3fe11636ab5764f9a0ff4487df95fa4c))

## [3.6.0](https://github.com/linode/apl-console/compare/v3.5.0...v3.6.0) (2025-03-07)

### Features

- add code repository page ([#512](https://github.com/linode/apl-console/issues/512)) ([269d229](https://github.com/linode/apl-console/commit/269d229450ba4a3874165d025a476a4d82ebad0e))
- Add self-service option for admins to add external helm charts to the catalog ([#519](https://github.com/linode/apl-console/issues/519)) ([11f5800](https://github.com/linode/apl-console/commit/11f58000a650ae897fb6fe4be07b8bf3d630a4a8))
- disable UpgradeVersion card for team view ([#503](https://github.com/linode/apl-console/issues/503)) ([00d3840](https://github.com/linode/apl-console/commit/00d38404e01625014f2f7790a82d2268df0955a5))
- react testing library ([#511](https://github.com/linode/apl-console/issues/511)) ([7ae643c](https://github.com/linode/apl-console/commit/7ae643c4bccc444d286d91dc6111bc0a74188a47))
- update otomiApi.ts ([#520](https://github.com/linode/apl-console/issues/520)) ([99ccd58](https://github.com/linode/apl-console/commit/99ccd58362d1452f75413b018e89162bd757ef16))
- Upgrade React v18.3.1 and RJSF v5.24.2 ([#504](https://github.com/linode/apl-console/issues/504)) ([2804b4d](https://github.com/linode/apl-console/commit/2804b4d32c8e3485858b043693e291bc8aa6a06c))

### Others

- **deps:** bump node from 20.18.1-alpine to 20.18.2-alpine ([#501](https://github.com/linode/apl-console/issues/501)) ([25b7b48](https://github.com/linode/apl-console/commit/25b7b48bf4ec5a2c9c8e0c7848f85b3583f8ecf9))
- **deps:** bump react-error-boundary from 4.1.2 to 5.0.0 ([#505](https://github.com/linode/apl-console/issues/505)) ([b1f85e7](https://github.com/linode/apl-console/commit/b1f85e76557f130b287fa2d4feb8949f256e86e2))

### CI

- added semantic-release workflow ([#516](https://github.com/linode/apl-console/issues/516)) ([f9ad982](https://github.com/linode/apl-console/commit/f9ad9823113c4e7ac21d3452162121c78ce08803))

## [3.5.0](https://github.com/linode/apl-console/compare/v3.4.0...v3.5.0) (2025-01-28)

### Features

- pr checklist ([#491](https://github.com/linode/apl-console/issues/491)) ([2465a25](https://github.com/linode/apl-console/commit/2465a252eb834cb625541bdedbca86f94f6e46b2))
- remove deploy and revert changes buttons ([#493](https://github.com/linode/apl-console/issues/493)) ([91ed8a6](https://github.com/linode/apl-console/commit/91ed8a61fb2670df834e16dfcd262df41099d7ff))

### Bug Fixes

- readonly user email when already exist ([#492](https://github.com/linode/apl-console/issues/492)) ([b9f1904](https://github.com/linode/apl-console/commit/b9f19047b5cd37dcd834f7e32210cd999df7e620))
- update message ([#494](https://github.com/linode/apl-console/issues/494)) ([a144e9f](https://github.com/linode/apl-console/commit/a144e9f83f69b8002acb53ad36e86bed12bef1af))
- updated no new updates text ([#490](https://github.com/linode/apl-console/issues/490)) ([39ddbf1](https://github.com/linode/apl-console/commit/39ddbf1ced3de777e05b20671c8f1dcd3ed8ffbc))

### Others

- **deps:** bump nginx from 1.22.0-alpine to 1.27.3-alpine ([#478](https://github.com/linode/apl-console/issues/478)) ([90d07ac](https://github.com/linode/apl-console/commit/90d07ac0ae047764199e18d56869ed2169fec764))

## [3.4.0](https://github.com/linode/apl-console/compare/v3.3.0...v3.4.0) (2024-12-17)

### Features

- add dependabot ([#458](https://github.com/linode/apl-console/issues/458)) ([189276b](https://github.com/linode/apl-console/commit/189276bfb54cb1613e400d9f4af9997af870e597))
- add path for gitea ([#482](https://github.com/linode/apl-console/issues/482)) ([b15fa92](https://github.com/linode/apl-console/commit/b15fa9237175be7bbe27fea9cf3db1f65de59b1a))
- product updates in console ([#486](https://github.com/linode/apl-console/issues/486)) ([f6e6837](https://github.com/linode/apl-console/commit/f6e683787fad97df1e888af514407b48ba8f546d))
- updated release tag generation ([#461](https://github.com/linode/apl-console/issues/461)) ([cb1cd74](https://github.com/linode/apl-console/commit/cb1cd744c63afe618b9e428872bf738588e10646))

### Bug Fixes

- allow extra fields during initial validation ([#462](https://github.com/linode/apl-console/issues/462)) ([4e69867](https://github.com/linode/apl-console/commit/4e69867849f2e3226218207243155fab13e7d74b))
- authz route apps page access ([#487](https://github.com/linode/apl-console/issues/487)) ([27b82e3](https://github.com/linode/apl-console/commit/27b82e3da302e2e930d49735e605420d344d3bd5))
- changed keycloak tab name ([#468](https://github.com/linode/apl-console/issues/468)) ([4ef90a1](https://github.com/linode/apl-console/commit/4ef90a1fbaa1b4cc1ff2f6e03cc0abcf2817f597))
- code editor error ([#459](https://github.com/linode/apl-console/issues/459)) ([4335406](https://github.com/linode/apl-console/commit/4335406da3d260ad36e50d92eb5a9132bd467ea8))
- dependabot ignore >=21 node ([#477](https://github.com/linode/apl-console/issues/477)) ([bc1152b](https://github.com/linode/apl-console/commit/bc1152b5741f12a1b223439595c0144413c4a7a3))
- improved error handling for objwizard ([#479](https://github.com/linode/apl-console/issues/479)) ([4237522](https://github.com/linode/apl-console/commit/423752246bdafb54ae31a26426f200e5f96b6b8b))
- logout error ([#460](https://github.com/linode/apl-console/issues/460)) ([48da38e](https://github.com/linode/apl-console/commit/48da38ee22f45bb25c39dc794259f7f1e4021da0))
- project page 409 error ([#488](https://github.com/linode/apl-console/issues/488)) ([689cad1](https://github.com/linode/apl-console/commit/689cad1226262a63a06b01136984d921a16c583f))
- remove email alert if smtp is not present ([#480](https://github.com/linode/apl-console/issues/480)) ([fd4b732](https://github.com/linode/apl-console/commit/fd4b732c0d1acb65dbbf2a67e8908ae2b827fa8c))
- removed user management from team-admin team view ([#484](https://github.com/linode/apl-console/issues/484)) ([a6bea50](https://github.com/linode/apl-console/commit/a6bea5012d8ce77125bdf2ee8554fc78ff11e765))
- replaced seedling with chore for dependabot ([#469](https://github.com/linode/apl-console/issues/469)) ([7021d97](https://github.com/linode/apl-console/commit/7021d977ffba977be30f9ca1d6bafa16591dc632))
- svg logo for cert-manager ([#463](https://github.com/linode/apl-console/issues/463)) ([be1c296](https://github.com/linode/apl-console/commit/be1c296c2e34e45624f76c242814a9ccff8fc9fc))
- team view iframes visibility ([#475](https://github.com/linode/apl-console/issues/475)) ([2cda4bf](https://github.com/linode/apl-console/commit/2cda4bf3f396d503079cfaa38fa8988d59260a14))
- workload form liveValidate ([#485](https://github.com/linode/apl-console/issues/485)) ([97bc85d](https://github.com/linode/apl-console/commit/97bc85d2fa4dad94d377b58a9a6f9f42fe853eb5))

### Others

- node 20 and npm 10 ([#483](https://github.com/linode/apl-console/issues/483)) ([47ff317](https://github.com/linode/apl-console/commit/47ff317df407ab4202407a67e38bd4b67e6b9c84))

## [3.3.0](https://github.com/linode/apl-console/compare/v3.2.0...v3.3.0) (2024-11-12)

### Features

- selectable object storage region ([#456](https://github.com/linode/apl-console/issues/456)) ([02279cf](https://github.com/linode/apl-console/commit/02279cf2f8e694c527dcdcc7256e25b3635d1ec6))

### Bug Fixes

- set correct workload values on first load ([#455](https://github.com/linode/apl-console/issues/455)) ([901a979](https://github.com/linode/apl-console/commit/901a979311289e7ec28b37950c578685df58168a))

## [3.2.0](https://github.com/linode/apl-console/compare/v3.1.0...v3.2.0) (2024-11-07)

### Features

- object storage wizard ([#452](https://github.com/linode/apl-console/issues/452)) ([0c12bd4](https://github.com/linode/apl-console/commit/0c12bd4c085cb33ed7c2eb781412d3ef65aa58ad))

## [3.1.0](https://github.com/linode/apl-console/compare/v3.0.0...v3.1.0) (2024-11-01)

### Features

- default platform admin user ([#443](https://github.com/linode/apl-console/issues/443)) ([73f11b1](https://github.com/linode/apl-console/commit/73f11b158515264db08bb0f2c83dbea6dd236c88))
- deprecated chip ([#450](https://github.com/linode/apl-console/issues/450)) ([171174a](https://github.com/linode/apl-console/commit/171174afc75e133075c757c2de26594d6a913582))
- error isolation and error handling ([#446](https://github.com/linode/apl-console/issues/446)) ([2504746](https://github.com/linode/apl-console/commit/250474689a4ff82e29002d5ff044651fc5958717))
- updated dependencies to remove critical issues ([#449](https://github.com/linode/apl-console/issues/449)) ([0a407bf](https://github.com/linode/apl-console/commit/0a407bfd248959caa3efe855f93ae951407da206))

### Bug Fixes

- apps filtering ([#451](https://github.com/linode/apl-console/issues/451)) ([cb1c432](https://github.com/linode/apl-console/commit/cb1c4328d4da77d61c13255dea5ed4bad8965fd5))
- docs url and settings menu ([#448](https://github.com/linode/apl-console/issues/448)) ([b5711cb](https://github.com/linode/apl-console/commit/b5711cb41384417daf91160228f54038240c6aa0))
- loki is shown as a team app when grafana for the team is not enabled ([#447](https://github.com/linode/apl-console/issues/447)) ([d0835fa](https://github.com/linode/apl-console/commit/d0835fa5d55a65a0670ebb692176e8614d2ab219))

## [3.0.0](https://github.com/linode/apl-console/compare/v3.0.0-rc.0...v3.0.0) (2024-10-25)

### Features

- added ispreinstalled flag and filtering for apps ([#442](https://github.com/linode/apl-console/issues/442)) ([5f3e11d](https://github.com/linode/apl-console/commit/5f3e11dd475d46e5c691788d27e28cc0be6f67f0))
- update kms settings & age fields ([#432](https://github.com/linode/apl-console/issues/432)) ([58a3bff](https://github.com/linode/apl-console/commit/58a3bff4fd69216b648669b6ca2fab8b60b309db))
- user management ([#441](https://github.com/linode/apl-console/issues/441)) ([4609446](https://github.com/linode/apl-console/commit/4609446a52cba3008d9c6e4d3bedbe023b997d2d))

### Bug Fixes

- add thanos logo ([#440](https://github.com/linode/apl-console/issues/440)) ([e6aaa8e](https://github.com/linode/apl-console/commit/e6aaa8ebcdf73ec98294f18e20ea9a129e4a719a))

## [3.0.0-rc.0](https://github.com/linode/apl-console/compare/v2.8.0...v3.0.0-rc.0) (2024-09-18)

### Features

- added values schema to session ([#424](https://github.com/linode/apl-console/issues/424)) ([732bb9c](https://github.com/linode/apl-console/commit/732bb9cdfe381c0a948c5f1099224c81d7d65aa1))
- apl-console linode dockerhub ([#423](https://github.com/linode/apl-console/issues/423)) ([bb97a25](https://github.com/linode/apl-console/commit/bb97a2543881948178987519b98a220a75e8afc9))
- app page linode styling ([#412](https://github.com/linode/apl-console/issues/412)) ([c40fc15](https://github.com/linode/apl-console/commit/c40fc15ad40f1a3f4acb0c9c56c2074037769642))
- app page restyling ([#435](https://github.com/linode/apl-console/issues/435)) ([71646a3](https://github.com/linode/apl-console/commit/71646a3eb754ca64744508973e5068c94e811b2b))
- argocd always enabled ([#422](https://github.com/linode/apl-console/issues/422)) ([34318b7](https://github.com/linode/apl-console/commit/34318b76a85b4c17d04d10afe926a3c0b77096a0))
- kyverno policies ([#379](https://github.com/linode/apl-console/issues/379)) ([0adc5d3](https://github.com/linode/apl-console/commit/0adc5d3506b46954861f6aac21c45965196c6ed2))
- minimal rebranding ([#411](https://github.com/linode/apl-console/issues/411)) ([729e71c](https://github.com/linode/apl-console/commit/729e71ca8a8bc849828f06bb19c932a43a06652c))
- one backend obj for all apps ([#415](https://github.com/linode/apl-console/issues/415)) ([0ddca87](https://github.com/linode/apl-console/commit/0ddca87eb6e5fee86bdee4ab45d29a033e9b7f29))
- one values schema ([#425](https://github.com/linode/apl-console/issues/425)) ([3903592](https://github.com/linode/apl-console/commit/3903592a7eaf2803383d2f5376ed263ff1963283))
- remove shortcuts ([#414](https://github.com/linode/apl-console/issues/414)) ([f5843dd](https://github.com/linode/apl-console/commit/f5843dd934f876e33ea0b10a2c66c0713b140a88))
- removed license ([#408](https://github.com/linode/apl-console/issues/408)) ([8a70e9b](https://github.com/linode/apl-console/commit/8a70e9b4888715d241d7c6cf476ffe6a0ec98451))
- removing hashicorp vault ([#410](https://github.com/linode/apl-console/issues/410)) ([55efc79](https://github.com/linode/apl-console/commit/55efc799f940ebad3b3f6fe77bfb66fc450043a3))
- simplify app values ([#419](https://github.com/linode/apl-console/issues/419)) ([8cf2b80](https://github.com/linode/apl-console/commit/8cf2b80e38eb4a3953dde4675e3069d732db7db5))
- update sealed secret page to support readability of the secret values ([#407](https://github.com/linode/apl-console/issues/407)) ([d4b832f](https://github.com/linode/apl-console/commit/d4b832f6ff81ed6b3c7e31708efee537175babb6))
- update team alertmanager settings ([#409](https://github.com/linode/apl-console/issues/409)) ([73e4743](https://github.com/linode/apl-console/commit/73e4743c821f75ab5c3aff1f87bb6a45e1d8eb68))
- validate values editor ([#428](https://github.com/linode/apl-console/issues/428)) ([a390be3](https://github.com/linode/apl-console/commit/a390be3d4781f9ec5e54601f1b9de9331dd49d14))

### Bug Fixes

- added iframe overlay to 'remove' border ([#438](https://github.com/linode/apl-console/issues/438)) ([b3d81b3](https://github.com/linode/apl-console/commit/b3d81b31a7f8f446b78bc0d3b81a8943d890e1e1))
- alerts settings ([#437](https://github.com/linode/apl-console/issues/437)) ([3ffba43](https://github.com/linode/apl-console/commit/3ffba431d468bb2977e9627ef9697ec1d4af6bb3))
- apl-chart name substring removal ([#433](https://github.com/linode/apl-console/issues/433)) ([dbd14ae](https://github.com/linode/apl-console/commit/dbd14ae475352750486e60fb2b8515c7accc5adb))
- change tab name in login page and clean up keycloak folder ([#436](https://github.com/linode/apl-console/issues/436)) ([4a48b96](https://github.com/linode/apl-console/commit/4a48b960774ce19877a1b7dc92271c0833b19fee))
- ingress app ([#434](https://github.com/linode/apl-console/issues/434)) ([12e22bc](https://github.com/linode/apl-console/commit/12e22bc1c0c9744ecccc4fb66b9669a8e2afb7cc))
- OIDC no team ([#405](https://github.com/linode/apl-console/issues/405)) ([6e89be6](https://github.com/linode/apl-console/commit/6e89be6b0cd11d95657da4525ba7dd6598926abe))
- remove co-monitoring from the settings page ([#429](https://github.com/linode/apl-console/issues/429)) ([f738356](https://github.com/linode/apl-console/commit/f738356393f56f7a22f964362a8c9283335379f8))
- rm azure monitor ([#402](https://github.com/linode/apl-console/issues/402)) ([2ba8151](https://github.com/linode/apl-console/commit/2ba8151ba34665b97b874f8aa6d2c2fe832031f6))
- rm azure settings ([#417](https://github.com/linode/apl-console/issues/417)) ([77244d8](https://github.com/linode/apl-console/commit/77244d80675750bded50acd6da49ea566a2d6cc9))
- rm opencost ([#403](https://github.com/linode/apl-console/issues/403)) ([c0f2d6b](https://github.com/linode/apl-console/commit/c0f2d6b9e3f17ab60903baaf31de75034f037a53))
- rm thanos ([#404](https://github.com/linode/apl-console/issues/404)) ([4b2ddc7](https://github.com/linode/apl-console/commit/4b2ddc720c51e83726653d90e579f1c6eff1b625))
- sealed secrets ([#430](https://github.com/linode/apl-console/issues/430)) ([d1b0262](https://github.com/linode/apl-console/commit/d1b0262a085581d0909bf491baa5d070928d9f17))
- sealed secrets opaque fields & dashboard inventory items ([#413](https://github.com/linode/apl-console/issues/413)) ([2a5a6f8](https://github.com/linode/apl-console/commit/2a5a6f8b4d728d95898c95cd85b6283ce4a54eec))

### CI

- use new github secrets and variables ([#416](https://github.com/linode/apl-console/issues/416)) ([27c67e4](https://github.com/linode/apl-console/commit/27c67e40179819074faa3ad39ae8ae1dc0a49f20))

## [2.8.0](https://github.com/redkubes/otomi-stack-web/compare/v2.7.0...v2.8.0) (2024-04-19)

### Bug Fixes

- Error 403: Forbidden ([#398](https://github.com/redkubes/otomi-stack-web/issues/398)) ([376ac06](https://github.com/redkubes/otomi-stack-web/commit/376ac06f85887da952d9f0cfb051adc80ff0bcee))
- rerender of forms ([#397](https://github.com/redkubes/otomi-stack-web/issues/397)) ([89faa7b](https://github.com/redkubes/otomi-stack-web/commit/89faa7bff955d43776be648a773db5d3a6a2a14f))
- tekton pipeline run link ([#396](https://github.com/redkubes/otomi-stack-web/issues/396)) ([893b0c5](https://github.com/redkubes/otomi-stack-web/commit/893b0c5ce65ca7c4787d07a0812a98a30538cac9))

## [2.7.0](https://github.com/redkubes/otomi-stack-web/compare/v2.6.0...v2.7.0) (2024-04-05)

### Features

- move netpols out of svc ([#386](https://github.com/redkubes/otomi-stack-web/issues/386)) ([08a7b19](https://github.com/redkubes/otomi-stack-web/commit/08a7b19f4676e69bc387ca8d0a1c5dc6e81b1f9c))

### Bug Fixes

- tekton pipeline emit message error ([#395](https://github.com/redkubes/otomi-stack-web/issues/395)) ([fe474e2](https://github.com/redkubes/otomi-stack-web/commit/fe474e2492c03b823b73982ddd6fac6c3c93a574))
- vulnerability in settings data ([#394](https://github.com/redkubes/otomi-stack-web/issues/394)) ([d6ff5e2](https://github.com/redkubes/otomi-stack-web/commit/d6ff5e26e6161a87c5ea6db8a7f1dbfaf268bc63))

## [2.6.0](https://github.com/redkubes/otomi-stack-web/compare/v2.5.0...v2.6.0) (2024-03-14)

### Features

- secrets migration ([#392](https://github.com/redkubes/otomi-stack-web/issues/392)) ([b82d6ac](https://github.com/redkubes/otomi-stack-web/commit/b82d6acf4ffe2c48e63959e8290bdd4ed9d6be17))

### Bug Fixes

- disable form submission if onSubmit doesn't exist ([#391](https://github.com/redkubes/otomi-stack-web/issues/391)) ([ca2532a](https://github.com/redkubes/otomi-stack-web/commit/ca2532ac0e4accffe431e72a0e0e0598803b99c9))

## [2.5.0](https://github.com/redkubes/otomi-stack-web/compare/v2.4.0...v2.5.0) (2024-02-22)

### Features

- improve team permissions ([#390](https://github.com/redkubes/otomi-stack-web/issues/390)) ([fcd303b](https://github.com/redkubes/otomi-stack-web/commit/fcd303b9c25061e7f714eefe8cca7e22fa6bed56))
- rabbitmq ([#382](https://github.com/redkubes/otomi-stack-web/issues/382)) ([79feaed](https://github.com/redkubes/otomi-stack-web/commit/79feaede7f833b022cf7786b6f31432429f33612))
- sealed secrets ([#381](https://github.com/redkubes/otomi-stack-web/issues/381)) ([5a85d49](https://github.com/redkubes/otomi-stack-web/commit/5a85d4935d4005b17fc47da80635799f17bb7b01))

## [2.4.0](https://github.com/redkubes/otomi-stack-web/compare/v2.3.0...v2.4.0) (2024-02-13)

### Features

- download values ([#388](https://github.com/redkubes/otomi-stack-web/issues/388)) ([0e98bd1](https://github.com/redkubes/otomi-stack-web/commit/0e98bd1739043508ffed702dafaa106324ff665f))

### Bug Fixes

- workload values re-render structure & remove unnecessary files ([#385](https://github.com/redkubes/otomi-stack-web/issues/385)) ([be56ebd](https://github.com/redkubes/otomi-stack-web/commit/be56ebd67eec1f70c9661252960efea54438d644))

## [2.3.0](https://github.com/redkubes/otomi-stack-web/compare/v2.2.0...v2.3.0) (2024-01-12)

### Bug Fixes

- apps filtering for team apps page ([#377](https://github.com/redkubes/otomi-stack-web/issues/377)) ([2b5a30f](https://github.com/redkubes/otomi-stack-web/commit/2b5a30f323a8ecc89d4ecbd51d237d9eab7a1f22))
- knative services ([#378](https://github.com/redkubes/otomi-stack-web/issues/378)) ([6b6c27c](https://github.com/redkubes/otomi-stack-web/commit/6b6c27c6918c95d6b82b731fbec4d02167e29560))

## [2.2.0](https://github.com/redkubes/otomi-stack-web/compare/v2.1.0...v2.2.0) (2024-01-04)

### Features

- add update strategy option to workloads ([#365](https://github.com/redkubes/otomi-stack-web/issues/365)) ([4e23ef1](https://github.com/redkubes/otomi-stack-web/commit/4e23ef15afc5c696e92d75e90cf0e51ef9658acb))
- byo secret for external private repo ([#366](https://github.com/redkubes/otomi-stack-web/issues/366)) ([1d08c98](https://github.com/redkubes/otomi-stack-web/commit/1d08c984f88a5153ce54b94caa9811d7a414a13f))
- team and platform status dashboard ([#369](https://github.com/redkubes/otomi-stack-web/issues/369)) ([d63e906](https://github.com/redkubes/otomi-stack-web/commit/d63e90670baf83048fb32589a6af8dc4130ee9e9))
- team and platform dashboard and viewer switch ([#370](https://github.com/redkubes/otomi-stack-web/issues/370)) ([e7ad3b1](https://github.com/redkubes/otomi-stack-web/commit/e7ad3b153fecf59682cdc83e43e95bb42b18844d))

### Bug Fixes

- adjusted activation page scaling ([#372](https://github.com/redkubes/otomi-stack-web/issues/372)) ([f0f0b66](https://github.com/redkubes/otomi-stack-web/commit/f0f0b669dfb93e0ce8ef3f745b2c349ca120e66f))
- auto image updater ([#376](https://github.com/redkubes/otomi-stack-web/issues/376)) ([0356115](https://github.com/redkubes/otomi-stack-web/commit/035611500848aca6e1d52923a1c4479c7fa2fd75))
- create project ([#375](https://github.com/redkubes/otomi-stack-web/issues/375)) ([a7d7d1a](https://github.com/redkubes/otomi-stack-web/commit/a7d7d1ab2ec0c345d1d1f631ef43154994b6be26))
- more svc filters ([#371](https://github.com/redkubes/otomi-stack-web/issues/371)) ([fc81482](https://github.com/redkubes/otomi-stack-web/commit/fc81482227da8a4974c62ac663fde5c3728aa42b))
- team and platform console dashboards ([#373](https://github.com/redkubes/otomi-stack-web/issues/373)) ([4a05cab](https://github.com/redkubes/otomi-stack-web/commit/4a05cabf42869e55a7b8fd0368d3be3caa18599a))

## [2.1.0](https://github.com/redkubes/otomi-stack-web/compare/v2.0.0...v2.1.0) (2023-12-15)

### Features

- developer catalog chart readme files ([#361](https://github.com/redkubes/otomi-stack-web/issues/361)) ([ce61b11](https://github.com/redkubes/otomi-stack-web/commit/ce61b117a86efac47a0798c5de203ed4e68fc5e8))
- developer catalog page ([#355](https://github.com/redkubes/otomi-stack-web/issues/355)) ([d73b7e6](https://github.com/redkubes/otomi-stack-web/commit/d73b7e63b4adf12d63a7de4436252c6b832ca1cf))
- rm disabled apps logic Falco ([#357](https://github.com/redkubes/otomi-stack-web/issues/357)) ([ba7e529](https://github.com/redkubes/otomi-stack-web/commit/ba7e529336c2f6477632bd7b80c85c8a37580ff5))
- workload values yaml comments ([#360](https://github.com/redkubes/otomi-stack-web/issues/360)) ([d722f7c](https://github.com/redkubes/otomi-stack-web/commit/d722f7c56fea912e9add8d8103d70fa0dfb79d2d))

### Bug Fixes

- change catalog name ([#362](https://github.com/redkubes/otomi-stack-web/issues/362)) ([fb9b56b](https://github.com/redkubes/otomi-stack-web/commit/fb9b56bbd82ec7bd1a844a639e6e599fab748452))
- hide the icon field in workload for projects page ([#359](https://github.com/redkubes/otomi-stack-web/issues/359)) ([5ee9ee0](https://github.com/redkubes/otomi-stack-web/commit/5ee9ee0ec5d4f49cbbc1e872bf1cde03088a86be))
- welcome message ([#363](https://github.com/redkubes/otomi-stack-web/issues/363)) ([4b4fbfe](https://github.com/redkubes/otomi-stack-web/commit/4b4fbfeb49cbec54674fb721d0645d87acaa9064))

### Tests

- domain readonly ([#364](https://github.com/redkubes/otomi-stack-web/issues/364)) ([34a13dc](https://github.com/redkubes/otomi-stack-web/commit/34a13dc8f60496043b9b826c3b59b9565d0a09bb))

## [2.0.0](https://github.com/redkubes/otomi-stack-web/compare/v1.4.0...v2.0.0) (2023-11-21)

### Features

- drone 2 tekton ([#349](https://github.com/redkubes/otomi-stack-web/issues/349)) ([ca3c579](https://github.com/redkubes/otomi-stack-web/commit/ca3c57946ba6b45ed3bb6e99f122cb84a04a161d))
- show full repository name in list of builds ([#348](https://github.com/redkubes/otomi-stack-web/issues/348)) ([aca2be5](https://github.com/redkubes/otomi-stack-web/commit/aca2be596bf362feb7f3881fc92374c5bc857a8c))
- specific workload catalog for teamId ([#347](https://github.com/redkubes/otomi-stack-web/issues/347)) ([b7799d0](https://github.com/redkubes/otomi-stack-web/commit/b7799d0fde0911593f70caec5b2367366b68944f))
- template catalog ([#346](https://github.com/redkubes/otomi-stack-web/issues/346)) ([76e64a7](https://github.com/redkubes/otomi-stack-web/commit/76e64a79913ac1475b7572d731b2fc5684d715a0))
- workload template catalog ([#345](https://github.com/redkubes/otomi-stack-web/issues/345)) ([3d96db2](https://github.com/redkubes/otomi-stack-web/commit/3d96db27c0c5f27261eea1e93173bafb2168bd54))

### Bug Fixes

- clipboard links ([#353](https://github.com/redkubes/otomi-stack-web/issues/353)) ([f439e8b](https://github.com/redkubes/otomi-stack-web/commit/f439e8bd5793952d5f881529b377b105558a92e3))
- hide power button for team apps in AppCard ([#354](https://github.com/redkubes/otomi-stack-web/issues/354)) ([05b8777](https://github.com/redkubes/otomi-stack-web/commit/05b877711d2770999b970881ce55e533843e6ca5))
- rm integration from app info tab ([#352](https://github.com/redkubes/otomi-stack-web/issues/352)) ([df5bdcc](https://github.com/redkubes/otomi-stack-web/commit/df5bdcc93dbe666518040d9adc26020ff5a0b01a))
- rm kubeapps ([#343](https://github.com/redkubes/otomi-stack-web/issues/343)) ([c53080c](https://github.com/redkubes/otomi-stack-web/commit/c53080c5e8607e6da303715c081527ffe8f93779))
- rm kubeclarity ([#344](https://github.com/redkubes/otomi-stack-web/issues/344)) ([39ec6dd](https://github.com/redkubes/otomi-stack-web/commit/39ec6dde28d2117833477420130655748f677f4a))
- workload and project bugs ([#351](https://github.com/redkubes/otomi-stack-web/issues/351)) ([059017e](https://github.com/redkubes/otomi-stack-web/commit/059017e13ac7e47d67d1a426e0b9c82e5af5a6cc))

## [1.4.0](https://github.com/redkubes/otomi-stack-web/compare/v1.3.0...v1.4.0) (2023-10-17)

### Features

- update iFrameUrl request ([#337](https://github.com/redkubes/otomi-stack-web/issues/337)) ([77e6024](https://github.com/redkubes/otomi-stack-web/commit/77e6024099aa3a4e03c88b3cf6a2e705cf706959))
- workload improvements ([#338](https://github.com/redkubes/otomi-stack-web/issues/338)) ([dccec54](https://github.com/redkubes/otomi-stack-web/commit/dccec5408759a741b717df688af733de2878cb87))

### Bug Fixes

- provide otomi theme for keycloak as a jar ([#341](https://github.com/redkubes/otomi-stack-web/issues/341)) ([24ba600](https://github.com/redkubes/otomi-stack-web/commit/24ba600157a35cdf63abb84a87d6dbc151716911))
- removed falco from non azure providers ([#339](https://github.com/redkubes/otomi-stack-web/issues/339)) ([2ddc4ee](https://github.com/redkubes/otomi-stack-web/commit/2ddc4eeb952ea78526f2bd88a6bb503d34561304))
- service name field ([#340](https://github.com/redkubes/otomi-stack-web/issues/340)) ([804a2b6](https://github.com/redkubes/otomi-stack-web/commit/804a2b642c4e422946f0725536a36cf0c0bc77f3))

## [1.3.0](https://github.com/redkubes/otomi-stack-web/compare/v1.2.0...v1.3.0) (2023-10-03)

### Bug Fixes

- mitigate ENOENT issue at release-action@v1.12.0 ([747b250](https://github.com/redkubes/otomi-stack-web/commit/747b250ae04c2b0c398fa77287cae1b0e11890c7))

## [1.2.0](https://github.com/redkubes/otomi-stack-web/compare/v1.1.0...v1.2.0) (2023-10-03)

### Bug Fixes

- mitigate ENAMETOOLONG issue at release-action@v1.12.0 ([1bf34d1](https://github.com/redkubes/otomi-stack-web/commit/1bf34d1edeceb1c444cc00b47d2575b509ffd2f9))

## [1.1.0](https://github.com/redkubes/otomi-stack-web/compare/v1.0.0...v1.1.0) (2023-10-03)

### Features

- add link to pipelinerun in tekton dashboard ([#332](https://github.com/redkubes/otomi-stack-web/issues/332)) ([3600c6a](https://github.com/redkubes/otomi-stack-web/commit/3600c6a94f807a7de89a55ec0152c8f59dd0b189))
- add tracing using OpenTelemetry and Grafana Tempo ([#316](https://github.com/redkubes/otomi-stack-web/issues/316)) ([8fac607](https://github.com/redkubes/otomi-stack-web/commit/8fac607954b6cc6c8f0660c234621fd3a84e8392))
- add uri in settings ([#325](https://github.com/redkubes/otomi-stack-web/issues/325)) ([802c3c5](https://github.com/redkubes/otomi-stack-web/commit/802c3c5b93377d154e9f111d720b018043c1b321))
- auto image update ([#330](https://github.com/redkubes/otomi-stack-web/issues/330)) ([3ba0c5c](https://github.com/redkubes/otomi-stack-web/commit/3ba0c5c609a7f4c9df0fcfa0f936de6f2cb44acc))
- custom workloads ([#326](https://github.com/redkubes/otomi-stack-web/issues/326)) ([2ad2a18](https://github.com/redkubes/otomi-stack-web/commit/2ad2a18051a18226f89f1beafc7a8c4e28df238f))

### Bug Fixes

- build trigger link ([#335](https://github.com/redkubes/otomi-stack-web/issues/335)) ([0a08efa](https://github.com/redkubes/otomi-stack-web/commit/0a08efada4d842dde6c4b0f5b2df3cc3b2f564a7))
- change team admin service url ([#331](https://github.com/redkubes/otomi-stack-web/issues/331)) ([a390da9](https://github.com/redkubes/otomi-stack-web/commit/a390da9f670611d722efaf7684fe4acf922df04c))
- form key to edit autofocus fields ([#334](https://github.com/redkubes/otomi-stack-web/issues/334)) ([f4ef9be](https://github.com/redkubes/otomi-stack-web/commit/f4ef9be3923fbc08aa4c857686dfe9cff1cae69f))
- prometheus host ([#327](https://github.com/redkubes/otomi-stack-web/issues/327)) ([da6b382](https://github.com/redkubes/otomi-stack-web/commit/da6b382f864e17694c97b6ffde690a7ef4e20619))
- remove special character from the url ([#328](https://github.com/redkubes/otomi-stack-web/issues/328)) ([23cd0df](https://github.com/redkubes/otomi-stack-web/commit/23cd0df794f6c000815574b0677f4b9dbbdf24a4))
- rm backup from team ([#324](https://github.com/redkubes/otomi-stack-web/issues/324)) ([7ce4c8f](https://github.com/redkubes/otomi-stack-web/commit/7ce4c8fc4cc220574da5dd8fb0a45ed5cf2a7e66))
- updated actions for release ([#329](https://github.com/redkubes/otomi-stack-web/issues/329)) ([610c864](https://github.com/redkubes/otomi-stack-web/commit/610c864894b1be2844d84ba813237f636abc3a3b))

## [1.0.0](https://github.com/redkubes/otomi-stack-web/compare/v0.12.0...v1.0.0) (2023-09-04)

### Features

- added CNAME support ([#321](https://github.com/redkubes/otomi-stack-web/issues/321)) ([e63bdca](https://github.com/redkubes/otomi-stack-web/commit/e63bdca08783c8428ed005ca214c8891979bc6b5))
- remove k8s version ([#322](https://github.com/redkubes/otomi-stack-web/issues/322)) ([a552900](https://github.com/redkubes/otomi-stack-web/commit/a552900d7c67957b5bc26b09025932ffd1dc2f6c))
