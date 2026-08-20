import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [message, setMessage] = useState("Connecting to Laravel...");

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/test")
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                console.error(error);
                setMessage("Could not connect to Laravel.");
            });
    }, []);

    return (
        <div>
            <h1>Inventory + POS System</h1>
            <p>{message}</p>
        </div>
    );
}

export default App;