import { useState } from "react";
import JoinMatchButton from "./components/JoinMatchButton";
import Alert from "../../components/Alert.jsx";

function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <JoinMatchButton
        matchId={1}
        setShowAlert={setShowAlert}
        setAlertMessage={setAlertMessage}
      ></JoinMatchButton>
      <Alert
        setShowAlert={setShowAlert}
        showAlert={showAlert}
        alertMessage={alertMessage}
      ></Alert>
    </>
  );
}

export default App;
