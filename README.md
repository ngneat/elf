<p align="center">
 <img width="20%" height="20%" src="elf.png">
</p>

> A Tiny Reactive Store with Magical Powers

Elf is a reactive immutable state management solution built on top of RxJS. It uses custom RxJS operators to query the state and pure functions to update it.

Elf encourages simplicity. It eases the hassle of creating boilerplate code and comes with robust tools, suitable for both experienced and inexperienced developers.

[![Build Status](https://travis-ci.org/ngneat/elf.svg?branch=master)](https://travis-ci.org/ngneat/elf)
[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()
[![coc-badge](https://img.shields.io/badge/codeof-conduct-ff69b4.svg?style=flat-square)]()
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e5079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

```ts
import { Store, createState, withProps, select } from '@ngneat/elf';

interface AuthProps {
  user: { id: string } | null;
}

const { state, config } = createState(withProps<AuthProps>({ user: null }));

const authStore = new Store({ state, name, config });

const user$ = authStore.pipe(select((state) => state.user));

authStore.reduce((state) => ({
  ...state,
  user: { id: 'Elf' },
}));
```
