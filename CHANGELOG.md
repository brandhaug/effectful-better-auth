# Changelog

## [0.3.1](https://github.com/brandhaug/effectful-better-auth/compare/effectful-better-auth-v0.3.0...effectful-better-auth-v0.3.1) (2026-08-27)


### Miscellaneous

* align tooling with canonical setup ([#35](https://github.com/brandhaug/effectful-better-auth/issues/35)) ([40429d6](https://github.com/brandhaug/effectful-better-auth/commit/40429d69de90a77eb2cb3e70e7b419e81beb350a))

## [0.3.0](https://github.com/brandhaug/effectful-better-auth/compare/effectful-better-auth-v0.2.0...effectful-better-auth-v0.3.0) (2026-08-26)


### Features

* **api:** add runAuth convenience for server-side auth.api calls ([#24](https://github.com/brandhaug/effectful-better-auth/issues/24)) ([5e6d40c](https://github.com/brandhaug/effectful-better-auth/commit/5e6d40ce153cc6f6d95bd5e18af75c70303aac40))
* **api:** ambient CurrentHeaders injection for auth.api calls ([#23](https://github.com/brandhaug/effectful-better-auth/issues/23)) ([5096fa7](https://github.com/brandhaug/effectful-better-auth/commit/5096fa71859d5ec001c721f50c401a10dccaa548))
* BetterAuthApiError tagged error (statusCode, code, message, headers) ([ed14756](https://github.com/brandhaug/effectful-better-auth/commit/ed147568eb3e9c94273367d7df0350bf66a33e39))
* effectApi proxy — EffectApi mapped type, APIError→fail, else die ([6cc0d8f](https://github.com/brandhaug/effectful-better-auth/commit/6cc0d8f99b585f73417e299d10d8ab994c4fd513))
* handler mount — toHttpEffect primitive + route layer ([00551e0](https://github.com/brandhaug/effectful-better-auth/commit/00551e03d1657187fe47d8b237b2f79e748768a4))
* **lint:** enforce strict oxlint rules with anti-slop and review fixes ([#34](https://github.com/brandhaug/effectful-better-auth/issues/34)) ([142430c](https://github.com/brandhaug/effectful-better-auth/commit/142430c8477dc2e3221623fae882ddcbbfc4b23d))
* make + service factory with effectful options builder support ([7a3a648](https://github.com/brandhaug/effectful-better-auth/commit/7a3a64821a42a5a6cbabf218161a021db39207b5))
* plugins(...) tuple helper — function-built options widen the plugin ([5716b4a](https://github.com/brandhaug/effectful-better-auth/commit/5716b4a281cf04e8f6977ca2775afddd76ed56b8))
* session middleware — factory-minted CurrentSession variants ([33190af](https://github.com/brandhaug/effectful-better-auth/commit/33190af4399412d806011115bc18c372297181d0))


### Bug Fixes

* **errors:** use Schema.TaggedError for Effect v4 rc.111 compatibility ([#22](https://github.com/brandhaug/effectful-better-auth/issues/22)) ([feaf611](https://github.com/brandhaug/effectful-better-auth/commit/feaf611ccbe00e3eac43b303c9fe6d9e86bbdde7))
* **security:** override 1 vulnerable transitive dependency ([#14](https://github.com/brandhaug/effectful-better-auth/issues/14)) ([21a4d18](https://github.com/brandhaug/effectful-better-auth/commit/21a4d18a56c2b70699f1d4c773e3dda76c1c16df))
* **types:** derive Session from the getSession endpoint, not $Infer.Session ([6888015](https://github.com/brandhaug/effectful-better-auth/commit/68880157cbb650c2ff1a1bae44f26a5ccbed2bb4))


### Documentation

* add phase 1 implementation prompt ([d83cc1b](https://github.com/brandhaug/effectful-better-auth/commit/d83cc1bdee6586e3eb487f45d16efa034debc509))
* add phase 2 implementation prompt ([cc1ee6c](https://github.com/brandhaug/effectful-better-auth/commit/cc1ee6cde5b40206a8629dd3eefaf8ac2357b76b))
* **agents:** sync AGENTS.md with shipped API and Bun tooling ([#33](https://github.com/brandhaug/effectful-better-auth/issues/33)) ([e67cdc2](https://github.com/brandhaug/effectful-better-auth/commit/e67cdc2a84c5f58c7e9ee20f4c1484d3a42d6932))
* amend spec — effectful api proxy replaces call, drop erased interop tag ([#12](https://github.com/brandhaug/effectful-better-auth/issues/12)) ([12633fd](https://github.com/brandhaug/effectful-better-auth/commit/12633fd42716c3fbeaeedf09c4f5a9c002b68a66))
* lock design spec from wayfinder decisions ([c55baef](https://github.com/brandhaug/effectful-better-auth/commit/c55baef71b20e40746a582031f24f7edc89ce769))
* note unpublished status in README ([9f64fe5](https://github.com/brandhaug/effectful-better-auth/commit/9f64fe5dd1e34edcbebd2e041e91c30ddabf9636))
* README — mounting the auth routes and protecting endpoints ([eea24f6](https://github.com/brandhaug/effectful-better-auth/commit/eea24f6e98eac5904f554bb8c42fb65322ef5631))
* README — npm badges, install/contributing/license sections; drop unpublished note ([d9fee86](https://github.com/brandhaug/effectful-better-auth/commit/d9fee8607081c6fc1004f6a1104eba07b821bb43))
* README quickstart for service factory and effectful api ([ff83fbe](https://github.com/brandhaug/effectful-better-auth/commit/ff83fbe22d9bfda34e80d2be74aae039474f2811))
* rename package to effectful-better-auth (unscoped) per [#12](https://github.com/brandhaug/effectful-better-auth/issues/12) ([93e6942](https://github.com/brandhaug/effectful-better-auth/commit/93e6942621285297c9be80b5a936c352dc67ebe7))
* sync README with runAuth and effect rc.111 peer dep ([#32](https://github.com/brandhaug/effectful-better-auth/issues/32)) ([151a758](https://github.com/brandhaug/effectful-better-auth/commit/151a758be4d56a80aeaf0bcb11ebdc225b0c2f28))


### Miscellaneous

* add agent skills config (issue tracker, triage labels, domain docs) ([6bc7914](https://github.com/brandhaug/effectful-better-auth/commit/6bc791436cf58e02163fbd7fd9b3b7f2bdfba4c3))
* adopt Bun 1.4 with dependency catalogs and catalog-update automation ([#13](https://github.com/brandhaug/effectful-better-auth/issues/13)) ([8d847a0](https://github.com/brandhaug/effectful-better-auth/commit/8d847a0d3a1cbcf7ae4eedfc4b49bd1d9239e4de))
* **deps:** bump better-auth from 1.6.23 to 1.7.1 ([#15](https://github.com/brandhaug/effectful-better-auth/issues/15)) ([a15e9a7](https://github.com/brandhaug/effectful-better-auth/commit/a15e9a79bd14e0ad820e95b774adf9551e3c6a15))
* **deps:** bump effect from 4.0.0-beta.93 to 4.0.0-rc.110 ([#16](https://github.com/brandhaug/effectful-better-auth/issues/16)) ([759d63f](https://github.com/brandhaug/effectful-better-auth/commit/759d63f6fdccaac0ae3d0f918b62ecce0902ce1a))
* **deps:** bump effect from 4.0.0-rc.110 to 4.0.0-rc.111 ([#20](https://github.com/brandhaug/effectful-better-auth/issues/20)) ([bad5581](https://github.com/brandhaug/effectful-better-auth/commit/bad5581bb7ef410ebbc63fabc9fa972cc5f7576b))
* **deps:** bump typescript from 5.9.2 to 7.0.2 ([#17](https://github.com/brandhaug/effectful-better-auth/issues/17)) ([9170885](https://github.com/brandhaug/effectful-better-auth/commit/9170885437a55124ce8553e4f53ef202721a879b))
* **deps:** bump vitest from 3.2.4 to 4.1.11 ([#18](https://github.com/brandhaug/effectful-better-auth/issues/18)) ([f427d81](https://github.com/brandhaug/effectful-better-auth/commit/f427d8176feca3a1d497e96b021d938874825d52))
* enforce formatting via pre-commit instead of CI ([#31](https://github.com/brandhaug/effectful-better-auth/issues/31)) ([cb1ef43](https://github.com/brandhaug/effectful-better-auth/commit/cb1ef433413ced63772397a090b2c9e65e874f00))
* initial repo scaffold ([ed07be9](https://github.com/brandhaug/effectful-better-auth/commit/ed07be9ad0e71aea9f58a7f6f8619cd8a876dbe5))
* **master:** release effectful-better-auth 0.2.0 ([#26](https://github.com/brandhaug/effectful-better-auth/issues/26)) ([de2f1d2](https://github.com/brandhaug/effectful-better-auth/commit/de2f1d2dd8fb72d961ce6ba6e262ecb63d03c0e6))
* prepare 0.1.0 release — LICENSE, package metadata, prepublishOnly guard ([6dada22](https://github.com/brandhaug/effectful-better-auth/commit/6dada2298cc438a18b2d8de3c5e58be08e869216))
* release 0.1.1 ([78a9239](https://github.com/brandhaug/effectful-better-auth/commit/78a9239e703a49fa61614f9993322f95375468ec))
* scaffold package (ESM, peer deps, vitest, tsconfig) ([591c66d](https://github.com/brandhaug/effectful-better-auth/commit/591c66d919754929690b20e7f4903e1cdb96db90))

## [0.2.0](https://github.com/brandhaug/effectful-better-auth/compare/effectful-better-auth-v0.1.1...effectful-better-auth-v0.2.0) (2026-08-26)


### Features

* **api:** add runAuth convenience for server-side auth.api calls ([#24](https://github.com/brandhaug/effectful-better-auth/issues/24)) ([5e6d40c](https://github.com/brandhaug/effectful-better-auth/commit/5e6d40ce153cc6f6d95bd5e18af75c70303aac40))
* **api:** ambient CurrentHeaders injection for auth.api calls ([#23](https://github.com/brandhaug/effectful-better-auth/issues/23)) ([5096fa7](https://github.com/brandhaug/effectful-better-auth/commit/5096fa71859d5ec001c721f50c401a10dccaa548))
* BetterAuthApiError tagged error (statusCode, code, message, headers) ([ed14756](https://github.com/brandhaug/effectful-better-auth/commit/ed147568eb3e9c94273367d7df0350bf66a33e39))
* effectApi proxy — EffectApi mapped type, APIError→fail, else die ([6cc0d8f](https://github.com/brandhaug/effectful-better-auth/commit/6cc0d8f99b585f73417e299d10d8ab994c4fd513))
* handler mount — toHttpEffect primitive + route layer ([00551e0](https://github.com/brandhaug/effectful-better-auth/commit/00551e03d1657187fe47d8b237b2f79e748768a4))
* make + service factory with effectful options builder support ([7a3a648](https://github.com/brandhaug/effectful-better-auth/commit/7a3a64821a42a5a6cbabf218161a021db39207b5))
* plugins(...) tuple helper — function-built options widen the plugin ([5716b4a](https://github.com/brandhaug/effectful-better-auth/commit/5716b4a281cf04e8f6977ca2775afddd76ed56b8))
* session middleware — factory-minted CurrentSession variants ([33190af](https://github.com/brandhaug/effectful-better-auth/commit/33190af4399412d806011115bc18c372297181d0))


### Bug Fixes

* **errors:** use Schema.TaggedError for Effect v4 rc.111 compatibility ([#22](https://github.com/brandhaug/effectful-better-auth/issues/22)) ([feaf611](https://github.com/brandhaug/effectful-better-auth/commit/feaf611ccbe00e3eac43b303c9fe6d9e86bbdde7))
* **security:** override 1 vulnerable transitive dependency ([#14](https://github.com/brandhaug/effectful-better-auth/issues/14)) ([21a4d18](https://github.com/brandhaug/effectful-better-auth/commit/21a4d18a56c2b70699f1d4c773e3dda76c1c16df))
* **types:** derive Session from the getSession endpoint, not $Infer.Session ([6888015](https://github.com/brandhaug/effectful-better-auth/commit/68880157cbb650c2ff1a1bae44f26a5ccbed2bb4))


### Documentation

* add phase 1 implementation prompt ([d83cc1b](https://github.com/brandhaug/effectful-better-auth/commit/d83cc1bdee6586e3eb487f45d16efa034debc509))
* add phase 2 implementation prompt ([cc1ee6c](https://github.com/brandhaug/effectful-better-auth/commit/cc1ee6cde5b40206a8629dd3eefaf8ac2357b76b))
* amend spec — effectful api proxy replaces call, drop erased interop tag ([#12](https://github.com/brandhaug/effectful-better-auth/issues/12)) ([12633fd](https://github.com/brandhaug/effectful-better-auth/commit/12633fd42716c3fbeaeedf09c4f5a9c002b68a66))
* lock design spec from wayfinder decisions ([c55baef](https://github.com/brandhaug/effectful-better-auth/commit/c55baef71b20e40746a582031f24f7edc89ce769))
* note unpublished status in README ([9f64fe5](https://github.com/brandhaug/effectful-better-auth/commit/9f64fe5dd1e34edcbebd2e041e91c30ddabf9636))
* README — mounting the auth routes and protecting endpoints ([eea24f6](https://github.com/brandhaug/effectful-better-auth/commit/eea24f6e98eac5904f554bb8c42fb65322ef5631))
* README — npm badges, install/contributing/license sections; drop unpublished note ([d9fee86](https://github.com/brandhaug/effectful-better-auth/commit/d9fee8607081c6fc1004f6a1104eba07b821bb43))
* README quickstart for service factory and effectful api ([ff83fbe](https://github.com/brandhaug/effectful-better-auth/commit/ff83fbe22d9bfda34e80d2be74aae039474f2811))
* rename package to effectful-better-auth (unscoped) per [#12](https://github.com/brandhaug/effectful-better-auth/issues/12) ([93e6942](https://github.com/brandhaug/effectful-better-auth/commit/93e6942621285297c9be80b5a936c352dc67ebe7))


### Miscellaneous

* add agent skills config (issue tracker, triage labels, domain docs) ([6bc7914](https://github.com/brandhaug/effectful-better-auth/commit/6bc791436cf58e02163fbd7fd9b3b7f2bdfba4c3))
* adopt Bun 1.4 with dependency catalogs and catalog-update automation ([#13](https://github.com/brandhaug/effectful-better-auth/issues/13)) ([8d847a0](https://github.com/brandhaug/effectful-better-auth/commit/8d847a0d3a1cbcf7ae4eedfc4b49bd1d9239e4de))
* **deps:** bump better-auth from 1.6.23 to 1.7.1 ([#15](https://github.com/brandhaug/effectful-better-auth/issues/15)) ([a15e9a7](https://github.com/brandhaug/effectful-better-auth/commit/a15e9a79bd14e0ad820e95b774adf9551e3c6a15))
* **deps:** bump effect from 4.0.0-beta.93 to 4.0.0-rc.110 ([#16](https://github.com/brandhaug/effectful-better-auth/issues/16)) ([759d63f](https://github.com/brandhaug/effectful-better-auth/commit/759d63f6fdccaac0ae3d0f918b62ecce0902ce1a))
* **deps:** bump effect from 4.0.0-rc.110 to 4.0.0-rc.111 ([#20](https://github.com/brandhaug/effectful-better-auth/issues/20)) ([bad5581](https://github.com/brandhaug/effectful-better-auth/commit/bad5581bb7ef410ebbc63fabc9fa972cc5f7576b))
* **deps:** bump typescript from 5.9.2 to 7.0.2 ([#17](https://github.com/brandhaug/effectful-better-auth/issues/17)) ([9170885](https://github.com/brandhaug/effectful-better-auth/commit/9170885437a55124ce8553e4f53ef202721a879b))
* **deps:** bump vitest from 3.2.4 to 4.1.11 ([#18](https://github.com/brandhaug/effectful-better-auth/issues/18)) ([f427d81](https://github.com/brandhaug/effectful-better-auth/commit/f427d8176feca3a1d497e96b021d938874825d52))
* initial repo scaffold ([ed07be9](https://github.com/brandhaug/effectful-better-auth/commit/ed07be9ad0e71aea9f58a7f6f8619cd8a876dbe5))
* prepare 0.1.0 release — LICENSE, package metadata, prepublishOnly guard ([6dada22](https://github.com/brandhaug/effectful-better-auth/commit/6dada2298cc438a18b2d8de3c5e58be08e869216))
* release 0.1.1 ([78a9239](https://github.com/brandhaug/effectful-better-auth/commit/78a9239e703a49fa61614f9993322f95375468ec))
* scaffold package (ESM, peer deps, vitest, tsconfig) ([591c66d](https://github.com/brandhaug/effectful-better-auth/commit/591c66d919754929690b20e7f4903e1cdb96db90))
