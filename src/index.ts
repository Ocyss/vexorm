import type BaseDriver from './driver/base'
import type {
  BaseModelDefinition,
  ModelFieldDefinitions,
  ModelFieldTypeInfer,
  ModelsDefinitionMerge,
  ShorthandModelFieldDefinitions,
} from './types'

export interface TableFunction extends Function {
  new (...args: any[]): any
  $tableName?: string
  $columns?: Record<string, any>
}

export default class VexORM<
  const in out NativeType extends string,
  const in out DataType extends string,
  const in out DataTypeInfer extends Record<DataType, unknown>,
  const in out ModelNames extends string,
  const in out ModelsDefinition extends BaseModelDefinition<DataType>,
  const out ModelsType extends ModelFieldTypeInfer<DataType, DataTypeInfer, any> = ModelFieldTypeInfer<
    DataType,
    DataTypeInfer,
    ModelsDefinition
  >,
> {
  '~dataType' = null as unknown as DataType
  '~nativeType' = null as unknown as NativeType
  '~dataTypeInfer' = null as unknown as DataTypeInfer
  '~modelNames' = null as unknown as ModelNames
  '~modelsDefinition' = null as unknown as ModelsDefinition
  '~modelsType' = null as unknown as ModelsType

  opt: {}
  driver: BaseDriver<DataType, NativeType, DataTypeInfer>
  modelRegister: ModelsDefinition

  constructor(driver: BaseDriver<DataType, NativeType, DataTypeInfer>, opt?: {}) {
    this.driver = driver
    this.opt = opt ?? {}
    this.modelRegister = {} as ModelsDefinition
  }

  define<const Name extends string, const Fields extends ShorthandModelFieldDefinitions<DataType>>(
    name: Name,
    fields: Fields,
    options?: never,
  ): VexORM<
    NativeType,
    DataType,
    DataTypeInfer,
    ModelNames & Name,
    ModelsDefinitionMerge<ModelsDefinition, DataType, Name, Fields>,
    ModelFieldTypeInfer<DataType, DataTypeInfer, ModelsDefinitionMerge<ModelsDefinition, DataType, Name, Fields>>
  > {
    this.modelRegister[name as unknown as ModelNames] = {
      options,
      fields: Object.entries(fields).reduce(
        (acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? { type: value } : value
          return acc
        },
        {} as ModelFieldDefinitions<DataType>,
      ),
    } as ModelsDefinition[ModelNames]
    return this as any
  }

  get<T extends keyof ModelsDefinition>(name: T): ModelsType[T] {
    console.log(name)
    return {} as ModelsType[T]
  }
}

export { VexORM }
