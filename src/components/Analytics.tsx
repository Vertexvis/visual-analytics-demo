/* eslint-disable @typescript-eslint/ban-ts-comment */
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
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

const useStyles = makeStyles(() => ({
  hm: {
    background: `linear-gradient(180deg, rgba(0,255,0,1) 0%, rgba(255,255,0,1) 50%, rgba(255,0,0,1) 100%)`,
    borderRadius: `0.375rem`,
    display: "grid",
    gridTemplateColumns: `repeat(1, minmax(0, 1fr))`,
    placeContent: `space-between`,
  },
}));

export function Analytics({
  analyticsData,
  dataSelected,
  onCheck,
  onDataSelected,
  onReset,
  sampleDataPath,
}: Props): JSX.Element {
  const mid = (analyticsData.max - analyticsData.min) / 2;
  const { hm } = useStyles();

  return (
    <Box mx={2} mb={2}>
      <Box mb={2}>
        <Typography variant="body2" style={{ marginBottom: 10 }}>
          The Vertex Visual Analytics demo shows how to connect external data
          sources to your 3D digital twin, delivering powerful insights with
          ease. Select sample datasets below or{" "}
          <Link href={sampleDataPath}>
            download the corresponding CSV files
          </Link>{" "}
          to modify them yourself.
        </Typography>
        <Typography variant="body2" style={{ marginBottom: 10 }}>
          After modification, simply drag and drop the CSV files onto the model,
          and watch as your view updates to reflect the values found in the
          data.
        </Typography>
        <List>
          {Object.keys(CsvData).map((k) => (
            <ListItem
              button
              key={k}
              onClick={() => onDataSelected(k as CsvDataType)}
              selected={dataSelected === k}
            >{`${k}.csv`}</ListItem>
          ))}
        </List>
      </Box>
      {!sampleDataPath && (
        <Typography variant="body2">
          No data. Drag and drop supplied ID-mapped CSV files onto the model.
        </Typography>
      )}
      {analyticsData.isHeatMap && (
        <Box className={hm} height={"10rem"} mb={2} textAlign="center">
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
                        borderRadius={2}
                        height={"1rem"}
                        style={{ backgroundColor: v.color }}
                        width={"1rem"}
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
