import type { TableColumnCtx, TableInstance } from 'element-plus'

type RowKey<TRow extends object> = Extract<keyof TRow, string>

export type ZeTableColumn<TRow extends object> = Omit<Partial<TableColumnCtx<TRow>>, 'prop'> & {
  prop?: RowKey<TRow>
  hidden?: boolean
}

export const defineTableColumns = <TRow extends object>(columns: ZeTableColumn<TRow>[]): ZeTableColumn<TRow>[] =>
  columns

export type ZeTableInstance = TableInstance & {
  toggleAllExpansion: () => void
}
