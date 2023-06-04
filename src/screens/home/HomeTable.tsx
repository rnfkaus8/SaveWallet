import React from 'react';
import { Row, Rows, Table } from 'react-native-table-component';

interface HomeTableProps {
  tableHead: string[];
  tableRow: (string | number)[][];
}

const HomeTable: React.FC<HomeTableProps> = ({ tableHead, tableRow }) => {
  return (
    <Table borderStyle={{ borderWidth: 2, borderColor: 'gray' }}>
      <Row
        style={{ backgroundColor: '#f1f8ff' }}
        textStyle={{ textAlign: 'center', color: 'black' }}
        data={tableHead}
      />
      <Rows
        textStyle={{ textAlign: 'center', color: 'black' }}
        data={tableRow}
      />
    </Table>
  );
};

export default HomeTable;
