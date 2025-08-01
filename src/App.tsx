import { Provider } from "jotai";
import { Board } from "./components/Board";

function App() {
  return (
    <Provider>
      <Board />
    </Provider>
  );
}

export default App;
