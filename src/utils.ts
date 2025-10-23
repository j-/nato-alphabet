export function isNotNull<T> (arg: T): arg is Exclude<T, null | undefined | '' | false | 0> {
  return !!arg;
}
