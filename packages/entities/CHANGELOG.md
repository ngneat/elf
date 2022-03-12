# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

# [4.1.0](https://github.com/ngneat/elf/compare/entities-4.0.1...entities-4.1.0) (2022-03-12)


### Features

* **entities:** add getActiveEntity and getActiveEntities ([#192](https://github.com/ngneat/elf/issues/192)) ([9e4c16e](https://github.com/ngneat/elf/commit/9e4c16eb4ebd8e1917a240418b0069b828f85539))



## [4.0.1](https://github.com/ngneat/elf/compare/entities-4.0.0...entities-4.0.1) (2022-03-09)


### Bug Fixes

* **entities:** 🐞 export getAllEntitiesApply ([5356f00](https://github.com/ngneat/elf/commit/5356f0070f81ec3a45880d2218c520dfe27010f3))



# [4.0.0](https://github.com/ngneat/elf/compare/entities-3.4.0...entities-4.0.0) (2022-03-09)


### Features

* **entities:** 🔥 change getEntities to getAllEntities ([f20cb19](https://github.com/ngneat/elf/commit/f20cb19f1a27df4e73feb4ce4e339915956c9a26))
* **entities:** 🔥 change selectAll to selectAllEntities ([e30b6d1](https://github.com/ngneat/elf/commit/e30b6d19ccac7759b9587edfff01c8c29248a738))
* **entities:** 🔥 change selectAllApply to selectAllEntitiesApp ([b5a6566](https://github.com/ngneat/elf/commit/b5a6566b896ae2bb6e32e26fdae8fac7f1af12ce))


### BREAKING CHANGES

* **entities:** 🧨 change getEntities to getAllEntities
* **entities:** 🧨 change selectAllApply to selectAllEntitiesApp
* **entities:** 🧨 change selectAll to selectAllEntities



# [3.4.0](https://github.com/ngneat/elf/compare/entities-3.3.0...entities-3.4.0) (2022-03-09)


### Features

* **entities:** 🔥 add getAllEntitiesApply query ([368871b](https://github.com/ngneat/elf/commit/368871bd52139e0c59d4ff6ed789282264d68bc9))
# [3.3.0](https://github.com/ngneat/elf/compare/entities-3.2.1...entities-3.3.0) (2022-02-23)


### Features

* **store:** 🔥 introduce createStore function ([#174](https://github.com/ngneat/elf/issues/174)) ([fbc68ff](https://github.com/ngneat/elf/commit/fbc68ff1dd91190486a74dea9637ce34a47fb9ea))



## [3.2.1](https://github.com/ngneat/elf/compare/entities-3.2.0...entities-3.2.1) (2022-02-12)


### Bug Fixes

* **entities:** 🐞 export update by ids ([8a3de8d](https://github.com/ngneat/elf/commit/8a3de8d9868a8adbac7f3c2cbe98ed0310239a7a))



# [3.2.0](https://github.com/ngneat/elf/compare/entities-3.1.1...entities-3.2.0) (2022-02-12)


### Features

* **entities:** 🔥 support id update ([#147](https://github.com/ngneat/elf/issues/147)) ([af201e2](https://github.com/ngneat/elf/commit/af201e22a8ef7b3bb959124e95a8bf45057b9699))
* **mutation:** add support for key-value structure ([#148](https://github.com/ngneat/elf/issues/148)) ([163fabd](https://github.com/ngneat/elf/commit/163fabd0386ce20dc1c35b9bb210d90b1c00c6dd))



## [3.1.1](https://github.com/ngneat/elf/compare/entities-3.1.0...entities-3.1.1) (2022-02-08)


### Bug Fixes

* **entities:** 🐞 correct typing for unionEntitiesAsMap() return value ([#145](https://github.com/ngneat/elf/issues/145)) ([d4f0c30](https://github.com/ngneat/elf/commit/d4f0c30900822c01a291424902e2f91a04a2f0b4))



# [3.1.0](https://github.com/ngneat/elf/compare/entities-3.0.0...entities-3.1.0) (2022-02-06)


### Features

* **entities:** 🔥 add unionEntitiesAsMap operator ([#134](https://github.com/ngneat/elf/issues/134)) ([fc8a9c0](https://github.com/ngneat/elf/commit/fc8a9c0956fb1aefcb4c455aa64943de8ca13c52))



# [3.0.0](https://github.com/ngneat/elf/compare/entities-2.1.0...entities-3.0.0) (2022-01-24)


### Bug Fixes

* **entities:** correct typing for selectActiveEntity ([#126](https://github.com/ngneat/elf/issues/126)) ([3354f77](https://github.com/ngneat/elf/commit/3354f77349e0cb05f8181b2d11c09a2a7116486a))


### BREAKING CHANGES

* **entities:** selectActiveEntity is now stricter

`selectActiveEntity` is stricter and returns `Entity | undefined`



# [2.1.0](https://github.com/ngneat/elf/compare/entities-2.0.3...entities-2.1.0) (2022-01-11)


### Features

* **entities:** add select many entities by predicate ([#113](https://github.com/ngneat/elf/issues/113)) ([8afe79c](https://github.com/ngneat/elf/commit/8afe79c44d25435b2bc4da9fe71325eb7990cf0f))



## [2.0.3](https://github.com/ngneat/elf/compare/entities-2.0.2...entities-2.0.3) (2022-01-06)


### Bug Fixes

* **entities:** 🐞 setEntities should work with empty array ([e1c4b8d](https://github.com/ngneat/elf/commit/e1c4b8da99179505c721fb0bdebd34ddba679626)), closes [#112](https://github.com/ngneat/elf/issues/112)



## [2.0.2](https://github.com/ngneat/elf/compare/entities-2.0.1...entities-2.0.2) (2021-12-14)



## [2.0.1](https://github.com/ngneat/elf/compare/entities-2.0.0...entities-2.0.1) (2021-12-13)


### Bug Fixes

* **entities:** typed support for immutable/readonly arrays ([#86](https://github.com/ngneat/elf/issues/86)) ([9cd6638](https://github.com/ngneat/elf/commit/9cd66381b7b9562eda10c52cd63bc19017ec8bbb))



# [2.0.0](https://github.com/ngneat/elf/compare/entities-1.0.0...entities-2.0.0) (2021-12-13)


### Bug Fixes

* **entities:** 🐞 add protection when the array is empty ([d322695](https://github.com/ngneat/elf/commit/d32269524f361ec823e732cadde49fa0ff777554))


### Features

* **entities:** refactor upsertEntities ([51de305](https://github.com/ngneat/elf/commit/51de30584d7b86402317dfbdd57aff89cf50170a)), closes [#75](https://github.com/ngneat/elf/issues/75)


### BREAKING CHANGES

* **entities:** upsertEntities name change

The current `upsertEntities` function was change to `upsertEntitiesById`.
The new `upsertEntities` functionality takes a collection of entities and performs an upsert.
