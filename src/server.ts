import { config } from "./config.ts";
import { createContainer } from "./container";
import { createApp } from "./app.js";

const container = createContainer();
const app = createApp(container);

app.listen(config.port, () => console.log(`API on http://localhost:${config.port}`));