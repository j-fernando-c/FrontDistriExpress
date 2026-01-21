import React from 'react';

/**
 * Table.jsx - Componente de tabla reutilizable
 * 
 * Componente que proporciona una tabla responsiva con:
 * - Props: columns (array), data (array), onRowClick
 * - Diseño responsivo
 * - Filas alternadas (striped)
 * - Estado vacío
 * 
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.columns - Array de definiciones de columnas {key, label, render?, sortable?}
 * @param {Array} props.data - Array de datos a mostrar
 * @param {Function} [props.onRowClick] - Callback al hacer clic en una fila
 * @param {boolean} [props.loading] - Estado de carga
 * @returns {JSX.Element} Tabla renderizada
 */
const Table = ({ columns = [], data = [], onRowClick, loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hay datos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-200 text-gray-700 font-semibold">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={`border-b cursor-pointer transition-colors ${
                rowIndex % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              {columns.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className="px-6 py-4"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
