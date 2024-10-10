import { IncomingMessage, ServerResponse, createServer } from 'http';
import { EnumHttpStatus, EnumLogLevel } from './config/enums';
import { notFoundHandler, sendResponse } from './src/http';
import { PORT } from './config/constants';
import log from './src/logger';

const healthCheck = (req: IncomingMessage, res: ServerResponse) => {
  log(EnumLogLevel.INFO, "Health check request");
  sendResponse({
    res,
    status: EnumHttpStatus.OK,
    success: true,
    message: 'OK'
  });
}

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.setHeader('Content-Type', 'application/json');

  const routes = [
    { url: "/api/health", handler: healthCheck },
  ];

  const matchedRoute = routes.find((route) => req.url?.startsWith(route.url));

  if (matchedRoute) {
    matchedRoute.handler(req, res);
  } else {
    notFoundHandler(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
})