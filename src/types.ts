export type BaseModelDefinition<DataType extends string, DataTypeInfer extends Record<DataType, unknown>> = Record<
  string,
  { options?: never; fields: ModelFieldDefinitions<DataType, DataTypeInfer> }
>

export type ModelFieldDefinitions<DataType extends string, DataTypeInfer extends Record<DataType, unknown>> = {
  [k: string]: ModelField<DataType, DataTypeInfer>
}

export type ShorthandModelFieldDefinitions<
  DataType extends string,
  DataTypeInfer extends Record<DataType, unknown>,
> = Record<string, ModelField<DataType, DataTypeInfer> | DataType>

export type ShorthandModelFieldHandler<
  DataType extends string,
  T extends ShorthandModelFieldDefinitions<DataType, Record<DataType, unknown>>,
> = {
  [K in keyof T]: ShorthandFieldHandler<DataType, Record<DataType, unknown>, T[K]>
}

export type ShorthandFieldHandler<
  DataType extends string,
  DataTypeInfer extends Record<DataType, unknown>,
  T extends ModelField<DataType, DataTypeInfer> | DataType,
> = T extends ModelField<DataType, DataTypeInfer> ? T : ModelField<DataType, DataTypeInfer> & { type: T }

export type ModelFieldTypeInfer<
  DataType extends string,
  DataTypeInfer extends Record<DataType, unknown>,
  Model extends BaseModelDefinition<DataType, DataTypeInfer>,
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
  Model extends ModelFieldDefinitions<DataType, DataTypeInfer>,
> = {
  [FieldName in keyof Model]: InferFieldType<DataType, DataTypeInfer, Model[FieldName]>
}

export type InferFieldType<
  DataType extends string,
  DataTypeInfer extends Record<DataType, unknown>,
  Field extends ModelField<DataType, DataTypeInfer>,
> = Field extends { default: infer TDefault }
  ? TDefault
  : Field extends { type: infer T }
    ? T extends DataType
      ? DataTypeInfer[T]
      : never
    : never

export type ModelField<
  DataType extends string,
  DataTypeInfer extends Record<DataType, unknown>,
  T extends DataTypeInfer[DataType] = DataTypeInfer[DataType],
> = {
  type: DataType
  ignore?: boolean
  alias?: string
  serializer?: string

  default?: T
  primaryKey?: boolean
  foreignKey?: string
  index?: boolean
  unique?: boolean
  uniqueIndex?: boolean

  notNull?: boolean
  autoIncrement?: boolean
  check?: string
}
