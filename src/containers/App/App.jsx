import { useState } from "react";
import JoinMatchModal from "./components/JoinMatchModal.jsx";
import Alert from "../../components/Alert.jsx";

function App() {
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <JoinMatchModal
        matchId={1}
        setShowAlert={setShowAlert}
        setAlertMessage={setAlertMessage}
      />
      <Alert
        setShowAlert={setShowAlert}
        showAlert={showAlert}
        alertMessage={alertMessage}
      ></Alert>
    </>
  );
}

export default App;
