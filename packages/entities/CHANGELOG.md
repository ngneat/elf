# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

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
