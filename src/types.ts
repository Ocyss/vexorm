// https://twitter.com/mattpocockuk/status/1622730173446557697?s=20
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Prettify2<T> = {
  [K in keyof T]: T extends { [key in keyof any]: unknown } ? Prettify<T[K]> : T[K]
} & {}

export type BaseModelDefinition<DataType extends string> = Record<
  string,
  { options?: never; fields: ModelFieldDefinitions<DataType> }
>

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
  [ModelName in keyof Model]: {
    [FieldName in keyof Model[ModelName]['fields']]: InferFieldType<
      DataType,
      DataTypeInfer,
      Model[ModelName]['fields'][FieldName]
    >
  }
}

export type InferModelField<
  DataType extends string,
  DataTypeInfer extends Record<DataType, unknown>,
  Model extends ModelFieldDefinitions<DataType>,
> = Prettify<{
  [FieldName in keyof Model]: InferFieldType<DataType, DataTypeInfer, Model[FieldName]>
}>

type IsValidDefault<T, D> = D extends T ? D : never

export type InferFieldType<
  DataType extends string,
  DataTypeInfer extends Record<DataType, unknown>,
  Field extends ModelField<DataType>,
> = Field extends { type: infer T extends DataType }
  ? Field extends { default: infer D }
    ? IsValidDefault<DataTypeInfer[T], D> extends never
      ? never
      : D extends { readonly [K: string]: unknown }
        ? D
        : D extends DataTypeInfer[T]
          ? D
          : DataTypeInfer[T]
    : DataTypeInfer[T]
  : never

export type ModelFieldForeignConfig = {}

export type ModelField<DataType extends string> = {
  index?: boolean
  unique?: boolean
  uniqueIndex?: boolean
  notNull?: boolean
} & (
  | {
      type: DataType
      ignore?: boolean
      alias?: string
      serializer?: string
      default?: unknown
      primaryKey?: boolean
      autoIncrement?: boolean
    }
  | {
      reference: string
      foreignKey?: string
      onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
      onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION'
    }
)
