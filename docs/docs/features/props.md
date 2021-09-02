# Props
This feature allows you to hold additional store properties separate from its main storage, such as which filters the
user is currently using.

```ts
const { state, config } = createState(
  withProps<Props>({ filter: 'ALL' })
);
``` 