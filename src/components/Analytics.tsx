/* eslint-disable @typescript-eslint/ban-ts-comment */
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React from "react";

// @ts-ignore
import colors from "../data/super-car/colors.csv";
// @ts-ignore
import costs from "../data/super-car/heat-maps/costs.csv";
// @ts-ignore
import defects from "../data/super-car/heat-maps/defects.csv";
// @ts-ignore
import missingColors from "../data/super-car/heat-maps/missing-colors.csv";
// @ts-ignore
import suppliers from "../data/super-car/tables/suppliers.csv";
import { AnalyticsData } from "../lib/analytics";

export type CsvDataType =
  | "colors"
  | "costs"
  | "defects"
  | "missingColors"
  | "suppliers";

export const CsvData: Record<CsvDataType, string> = {
  colors,
  costs,
  defects,
  missingColors,
  suppliers,
};

interface Props {
  analyticsData: AnalyticsData;
  dataSelected?: CsvDataType;
  onCheck: (value: string, checked: boolean) => Promise<void>;
  onDataSelected: (data: CsvDataType) => Promise<void>;
  onReset: () => Promise<void>;
  sampleDataPath?: string;
}

export function Analytics({
  analyticsData,
  dataSelected,
  onCheck,
  onDataSelected,
  onReset,
  sampleDataPath,
}: Props): JSX.Element {
  const mid = (analyticsData.max - analyticsData.min) / 2;
  return (
    <Box mx={2} mb={2}>
      {sampleDataPath && (
        <Box mb={2}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            The Vertex Visual Analytics demo shows how to connect external data
            sources to your 3D digital twin, delivering powerful insights with
            ease. Select sample datasets below or{" "}
            <Link href={sampleDataPath}>
              download the corresponding CSV files
            </Link>{" "}
            to modify them yourself.
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            After modification, simply drag and drop the CSV files onto the
            model and watch as your view updates to reflect the values found in
            the data.
          </Typography>
          <List>
            {Object.keys(CsvData).map((k) => (
              <ListItem
                button
                key={k}
                data-test-id={`${k}.csv`}
                onClick={() => onDataSelected(k as CsvDataType)}
                selected={dataSelected === k}
              >{`${k}.csv`}</ListItem>
            ))}
          </List>
        </Box>
      )}
      {!sampleDataPath && !analyticsData.name && (
        <Box mb={2}>
          <Typography variant="body2">
            No data. Drag and drop supplied ID-mapped CSV files onto the model.
          </Typography>
        </Box>
      )}
      {analyticsData.isHeatMap && (
        <Box
          sx={{
            background: `linear-gradient(180deg, rgba(0,255,0,1) 0%, rgba(255,255,0,1) 50%, rgba(255,0,0,1) 100%)`,
            borderRadius: `0.375rem`,
            display: "grid",
            gridTemplateColumns: `repeat(1, minmax(0, 1fr))`,
            height: "10rem",
            mb: 2,
            placeContent: `space-between`,
            textAlign: "center",
          }}
        >
          <Typography variant="body2">{analyticsData.min}</Typography>
          <Typography variant="body2">
            {mid.toFixed(mid % 1 === 0 ? 0 : 2)}
          </Typography>
          <Typography variant="body2">{analyticsData.max}</Typography>
        </Box>
      )}
      {analyticsData.table.size > 0 && (
        <Box mb={2}>
          <TableContainer>
            <Table padding="checkbox" size="small">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell></TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {[...analyticsData.table.entries()].map(([k, v]) => (
                  <TableRow key={k}>
                    <TableCell>
                      <Checkbox
                        color="primary"
                        checked={v.display}
                        onChange={(e) => onCheck(k, e.target.checked)}
                      />
                    </TableCell>
                    <TableCell>{k}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          backgroundColor: v.color,
                          borderRadius: 2,
                          height: "1rem",
                          width: "1rem",
                        }}
                      ></Box>
                    </TableCell>
                    <TableCell>{v.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
      {analyticsData.name && (
        <Button onClick={onReset} variant="contained">
          Reset Model
        </Button>
      )}
    </Box>
  );
}
