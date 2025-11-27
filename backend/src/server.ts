import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import config from "./config/default";

const PORT = process.env.PORT ?? config.port ?? 3000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});
