import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
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

export function RightDrawer({
  analyticsData,
  dataSelected,
  onCheck,
  onDataSelected,
  onReset,
  sampleDataPath,
}: Props): JSX.Element {
  return (
    <Drawer
      anchor="right"
      sx={{
        display: { sm: "block", xs: "none" },
        width: RightDrawerWidth,
        [`& .${drawerClasses.paper}`]: { width: RightDrawerWidth },
      }}
      variant="permanent"
    >
      <Accordion expanded>
        <AccordionSummary>
          <Typography sx={{ textTransform: "uppercase" }} variant="body2">
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
