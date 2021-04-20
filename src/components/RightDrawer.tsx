import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Drawer from "@material-ui/core/Drawer";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { BIData } from "../lib/business-intelligence";
import { RightDrawerWidth } from "./Layout";

interface Props {
  biData: BIData;
  onCheck: (value: string, checked: boolean) => Promise<void>;
  onReset: () => Promise<void>;
}

const useStyles = makeStyles(() => ({
  hm: {
    background: `linear-gradient(180deg, rgba(0,255,0,1) 0%, rgba(255,255,0,1) 50%, rgba(255,0,0,1) 100%)`,
    borderRadius: `0.375rem`,
    display: "grid",
    gridTemplateColumns: `repeat(1, minmax(0, 1fr))`,
    placeContent: `space-between`,
  },
  paper: {
    width: RightDrawerWidth,
  },
  title: {
    textTransform: "uppercase",
  },
}));

export function RightDrawer({ biData, onCheck, onReset }: Props): JSX.Element {
  const mid = (biData.max - biData.min) / 2;
  const { hm, paper, title } = useStyles();

  return (
    <Drawer anchor="right" variant="permanent" classes={{ paper }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Business Intelligence
          </Typography>
        </AccordionSummary>
        <Box mx={2} mb={1}>
          {biData.name ? (
            <Typography variant="body2">{biData.name}</Typography>
          ) : (
            <Typography variant="body2">
              No data. Drag and drop CSV onto model.
            </Typography>
          )}
          {biData.isHeatMap && (
            <Box className={hm} height={"10rem"} mb={1} textAlign="center">
              <Typography variant="body2">{biData.min}</Typography>
              <Typography variant="body2">
                {mid.toFixed(mid % 1 === 0 ? 0 : 2)}
              </Typography>
              <Typography variant="body2">{biData.max}</Typography>
            </Box>
          )}
          {biData.table && biData.table.size > 0 && (
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
                    {[...biData.table.entries()].map(([k, v]) => (
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
          {biData.name && (
            <Button onClick={onReset} variant="contained">
              Reset Model
            </Button>
          )}
        </Box>
      </Accordion>
    </Drawer>
  );
}
