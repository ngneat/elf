# @ngneat/elf-cli

elf cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@ngneat/elf-cli.svg)](https://npmjs.org/package/@ngneat/elf-cli)
[![CircleCI](https://circleci.com/gh/https://github.com/ngneat/elf/https://github.com/ngneat/elf/tree/master.svg?style=shield)](https://circleci.com/gh/https://github.com/ngneat/elf/https://github.com/ngneat/elf/tree/master)
[![Downloads/week](https://img.shields.io/npm/dw/@ngneat/elf-cli.svg)](https://npmjs.org/package/@ngneat/elf-cli)
[![License](https://img.shields.io/npm/l/@ngneat/elf-cli.svg)](https://github.com/https://github.com/ngneat/elf/https://github.com/ngneat/elf/blob/master/package.json)

<!-- toc -->
* [@ngneat/elf-cli](#ngneatelf-cli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @ngneat/elf-cli
$ elf COMMAND
running command...
$ elf (--version)
@ngneat/elf-cli/3.1.0 darwin-arm64 node-v24.3.0
$ elf --help [COMMAND]
USAGE
  $ elf COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`elf install`](#elf-install)
* [`elf repo`](#elf-repo)

## `elf install`

Install Elf packages

```
USAGE
  $ elf install [-h]

FLAGS
  -h, --help  Show CLI help.

DESCRIPTION
  Install Elf packages
```

_See code: [src/commands/install.ts](https://github.com/ngneat/elf/blob/v3.1.0/src/commands/install.ts)_

## `elf repo`

Create a repository

```
USAGE
  $ elf repo [--dry-run] [-h]

FLAGS
  -h, --help     Show CLI help.
  --dry-run

DESCRIPTION
  Create a repository
```

_See code: [src/commands/repo.ts](https://github.com/ngneat/elf/blob/v3.1.0/src/commands/repo.ts)_
<!-- commandsstop -->
