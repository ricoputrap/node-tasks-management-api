import { IncomingMessage, ServerResponse, createServer } from 'http';
import { EnumHttpStatus, EnumLogLevel } from './config/enums';
import { notFoundHandler, sendResponse } from './src/utils/http';
import { PORT } from './config/constants';
import log from './src/utils/logger';
import authRoute from './src/features/auth/route';
import tasksRoute from './src/features/tasks/route';
import userRoute from './src/features/user/route';

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

  // log the incoming request
  const msg = `${req.method} ${req.url}`;
  console.log(msg);
  log(EnumLogLevel.INFO, msg);

  const routes = [
    { url: "/api/health", handler: healthCheck },
    { url: "/api/auth", handler: authRoute },
    { url: "/api/tasks", handler: tasksRoute },
    { url: "/api/users", handler: userRoute }
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