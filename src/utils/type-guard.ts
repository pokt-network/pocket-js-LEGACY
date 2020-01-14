// Credit: https://dev.to/krumpet/generic-type-guard-in-typescript-258l
interface ITypeMap {
  // for mapping from strings to types
  string: string
  number: number
  boolean: boolean
}

// tslint:disable-next-line
type PrimitiveOrConstructor = { new (...args: any[]): any } | keyof ITypeMap // 'string' | 'number' | 'boolean' | constructor

// infer the guarded type from a specific case of PrimitiveOrConstructor
type GuardedType<T extends PrimitiveOrConstructor> = T extends {
  // tslint:disable-next-line
  new (...args: any[]): infer U
}
  ? U
  : T extends keyof ITypeMap
  ? ITypeMap[T]
  : never

/**
 * A generic type guard function to verify the class of a particular object, specially used for Error checks
 * @param o Object to check the class for
 * @param className The class to check against
 */
export function typeGuard<T extends PrimitiveOrConstructor>(
  o: any,
  className: T
): o is GuardedType<T> {
  const localPrimitiveOrConstructor: PrimitiveOrConstructor = className
  if (typeof localPrimitiveOrConstructor === "string") {
    return typeof o === localPrimitiveOrConstructor
  }
  return o instanceof localPrimitiveOrConstructor
}
