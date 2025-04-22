import React, { createContext, useState, useContext, useEffect } from "react";
import { Alert, Snackbar } from "@mui/material";

const AlertComponent = ({ msgType, messageContent, durationTime, open, onClose }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={durationTime}
      onClose={onClose}
    >
      <Alert onClose={null} severity={msgType} sx={{ width: "100%" }}>
        {messageContent}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = "info", duration = 3000) => {
    setAlerts((prevAlerts) => [
      ...prevAlerts,
      { message, type, duration, open: true },
    ]);
  };

  useEffect(() => {
    window.$toast = showAlert;

    return () => {
      delete window.$toast;
    };
  }, []);

  return (
    <AlertContext.Provider value={{ alerts, showAlert }}>
      {alerts.map((alert, index) => (
        <AlertComponent
          key={index}
          msgType={alert.type}
          messageContent={alert.message}
          durationTime={alert.duration}
          open={alert.open}
          onClose={() =>
            setAlerts((prevAlerts) =>
              prevAlerts.map((a, i) =>
                i === index ? { ...a, open: false } : a
              )
            )
          }
        />
      ))}
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
