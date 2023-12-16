import React, { useEffect } from "react";
import {
  AppBar,
  Card,
  CardContent,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useAppDispatch } from "../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { fetchSpectrumStatus } from "../features/spectrumStatus/spectrumStatusSlice";
import TemperatureGaugeChart from "./TemperatureGaugeChart"; // Import the TemperatureGaugeChart component
import VelocityGaugeChart from "./VelocityGaugeChart";
import AltitudeGaugeChart from "./AltitudeGaugeChart";
import RefreshIcon from "@mui/icons-material/Refresh";

const useStyles = makeStyles()({
  rowContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "flex-start",
  },

  card: {
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  title: {
    textAlign: "left",
    color: "#555",
    fontWeight: "bold",
  },
  value: {
    textAlign: "center",
    fontWeight: "bold",
  },
  action: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px",
    borderRadius: "5px",
  },
  appBar: {
    position: "relative",
  },
  toolbar: {
    justifyContent: "flex-end",
  },
});

const SpectrumStatusCards: React.FC = () => {
  const dispatch = useAppDispatch();
  const spectrumStatus = useSelector(
    (state: RootState) => state.spectrumStatus
  );
  const { classes } = useStyles();

  const getRandomColor = (): string => {
    const base = Math.floor(Math.random() * 51);
    const deviation = Math.floor(Math.random() * 26);

    const red = base + deviation;
    const green = base + deviation;
    const blue = base + deviation;

    return `rgb(${red},${green},${blue})`;
  };

  const handleRefresh = () => {
    dispatch(fetchSpectrumStatus());
  };

  useEffect(() => {
    dispatch(fetchSpectrumStatus());
  }, [dispatch]);

  const data = spectrumStatus.data;
  console.log(data);

  if (spectrumStatus.loading === "loading") {
    return <div>Loading...</div>;
  }

  if (spectrumStatus.loading === "failed") {
    return <div>Error: {spectrumStatus.error}</div>;
  }

  return (
    <div>
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <IconButton color="inherit" onClick={handleRefresh}>
            Refresh <RefreshIcon style={{ marginLeft: "5px" }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.rowContainer}>
        {data &&
          Object.entries(data).map(([key, value], index) =>
            index < 3 ? null : (
              <Card
                key={key}
                className={classes.card}
                style={{ maxHeight: "88px" }}
              >
                <CardContent>
                  {key === "statusMessage" && (
                    <>
                      <Typography className={classes.title}>
                        Message:{" "}
                      </Typography>
                      <Typography>{value}</Typography>
                    </>
                  )}
                  {key === "isAscending" && (
                    <>
                      <Typography className={classes.title}>
                        Current Status:{" "}
                      </Typography>
                      <Typography>
                        {value ? "Ascending" : "Descending"}
                      </Typography>
                    </>
                  )}
                  {key === "isActionRequired" && (
                    <>
                      <Typography className={classes.title}>
                        Action Status:
                      </Typography>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ marginRight: "5px" }}>
                          {value
                            ? "Action is required."
                            : "Action is not required."}
                        </span>
                        {value ? (
                          <span className={classes.action}>
                            <span
                              role="img"
                              aria-label="Warning Icon"
                              style={{ marginRight: "5px" }}
                            >
                              ⚠️
                            </span>
                          </span>
                        ) : (
                          <span className={classes.action}>
                            <span
                              role="img"
                              aria-label="Thick Icon"
                              style={{ marginRight: "5px" }}
                            >
                              ✔️
                            </span>
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )
          )}
      </div>
      <div className={classes.cardContainer}>
        {data &&
          Object.entries(data).map(([key, value], index) =>
            index > 2 ? null : (
              <Card key={key} className={classes.card}>
                <CardContent>
                  {key === "temperature" && (
                    <TemperatureGaugeChart
                      temperature={Math.round(value as number)}
                    />
                  )}
                  {key === "velocity" && (
                    <VelocityGaugeChart velocity={value as number} />
                  )}
                  {key === "altitude" && (
                    <AltitudeGaugeChart altitude={value as number} />
                  )}
                  <Typography
                    className={classes.value}
                    style={{ color: getRandomColor(), fontWeight: "bold" }}
                  >
                    {key as React.ReactNode}
                  </Typography>
                </CardContent>
              </Card>
            )
          )}
      </div>
    </div>
  );
};

export default SpectrumStatusCards;
