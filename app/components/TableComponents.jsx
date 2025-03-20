export const Table = ({ children }) => (
    <table className="min-w-full border-collapse border border-gray-300 mt-4">
      {children}
    </table>
  );
  
  export const TableHeader = ({ children }) => (
    <th className="border border-gray-300 px-4 py-2 text-left bg-gray-100">
      {children}
    </th>
  );
  
  export const TableCell = ({ children }) => (
    <td className="border border-gray-300 px-4 py-2 text-left">{children}</td>
  );
  
  export const TableRow = ({ children }) => (
    <tr className="border-b">{children}</tr>
  );
  