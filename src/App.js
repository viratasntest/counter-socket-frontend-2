import { useState, useEffect } from "react";
import "./App.css";
import Button from "./components/Buttons/Button";
import io from "socket.io-client";

const socket = io("http://localhost:8000/", { transports: ["websocket"] });
function App() {
  const [counters, setCounters] = useState([
    { key: 1, value: 0 },
    { key: 2, value: 0 },
    { key: 3, value: 0 },
  ]);

  useEffect(() => {
    // To check if this app is connected to server
    socket.on("connect", () => {
      console.log("connected.....");
    });

    socket.emit("clicked1", counters);

    socket.on("click_count1", function (value) {
      setCounters(value);
    });
  }, []);

  const incrementCounters = () => {
    let arr = [...counters];
    arr.push({ key: arr.length + 1, value: 0 });
    setCounters(arr);
  };

  const decrementCounters = () => {
    let arr = [...counters];
    arr.pop();
    setCounters(arr);
  };

  return (
    <div>
      <div className="counters-counter">
        <Button onClick={incrementCounters} title="Add a counter" />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<h1>{counters.length}</h1>
        <Button onClick={decrementCounters} title="Remove a counter" />
      </div>

      {counters?.map((counter) => {
        return (
          <div className="counter-card" key={counter.key}>
            <h1>
              Counter-{counter.key} : {counter.value}
            </h1>
            <div className="btn-container">
              <Button
                title={"Increment counter" + counter.key}
                onClick={() => {
                  let arr = [...counters];
                  let index = arr.findIndex((a) => a.key === counter.key);
                  arr[index] = { key: counter.key, value: counter.value + 1 };
                  socket.emit("clicked1", arr);
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
