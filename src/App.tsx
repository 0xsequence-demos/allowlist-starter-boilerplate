import Home from "./Home";
import { SequenceKit } from "@0xsequence/kit";
import { embeddedConfig, universalConfig } from "./config";
import "@0xsequence/design-system/styles.css";
import { ToastProvider } from "@0xsequence/design-system";

const App = () => {
  const kitType = import.meta.env.VITE_WALLET_TYPE;
  return (
    <ToastProvider swipeDirection="right" duration={2000}>
      <SequenceKit
        config={kitType === "universal" ? universalConfig : embeddedConfig}
      >
        <Home />
      </SequenceKit>
    </ToastProvider>
  );
};

export default App;
