// https://twitter.com/mattpocockuk/status/1622730173446557697?s=20
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Prettify2<T> = {
  [K in keyof T]: T extends { [key in keyof any]: unknown } ? Prettify<T[K]> : T[K]
} & {}

export type Prettify3<T> = {
  [K in keyof T]: T extends { [key in keyof any]: unknown } ? Prettify2<T[K]> : T[K]
} & {}

export type BaseModelDefinition<DataType extends string> = Record<
  string,
  { options?: never; fields: ModelFieldDefinitions<DataType> }
>

export type ModelsDefinitionMerge<
  ModelsDefinition extends BaseModelDefinition<DataType>,
  DataType extends string,
  Name extends string,
  Fields extends ShorthandModelFieldDefinitions<DataType>,
> = Record<
  Name,
  {
    options?: never
    fields: ShorthandModelFieldHandler<DataType, Fields>
  }
> &
  ModelsDefinition

export type ModelFieldDefinitions<DataType extends string> = Record<string, ModelField<DataType>>

export type ShorthandModelFieldDefinitions<DataType extends string> = Record<string, ModelField<DataType> | DataType>

export type ShorthandModelFieldHandler<DataType extends string, T extends ShorthandModelFieldDefinitions<DataType>> = {
  [K in keyof T]: ShorthandFieldHandler<DataType, T[K]>
}

export type ShorthandFieldHandler<
  DataType extends string,
  T extends ModelField<DataType> | DataType,
> = T extends ModelField<DataType> ? T : ModelField<DataType> & { type: T }

export type ModelFieldTypeInfer<
  DataType extends string,
  DataTypeInfer extends Record<DataType, unknown>,
  Model extends BaseModelDefinition<DataType>,
> = {
  [ModelName in keyof Model]: InferModelField<
    DataType,
    DataTypeInfer,
    ModelFieldTypeInfer<DataType, DataTypeInfer, Model>,
    Model[ModelName]['fields']
  >
}

export type InferModelField<
  DataType extends string,
  DataTypeInfer extends Record<DataType, unknown>,
  ModelTypes extends ModelFieldTypeInfer<DataType, DataTypeInfer, any>,
  Model extends ModelFieldDefinitions<DataType>,
> = Prettify<
  {
    -readonly [FieldName in keyof Model as ModelFieldVerify<
      FieldName,
      Model[FieldName],
      FieldName,
      never
    >]: InferFieldType<DataType, DataTypeInfer, ModelTypes, Model[FieldName]>
  } & {
    -readonly [FieldName in keyof Model as ModelFieldVerify<
      FieldName,
      Model[FieldName],
      never,
      FieldName
    >]?: InferFieldType<DataType, DataTypeInfer, ModelTypes, Model[FieldName]>
  }
>

export type IsUnion<T> = (
  [T, never] extends [infer U, never]
    ? U extends unknown
      ? [T, keyof U] extends [U | boolean, keyof T]
        ? false
        : true
      : never
    : never
) extends false
  ? false
  : true

export type InferFieldType<
  DataType extends string,
  DataTypeInfer extends Record<string, unknown>,
  ModelTypes extends ModelFieldTypeInfer<DataType, DataTypeInfer, any>,
  Field extends ModelField<DataType>,
> = Field extends { type: infer T extends DataType }
  ? Field extends { enum: infer D extends unknown[] }
    ? D[number]
    : DataTypeInfer[T]
  : Field extends { reference: infer R extends string }
    ? R extends `${infer R}[]`
      ? Array<ModelTypes[R]>
      : ModelTypes[R]
    : never

// TODO: 处理 id 不为主键的特殊情况
export type ModelFieldVerify<Key, T extends ModelField<string>, RT1, RT2 = never> = Key extends 'id'
  ? RT1
  : T extends {
        primaryKey: true
      }
    ? RT1
    : T extends { default: unknown }
      ? RT1
      : T extends { notNull: true }
        ? RT1
        : RT2

export type ModelField<DataType extends string> = {
  index?: boolean
  unique?: boolean
  uniqueIndex?: boolean
  notNull?: boolean // default: false
} & (
  | {
      type: DataType
      alias?: string
      serializer?: string
      default?: unknown
      primaryKey?: boolean
      autoIncrement?: boolean
      enum?: unknown[]
    }
  | {
      reference: string
      foreignKey?: string
      onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
      onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
    }
)
