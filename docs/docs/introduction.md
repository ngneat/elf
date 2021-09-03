# Introduction

## What is Elf

Elf is a state management solution created by Netanel Basal, who originated the Akita state management library.  
Elf uses the [Repository design pattern](https://medium.com/@pererikbergman/repository-design-pattern-e28c0f3e4a30).
It organically emerged as part of the development of [Akita](/docs/faq#what-about-akita).

## Why Choose Elf?

Due to the nature of the repository pattern, there are several substantial benefits to using Elf for managing the state in your apps:

- When replacing Elf methods, they only need to be replaced in a single location.
- The methods are completely tree shakeable, meaning if a method is not utilized it will not be part of your bundle.
- The methods are easily hackable, and provide you with the ability to override the default handling of the state operations.
