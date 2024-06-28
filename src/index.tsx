import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store  from "./store/store";
import { AppearanceProvider } from "@twa-dev/mark42";
import { App } from '../src/pages/App'
import '../index.css'

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
    <Provider store={store}>
<AppearanceProvider>
    <App />
</AppearanceProvider>
</Provider>);
