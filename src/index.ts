import type BaseDriver from './driver/base'
import type {
  BaseModelDefinition,
  InferFieldType,
  ModelFieldDefinitions,
  ModelFieldTypeInfer,
  ShorthandFieldHandler,
  ShorthandModelFieldDefinitions,
  ShorthandModelFieldHandler,
} from './types'

export interface TableFunction extends Function {
  new (...args: any[]): any
  $tableName?: string
  $columns?: Record<string, any>
}

export default class VexORM<
  const in out DataType extends string,
  const in out NativeType extends string,
  const in out DataTypeInfer extends Record<DataType, unknown>,
  const out ModelDefinition extends BaseModelDefinition<DataType, DataTypeInfer>,
  const out ModelTypes extends ModelFieldTypeInfer<DataType, DataTypeInfer, ModelDefinition> = ModelFieldTypeInfer<
    DataType,
    DataTypeInfer,
    ModelDefinition
  >,
> {
  '~dataType' = null as unknown as DataType
  '~nativeType' = null as unknown as NativeType
  '~dataTypeInfer' = null as unknown as DataTypeInfer
  '~modelDefinition' = null as unknown as ModelDefinition
  '~modelTypes' = null as unknown as ModelTypes

  opt: {}
  driver: BaseDriver<DataType, NativeType, DataTypeInfer>
  modelRegister: ModelDefinition

  constructor(driver: BaseDriver<DataType, NativeType, DataTypeInfer>, opt?: {}) {
    this.driver = driver
    this.opt = opt ?? {}
    this.modelRegister = {} as ModelDefinition
  }

  registerModel<
    const Name extends string,
    const Fields extends ShorthandModelFieldDefinitions<DataType, DataTypeInfer>,
  >(
    name: Name,
    fields: Fields,
    options?: never,
  ): VexORM<
    DataType | `model.${Name}`,
    NativeType,
    DataTypeInfer &
      Record<
        `model.${Name}`,
        {
          [FieldName in keyof Fields]: InferFieldType<
            DataType,
            DataTypeInfer,
            ShorthandFieldHandler<DataType, DataTypeInfer, Fields[FieldName]>
          >
        }
      >,
    ModelDefinition & {
      [x in Name]: {
        options?: never
        fields: ShorthandModelFieldHandler<DataType, DataTypeInfer, Fields>
      }
    }
  > {
    this.modelRegister[name] = {
      options,
      fields: Object.entries(fields).reduce(
        (acc, [key, value]) => {
          acc[key] = typeof value === 'string' ? { type: value } : value
          return acc
        },
        {} as ModelFieldDefinitions<DataType, DataTypeInfer>,
      ),
    } as ModelDefinition[Name]
    return this as any
  }

  get<T extends keyof ModelDefinition>(name: T): ModelTypes[T] {
    console.log(name)
    return {} as ModelTypes[T]
  }
}

export { VexORM }
