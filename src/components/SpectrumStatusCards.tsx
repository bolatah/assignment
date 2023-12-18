import React, { useEffect, useState } from "react";
import {
  AppBar,
  Card,
  CardContent,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useAppDispatch } from "../redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  fetchSpectrumStatus,
} from "../features/spectrumStatus/spectrumStatusSlice";
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
  const [openDialog, setOpenDialog] = useState(false);
  const data = spectrumStatus.data;

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
    const socket = new WebSocket(
      "wss://webfrontendassignment-isaraerospace.azurewebsites.net/api/SpectrumWS"
    );

    socket.onopen = () => {
      console.log("WebSocket connection opened");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      dispatch(fetchSpectrumStatus.fulfilled(data, "", undefined));
      if (data.IsActionRequired) {
        setOpenDialog(true);
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    socket.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
    };

    // Cleanup function
    return () => {
      socket.close();
    };
  }, [dispatch]);

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleAction = () => {
    fetch(
      "https://webfrontendassignment-isaraerospace.azurewebsites.net/api/ActOnSpectrum",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to take action");
        }
      })
      .catch((error) => {
        console.error("Error taking action:", error);
      })
      .finally(() => {
        setOpenDialog(false);
      });
  };

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
                  {key === "StatusMessage" && (
                    <>
                      <Typography className={classes.title}>
                        Message:{" "}
                      </Typography>
                      <Typography>{value}</Typography>
                    </>
                  )}
                  {key === "IsAscending" && (
                    <>
                      <Typography className={classes.title}>
                        Current Status:{" "}
                      </Typography>
                      <Typography>
                        {value ? "Ascending" : "Descending"}
                      </Typography>
                    </>
                  )}
                  {key === "IsActionRequired" && (
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
                  {key === "Temperature" && (
                    <TemperatureGaugeChart
                      temperature={Math.round(value as number)}
                    />
                  )}
                  {key === "Velocity" && (
                    <VelocityGaugeChart velocity={value as number} />
                  )}
                  {key === "Altitude" && (
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

      {/* Dialog for action required */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Action Required</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Action is required. Please take the necessary action.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAction} color="primary">
            Take Action
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SpectrumStatusCards;
