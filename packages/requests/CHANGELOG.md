# Changelog

This file was generated using [@jscutlery/semver](https://github.com/jscutlery/semver).

## [1.9.2](https://github.com/ngneat/elf/compare/requests-1.9.1...requests-1.9.2) (2023-09-24)

### Bug Fixes

- **requests:** preventConcurrentRequest along with staleTime ([#486](https://github.com/ngneat/elf/issues/486)) ([b5abab0](https://github.com/ngneat/elf/commit/b5abab0b94ad72998cbae9543d48c12ed0810763))

## [1.9.1](https://github-personal/ngneat/elf/compare/requests-1.9.0...requests-1.9.1) (2023-09-07)

### Bug Fixes

- **requests:** staleTime can be undefined ([#482](https://github-personal/ngneat/elf/issues/482)) ([9fb0651](https://github-personal/ngneat/elf/commit/9fb0651aee26d0eaa060c4c0a486989b307925e1))

# [1.9.0](https://github-personal/ngneat/elf/compare/requests-1.8.0...requests-1.9.0) (2023-08-12)

### Bug Fixes

- **requests:** expose RequestResult ([#469](https://github-personal/ngneat/elf/issues/469)) ([8de9ffb](https://github-personal/ngneat/elf/commit/8de9ffb883028502f739a8b26ed30fe2c0f19fc6))

### Features

- **requests-result:** 🔥 Add ttl to updateRequestsCache ([#477](https://github-personal/ngneat/elf/issues/477)) ([c62d9a2](https://github-personal/ngneat/elf/commit/c62d9a2a91948fa65c7a985a83a15b288118f8a2))

# [1.8.0](https://github-personal/ngneat/elf/compare/requests-1.7.0...requests-1.8.0) (2023-05-13)

### Features

- **requests-result:** 🔥 Track request results with extra keys ([#456](https://github-personal/ngneat/elf/issues/456)) ([7ad547a](https://github-personal/ngneat/elf/commit/7ad547a644b4bf856f713f1e56601ab8cfbb7966))

# [1.7.0](https://github-personal/ngneat/elf/compare/requests-1.6.0...requests-1.7.0) (2023-03-30)

### Features

- **requests:** support caching response data in request result ([#443](https://github-personal/ngneat/elf/issues/443)) ([#445](https://github-personal/ngneat/elf/issues/445)) ([4f2bd45](https://github-personal/ngneat/elf/commit/4f2bd45d6447875df0071569b3c3e686b7272f21))

# [1.6.0](https://github-personal/ngneat/elf/compare/requests-1.5.1...requests-1.6.0) (2023-01-09)

### Features

- **requests:** support skipping duplicated parellel requests ([#417](https://github-personal/ngneat/elf/issues/417)) ([00000b9](https://github-personal/ngneat/elf/commit/00000b91952fc3670b91ed1b692a7793ae7701ab)), closes [#403](https://github-personal/ngneat/elf/issues/403)

## [1.5.1](https://github-personal/ngneat/elf/compare/requests-1.5.0...requests-1.5.1) (2022-12-12)

### Bug Fixes

- **requests-result:** add resetStaleTime to export ([#407](https://github-personal/ngneat/elf/issues/407)) ([0bb1eed](https://github-personal/ngneat/elf/commit/0bb1eedd65795f4797e14035720ce5d01afae417))

# [1.5.0](https://github-personal/ngneat/elf/compare/requests-1.4.0...requests-1.5.0) (2022-12-11)

### Features

- **requests-result:** add resetStaleTime & track lastRequestTime ([#406](https://github-personal/ngneat/elf/issues/406)) ([d7b4b3a](https://github-personal/ngneat/elf/commit/d7b4b3a34ff6783b3a46e0c21cd375c2c35f1afa))

# [1.4.0](https://github-personal/ngneat/elf/compare/requests-1.3.0...requests-1.4.0) (2022-12-10)

### Features

- **requests-result:** 🔥 add new operators ([7990b9d](https://github-personal/ngneat/elf/commit/7990b9deb51df609d5c7451a90d1f5c66284578b)), closes [#398](https://github-personal/ngneat/elf/issues/398)

# [1.3.0](https://github-personal/ngneat/elf/compare/requests-1.2.0...requests-1.3.0) (2022-11-16)

### Features

- **requests-result:** 🔥 add initialStatus support ([be49f4c](https://github-personal/ngneat/elf/commit/be49f4c5fef831bbf873b7520ed30efa3edb2b37)), closes [#379](https://github-personal/ngneat/elf/issues/379)

# [1.2.0](https://github-personal/ngneat/elf/compare/requests-1.1.4...requests-1.2.0) (2022-10-31)

### Features

- **requests:** 🔥 a simpler api for managing request result ([ba1af9a](https://github-personal/ngneat/elf/commit/ba1af9a4dffcdfeb92f1da4ca4dc7944dd1735df))
- **requests:** 🔥 add successfull requests count to result ([1b4abfb](https://github-personal/ngneat/elf/commit/1b4abfb30ad717c940e46b10cffdaa63f78f4662))

## [1.1.4](https://github.com/ngneat/elf/compare/requests-1.1.3...requests-1.1.4) (2022-07-20)

### Bug Fixes

- **requests-cache:** 🐞 remove redunant code ([94306fc](https://github.com/ngneat/elf/commit/94306fc09c54f4208d6cad165bf7a8696fbf6062))

# [1.1.3](https://github.com/ngneat/elf/compare/requests-1.1.2...requests-1.1.3) (2022-05-26)

### Bug Fixes

- **request:** fix updateRequestsCache ([#262](https://github.com/ngneat/elf/issues/262)) ([3185dbe](https://github.com/ngneat/elf/commit/3185dbe19adda9127cdbf08f0ee99562cff30d55))

## [1.1.2](https://github.com/ngneat/elf/compare/requests-1.1.1...requests-1.1.2) (2022-02-21)

### Bug Fixes

- **entities:** 🐞 add protection when the array is empty ([d322695](https://github.com/ngneat/elf/commit/d32269524f361ec823e732cadde49fa0ff777554))
- **entities:** typed support for immutable/readonly arrays ([#86](https://github.com/ngneat/elf/issues/86)) ([9cd6638](https://github.com/ngneat/elf/commit/9cd66381b7b9562eda10c52cd63bc19017ec8bbb))
- **requests-cache:** 🐞 allow passing a generic to initializeAsP ([b6830e2](https://github.com/ngneat/elf/commit/b6830e241cc5fdfdbd249ef4dc1734016adaf366)), closes [#169](https://github.com/ngneat/elf/issues/169)
- **requests-cache:** 🐞 type the return type of cache operator ([02d62de](https://github.com/ngneat/elf/commit/02d62def8aa45715fa4d3ec6aef93c8acc67a9ad)), closes [#168](https://github.com/ngneat/elf/issues/168)

# [1.1.1](https://github.com/ngneat/elf/compare/requests-1.0.1...requests-1.1.0) (2021-12-08)

### Bug Fixes

- **requests-status:** 🐞 add emission optimization ([1ac3aa5](https://github.com/ngneat/elf/commit/1ac3aa552a11dcfc9b7c262d418a224fb383c80a))

# [1.1.0](https://github.com/ngneat/elf/compare/requests-1.0.1...requests-1.1.0) (2021-12-07)

### Features

- **requests-status:** 🔥 add update multiple requests ([94d8082](https://github.com/ngneat/elf/commit/94d80826217ddf2f157c44cd66d517ad1bdde447))

## [1.0.1](https://github.com/ngneat/elf/compare/requests-1.0.0...requests-1.0.1) (2021-12-06)

### Bug Fixes

- **requests:** improve createRequestDataSource typing ([#73](https://github.com/ngneat/elf/issues/73)) ([a5d31a1](https://github.com/ngneat/elf/commit/a5d31a121e1f65bf5becb580d93f11a636b202a0))
