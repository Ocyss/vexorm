export const StandardDataType = ['int', 'float', 'str', 'bool', 'bytes', 'datetime', 'timestamp', 'json'] as const
export type StandardDataType = (typeof StandardDataType)[number]

export type StandardDataTypeMap = {
  int: number
  float: number
  str: string
  bool: boolean
  bytes: Uint8Array
  datetime: Date
  timestamp: number
  json: unknown
}

export default abstract class BaseDriver<
  const in out DataType extends string,
  const in out NativeType,
  const in out DataTypeMap extends Record<DataType, unknown>,
> {
  '~type' = null as unknown as DataType
  '~nativeType' = null as unknown as NativeType
  '~dataTypeMap' = null as unknown as DataTypeMap

  protected abstract driverName: string
}

export { BaseDriver }
