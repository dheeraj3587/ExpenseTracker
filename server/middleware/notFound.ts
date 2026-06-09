import type { RequestHandler } from 'express';

export const notFound: RequestHandler = (request, response) => {
  response.status(404).json({
    message: `Route ${request.method} ${request.originalUrl} not found.`,
  });
};
