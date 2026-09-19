import { type ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  sortValue?: (row: T) => string | number;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
  emptyMessage?: string;
  scrollable?: boolean;
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  onRowClick,
  actions,
  emptyMessage = 'No records found',
  scrollable = true,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('asc');
    }
  };

  const sortedData = [...data];
  if (sortKey) {
    const col = columns.find((c) => c.key === sortKey);
    if (col?.sortValue) {
      sortedData.sort((a, b) => {
        const av = col.sortValue!(a);
        const bv = col.sortValue!(b);
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
    }
  }

  const actionColumn: Column<T> = { key: '_actions', header: '', width: 'w-10' };
  const allColumns = actions ? [...columns, actionColumn] : columns;

  return (
    <div className={`card overflow-hidden ${scrollable ? 'overflow-x-auto' : ''}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-axis-600 bg-axis-900/50">
            {allColumns.map((col) => (
              <th
                key={col.key}
                className={`text-left px-4 py-3 text-xs font-semibold text-ink-400 uppercase tracking-wider whitespace-nowrap ${col.width || ''} ${col.sortable ? 'cursor-pointer hover:text-ink-200' : ''}`}
                onClick={() => handleSort(col)}
              >
                <div className="flex items-center gap-1">
                  {col.header}
                  {col.sortable && sortKey === col.key && (
                    sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={allColumns.length} className="text-center py-12 text-ink-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedData.map((row) => (
              <tr
                key={rowKey(row)}
                className={`table-row-hover border-b border-axis-700/50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-ink-200 whitespace-nowrap ${col.width || ''}`}>
                    {col.render ? col.render(row) : (row as Record<string, ReactNode>)[col.key]}
                  </td>
                ))}
                {actions && (
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
