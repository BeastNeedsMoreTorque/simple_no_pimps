import { useTable, useSortBy } from 'react-table';
import {classNames} from './shared/Utils'

export function StatusPill({value}) {
    const status = value ? value.toLowerCase() : "unknown";

    return (
      <span
        className={classNames(
          'leading-wide rounded-full px-3 py-1 text-xs font-bold uppercase shadow-sm',
          status.startsWith('active') ? 'bg-green-100 text-green-700' : null,
          status.startsWith('inactive')
            ? 'bg-yellow-100 text-yellow-700'
            : null,
          status.startsWith('offline') ? 'bg-red-100 text-red-700' : null
        )}>
        {status}
      </span>
    );
}

function Table({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, preparedRows } =
    useTable({
      columns,
      data,
    });

  //render the UI for your table
  return (
    <table {...getTableProps()} border='1'>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupsProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' ▼' : ' ▲') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          preparedRows(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default Table;
