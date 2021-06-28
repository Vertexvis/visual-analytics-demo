import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";

import { AnalyticsData } from "../lib/analytics";
import { Analytics, CsvDataType } from "./Analytics";
import { RightDrawerWidth } from "./Layout";

interface Props {
  analyticsData: AnalyticsData;
  dataSelected?: CsvDataType;
  onCheck: (value: string, checked: boolean) => Promise<void>;
  onDataSelected: (data: CsvDataType) => Promise<void>;
  onReset: () => Promise<void>;
  sampleDataPath?: string;
}

const useStyles = makeStyles(() => ({
  paper: {
    width: RightDrawerWidth,
  },
  title: {
    textTransform: "uppercase",
  },
}));

export function RightDrawer({
  analyticsData,
  dataSelected,
  onCheck,
  onDataSelected,
  onReset,
  sampleDataPath,
}: Props): JSX.Element {
  const { paper, title } = useStyles();

  return (
    <Drawer anchor="right" variant="permanent" classes={{ paper }}>
      <Accordion expanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Analytics
          </Typography>
        </AccordionSummary>
        <Analytics
          analyticsData={analyticsData}
          dataSelected={dataSelected}
          onCheck={onCheck}
          onDataSelected={onDataSelected}
          onReset={onReset}
          sampleDataPath={sampleDataPath}
        />
      </Accordion>
    </Drawer>
  );
}
