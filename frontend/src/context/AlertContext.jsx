import { createContext, useContext, useState } from "react"
import { Alert, Snackbar } from "@mui/material"

const AlertComponent = ({
  msgType,
  messageContent,
  durationTime,
  open,
  onClose,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={durationTime}
      onClose={onClose}
    >
      <Alert
        onClose={null}
        severity={msgType}
        sx={{ width: "100%" }}
      >
        {messageContent}
      </Alert>
    </Snackbar>
  )
}

export default AlertComponent

const AlertContext = createContext()

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: "info",
    message: "",
    duration: 3000,
  })

  const showAlert = (message, type = "info", duration = 2000) => {
    setAlertState({
      open: true,
      type,
      message,
      duration,
    })
  }

  const hideAlert = () => {
    setAlertState((prev) => ({ ...prev, open: false }))
  }

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      <AlertComponent
        msgType={alertState.type}
        messageContent={alertState.message}
        durationTime={alertState.duration}
        open={alertState.open}
        onClose={hideAlert}
      />
      {children}
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider")
  }
  return context
}
