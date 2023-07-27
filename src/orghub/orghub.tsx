import * as SDK from "azure-devops-extension-sdk";
import ReactDOM from "react-dom/client";
import App from "./App";

function init() {
  SDK.init();
  SDK.ready().then(() => {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(
      <App />
    );
  });
}

init();
