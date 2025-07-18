# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [2.5.1](https://github-personal/ngneat/elf/compare/store-2.5.0...store-2.5.1) (2024-02-03)

### Bug Fixes

- **store:** 🐞 improve state type ([ee784a4](https://github-personal/ngneat/elf/commit/ee784a464970bef6d71ad4998dc34a5ecdb97126)), closes [#510](https://github-personal/ngneat/elf/issues/510)

# [2.5.0](https://github-personal/ngneat/elf/compare/store-2.4.0...store-2.5.0) (2024-01-19)

### Features

- **store:** 🔥 add events support ([fce4724](https://github-personal/ngneat/elf/commit/fce47245e72393d9354a4e431ab04db15a48c058))

# [2.4.0](https://github.com/ngneat/elf/compare/store-2.3.2...store-2.4.0) (2023-09-24)

### Features

- **store:** async batch operations ([#480](https://github.com/ngneat/elf/issues/480)) ([8d30ccb](https://github.com/ngneat/elf/commit/8d30ccb1be0ff9007be26a8b8c960cbce22a40be)), closes [#478](https://github.com/ngneat/elf/issues/478)

## [2.3.2](https://github-personal/ngneat/elf/compare/store-2.3.1...store-2.3.2) (2023-06-02)

### Bug Fixes

- **store:** combine should emit a new object ([#462](https://github-personal/ngneat/elf/issues/462)) ([d226a2f](https://github-personal/ngneat/elf/commit/d226a2f8d0823b9b1c130008b10bba34c7b9727c))

## [2.3.1](https://github-personal/ngneat/elf/compare/store-2.3.0...store-2.3.1) (2023-02-05)

### Bug Fixes

- store peer dependencies ([#426](https://github-personal/ngneat/elf/issues/426)) ([56c3487](https://github-personal/ngneat/elf/commit/56c3487fdee997bb63089ba37b10ddd37576891c))

# [2.3.0](https://github-personal/ngneat/elf/compare/store-2.2.0...store-2.3.0) (2022-11-21)

### Features

- **store:** elfHooks with preStateInit hook ([#383](https://github-personal/ngneat/elf/issues/383)) ([f739139](https://github-personal/ngneat/elf/commit/f73913942396a68163597d90436181f5d04b0307))

# [2.2.0](https://github.com/ngneat/elf/compare/store-2.1.0...store-2.2.0) (2022-10-26)

### Features

- **store:** change `emitOnce` to emit only once even with all nested `emitOnce` ([#362](https://github.com/ngneat/elf/issues/362)) ([a5b89dd](https://github.com/ngneat/elf/commit/a5b89ddbac3b4766d7dd5d3ab91a974bfd52b5a8))

# [2.1.0](https://github.com/ngneat/elf/compare/store-2.0.0...store-2.1.0) (2022-05-30)

### Features

- **store:** add setPropsInitialValue to have ability update initial value passed to propsFactory ([#275](https://github.com/ngneat/elf/issues/275)) ([c8be676](https://github.com/ngneat/elf/commit/c8be676dbf8418bb075630ef049f5c16c86bb1f5))

# [2.0.0](https://github.com/ngneat/elf/compare/store-1.5.6...store-2.0.0) (2022-05-12)

### Bug Fixes

- **store:** destroy should reset the store state ([558e4c0](https://github.com/ngneat/elf/commit/558e4c0e24b63ddfbe35162725d6c7bcc24d45a0))

### BREAKING CHANGES

- **store:** Calling the destroy method will also reset the state

## [1.5.6](https://github.com/ngneat/elf/compare/store-1.5.5...store-1.5.6) (2022-03-29)

### Bug Fixes

- **store:** 🐞 return emitOnce cb value ([4718f37](https://github.com/ngneat/elf/commit/4718f3766b0c89851b506301a9c6c1c4be52ddb9))

## [1.5.5](https://github.com/ngneat/elf/compare/store-1.5.4...store-1.5.5) (2022-03-28)

### Bug Fixes

- **store:** 🐞 fix emitOnce condition ([46d2bf4](https://github.com/ngneat/elf/commit/46d2bf4a7f284ae117783330ab44857a918fad1e))

## [1.5.4](https://github.com/ngneat/elf/compare/store-1.5.3...store-1.5.4) (2022-03-23)

### Bug Fixes

- **store:** add proper export for enableElfProdMode ([#203](https://github.com/ngneat/elf/issues/203)) ([190aab5](https://github.com/ngneat/elf/commit/190aab5df8cdabe4f39e6d7481fa596e35715a62))

## [1.5.3](https://github.com/ngneat/elf/compare/store-1.5.2...store-1.5.3) (2022-03-22)

### Bug Fixes

- **store:** add enableElfProdMode

## [1.5.2](https://github.com/ngneat/elf/compare/store-1.5.0...store-1.5.2) (2022-03-16)

### Bug Fixes

- **store:** fixes incorrect operator imports from rxjs ([#197](https://github.com/ngneat/elf/issues/197)) ([c8764f8](https://github.com/ngneat/elf/commit/c8764f8ae04bbe5aa89520f329461232d90f7d88))

# [1.5.0](https://github.com/ngneat/elf/compare/store-1.4.0...store-1.5.0) (2022-03-08)

### Features

- **store:** 🔥 add emitOnce function ([3256d5f](https://github.com/ngneat/elf/commit/3256d5fbd1603ded8365c01c518862b3b6d6f3bf))

# [1.4.0](https://github.com/ngneat/elf/compare/store-1.3.3...store-1.4.0) (2022-03-08)

### Features

- **store:** 🔥 elfHooks with preStoreUpdate hook ([#182](https://github.com/ngneat/elf/issues/182)) ([0704c33](https://github.com/ngneat/elf/commit/0704c3399c58008fa33702276943832a54d5dd49))

## [1.3.3](https://github.com/ngneat/elf/compare/store-1.3.2...store-1.3.3) (2022-02-24)

### Bug Fixes

- **store:** 🐞 fix createStore type ([f1f38b2](https://github.com/ngneat/elf/commit/f1f38b26157ca237c1cb60f67ce055bab627fef7))

## [1.3.2](https://github.com/ngneat/elf/compare/store-1.3.1...store-1.3.2) (2022-02-23)

### Bug Fixes

- **store:** 🐞 revert type ([370bb9c](https://github.com/ngneat/elf/commit/370bb9cfb33b98dd88058469297e070ddaf2f83d))

## [1.3.1](https://github.com/ngneat/elf/compare/store-1.3.0...store-1.3.1) (2022-02-23)

### Bug Fixes

- **store:** 🐞 fix createStore type ([87c756b](https://github.com/ngneat/elf/commit/87c756b79c47cc0d225f3bc4633ae50a3363ef9e))

# [1.3.0](https://github.com/ngneat/elf/compare/store-1.2.0...store-1.3.0) (2022-02-23)

### Features

- **store:** 🔥 introduce createStore function ([#174](https://github.com/ngneat/elf/issues/174)) ([fbc68ff](https://github.com/ngneat/elf/commit/fbc68ff1dd91190486a74dea9637ce34a47fb9ea))

# [1.2.0](https://github.com/ngneat/elf/compare/store-1.1.0...store-1.2.0) (2022-02-17)

### Features

- **store:** 🔥 add setProps mutation ([452d2aa](https://github.com/ngneat/elf/commit/452d2aa56df7097aff4b387eee97702b0b1c4f24))

# [1.1.0](https://github.com/ngneat/elf/compare/store-1.0.2...store-1.1.0) (2022-02-16)

### Features

- **store:** 🔥 add setProp mutation ([b0bea61](https://github.com/ngneat/elf/commit/b0bea61e67e476559a58ce35018460f8bfac68fb))

## [1.0.2](https://github.com/ngneat/elf/compare/store-1.0.1...store-1.0.2) (2021-12-14)

## [1.0.1](https://github.com/ngneat/elf/compare/store-1.0.0...store-1.0.1) (2021-12-14)

### Bug Fixes

- **entities:** typed support for immutable/readonly arrays ([#86](https://github.com/ngneat/elf/issues/86)) ([9cd6638](https://github.com/ngneat/elf/commit/9cd66381b7b9562eda10c52cd63bc19017ec8bbb))
