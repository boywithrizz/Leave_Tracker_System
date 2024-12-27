import { Context, MiddlewareFn } from 'telegraf';

interface SessionContext extends Context {
  session: {
    user?: any;
  };
}

const sessions: { [key: string]: any } = {};

// Middleware to manage user sessions
export const sessionMiddleware: MiddlewareFn<SessionContext> = (ctx, next) => {
  const userId = ctx.from?.id.toString();
  if (userId) {
    ctx.session = sessions[userId] || {};
  }
  return next().then(() => {
    if (userId) {
      sessions[userId] = ctx.session;
    }
  });
};