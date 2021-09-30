<p align="center">
 <img width="20%" height="20%" src="elf.png">
</p>

> A Reactive Store with Magical Powers (wip)

[comment]: <> (Elf is a reactive immutable state management solution built on top of RxJS. It uses custom RxJS operators to query the state and pure functions to update it.)

[comment]: <> (Elf encourages simplicity. It eases the hassle of creating boilerplate code and comes with robust tools, suitable for both experienced and inexperienced developers.)

[comment]: <> ([![@ngneat/elf]&#40;https://github.com/ngneat/elf/actions/workflows/ci.yml/badge.svg&#41;]&#40;https://github.com/ngneat/elf/actions/workflows/ci.yml&#41;)

[comment]: <> ([![commitizen]&#40;https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square&#41;]&#40;&#41;)

[comment]: <> ([![PRs]&#40;https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square&#41;]&#40;&#41;)

[comment]: <> ([![coc-badge]&#40;https://img.shields.io/badge/codeof-conduct-ff69b4.svg?style=flat-square&#41;]&#40;&#41;)

[comment]: <> ([![semantic-release]&#40;https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e5079.svg?style=flat-square&#41;]&#40;https://github.com/semantic-release/semantic-release&#41;)

[comment]: <> ([![styled with prettier]&#40;https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square&#41;]&#40;https://github.com/prettier/prettier&#41;)

[comment]: <> (## Features)

[comment]: <> (☑️ Modular by design <br>)

[comment]: <> (☑️ Tree Shakeable & Fully Typed <br>)

[comment]: <> (☑️ CLI <br>)

[comment]: <> (☑️ First Class Entities Support<br>)

[comment]: <> (☑️ Requests Status & Cache <br>)

[comment]: <> (☑️ Persist State<br>)

[comment]: <> (☑️ State History<br>)

[comment]: <> (☑️ Pagination<br>)

[comment]: <> (☑️ Devtools)

[comment]: <> (```ts)

[comment]: <> (import { Store, createState, withProps, select } from '@ngneat/elf';)

[comment]: <> (interface AuthProps {)

[comment]: <> ( user: { id: string } | null;)

[comment]: <> (})

[comment]: <> (const { state, config } = createState&#40;withProps<AuthProps>&#40;{ user: null }&#41;&#41;;)

[comment]: <> (const authStore = new Store&#40;{ state, name, config }&#41;;)

[comment]: <> (class AuthRepository {)

[comment]: <> ( user$ = authStore.pipe&#40;select&#40;&#40;state&#41; => state.user&#41;&#41;;)

[comment]: <> ( updateUser&#40;user: AuthProps['user']&#41; {)

[comment]: <> ( authStore.reduce&#40;&#40;state&#41; => &#40;{)

[comment]: <> ( ...state,)

[comment]: <> ( user: { id: 'Elf' },)

[comment]: <> ( }&#41;&#41;;)

[comment]: <> ( })

[comment]: <> (})

[comment]: <> (```)
