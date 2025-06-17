import { Database } from 'bun:sqlite'
import BaseDriver, { StandardDataType, type StandardDataTypeMap } from './base'

export const DBNativeType = ['integer', 'real', 'text', 'blob'] as const
export type DBNativeType = (typeof DBNativeType)[number]
export const DriverDataType = StandardDataType
export type DriverDataType = (typeof DriverDataType)[number]
export type DataTypeMaps = StandardDataTypeMap

type SQLiteOpenArgs = Parameters<typeof Database.open>

class SQLite<
  const DataType extends DriverDataType = DriverDataType,
  const NativeType extends DBNativeType = DBNativeType,
  const DataTypeMap extends DataTypeMaps = DataTypeMaps,
> extends BaseDriver<DataType, NativeType, DataTypeMap> {
  protected driverName = 'sqlite' as const
  dsn: string
  db: Database
  constructor(dsn: SQLiteOpenArgs[0], opt?: SQLiteOpenArgs[1]) {
    super()
    this.dsn = dsn
    this.db = Database.open(dsn, opt)
  }

  query() {}
}

class QueryBuilder {
  private driver: SQLite

  constructor(driver: SQLite) {
    this.driver = driver
  }

  select(): QueryBuilder {
    return this
  }
  from(): QueryBuilder {
    return this
  }
  join(): QueryBuilder {
    return this
  }
  leftJoin(): QueryBuilder {
    return this
  }
  rightJoin(): QueryBuilder {
    return this
  }
  innerJoin(): QueryBuilder {
    return this
  }

  where(): QueryBuilder {
    return this
  }
  and(): QueryBuilder {
    return this
  }
  or(): QueryBuilder {
    return this
  }
  order(): QueryBuilder {
    return this
  }
  group(): QueryBuilder {
    return this
  }
  having(): QueryBuilder {
    return this
  }
  limit(): QueryBuilder {
    return this
  }
  offset(): QueryBuilder {
    return this
  }
  scopes(): QueryBuilder {
    return this
  }

  first() {
    return this.driver.db.query('SELECT * FROM users').get()
  }
  find() {}
  take() {}
  last() {}
  count() {}

  findInBatches() {}
  firstOrInit() {}
  firstOrCreate() {}
  firstOrUpdate() {}

  pluck() {}
  scan() {}
  rows() {}
}

function open(...args: ConstructorParameters<typeof SQLite>) {
  return new SQLite(...args)
}

export default { open, SQLite, QueryBuilder }
