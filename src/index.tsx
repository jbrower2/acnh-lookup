import * as React from "react";
import * as ReactDOM from "react-dom";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

import * as rawData from "./all-data.json";

type DataFile = {
  data: Record[];
};

type Record = {
  itemType: string;
  name: string;
  diy: string;
  variation: string;
  pattern: string;
  buy: string;
  sell: string;
  color1: string;
  color2: string;
  source: string;
  sourceNotes: string;
  hhaBasePoints: string;
  hhaConcept1: string;
  hhaConcept2: string;
  hhaSeries: string;
  hhaSet: string;
  hhaCategory: string;
  labelThemes: string;
  filename: string;
  internalId: string;
  variantId: string;
  imageUrl: string;
  lowerName: string;
  spaceName: string;
};

const recordsById = new Map<string, Record[]>();
(rawData as DataFile).data.forEach((record) => {
  let byId = recordsById.get(record.internalId);
  if (!byId) {
    byId = [];
    recordsById.set(record.internalId, byId);
  }
  byId.push(record);
  record.imageUrl = `https://acnhcdn.com/latest/FtrIcon/${record.filename}.png`;
  record.lowerName = record.name.toLowerCase();
  record.spaceName = ` ${record.lowerName} `;
});

const unique: Record[] = [];
recordsById.forEach(([first]) => unique.push(first));

const Search = () => {
  const [filtered, setFiltered] = React.useState(
    undefined as undefined | Record[]
  );

  const performSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim().toLowerCase().replace(/\s+/g, " ");
    if (!query) {
      setFiltered(undefined);
      return;
    }
    const queryWithSpaces = ` ${query} `;
    let filtered = unique.filter((record) =>
      record.spaceName.includes(queryWithSpaces)
    );
    if (!filtered.length)
      filtered = unique.filter((record) => record.lowerName.includes(query));
    if (!filtered.length) {
      filtered = unique.filter((record) => {
        let queryIndex = 0;
        for (
          let nameIndex = 0;
          nameIndex < record.lowerName.length && queryIndex < query.length;
          nameIndex++
        ) {
          if (record.lowerName[nameIndex] === query[queryIndex]) {
            queryIndex++;
          }
        }
        return queryIndex === query.length;
      });
    }
    setFiltered(filtered.slice(0, 50));
  };

  return (
    <>
      <TextField label="Search" onChange={performSearch} />
      {filtered && (
        <TableContainer component={Paper}>
          <Table className="results-table">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Sell</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((record) => (
                <TableRow key={record.filename}>
                  <TableCell>{record.itemType}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>
                    <img src={record.imageUrl} alt={record.name} />
                  </TableCell>
                  <TableCell>{record.sell}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

ReactDOM.render(<Search />, document.getElementById("app-root"));
