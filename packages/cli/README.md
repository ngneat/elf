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
$ elf (-v|--version|version)
@ngneat/elf-cli/1.0.0-beta.0 darwin-x64 node-v14.15.4
$ elf --help [COMMAND]
USAGE
  $ elf COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`elf help [COMMAND]`](#elf-help-command)
* [`elf install`](#elf-install)
* [`elf repo`](#elf-repo)

## `elf help [COMMAND]`

display help for elf

```
USAGE
  $ elf help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `elf install`

Install Elf packages

```
USAGE
  $ elf install

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/install.ts](https://github.com/ngneat/elf/blob/v1.0.0-beta.0/src/commands/install.ts)_

## `elf repo`

Create a repository

```
USAGE
  $ elf repo

OPTIONS
  -h, --help  show CLI help
  --dry-run
```

_See code: [src/commands/repo.ts](https://github.com/ngneat/elf/blob/v1.0.0-beta.0/src/commands/repo.ts)_
<!-- commandsstop -->
