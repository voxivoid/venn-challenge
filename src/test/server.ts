import { setupServer } from "msw/node";

// Feature tests register their own handlers with `server.use(...)`.
export const server = setupServer();
