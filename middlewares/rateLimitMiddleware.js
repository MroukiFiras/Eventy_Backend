const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW, 10);
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10);

const rateLimit = (req, res, next) => {
  const userId = req.user.id;

  const currentTime = Date.now();
  const userRequests = rateLimitMap.get(userId) || {
    count: 0,
    startTime: currentTime,
  };

  if (userRequests.count < MAX_REQUESTS) {
    // Update request count and reset startTime if needed
    rateLimitMap.set(userId, {
      count: userRequests.count + 1,
      startTime: userRequests.startTime,
    });
    next(); // Allow request
  } else if (currentTime - userRequests.startTime > RATE_LIMIT_WINDOW) {
    // Reset the window and allow the request
    rateLimitMap.set(userId, { count: 1, startTime: currentTime });
    next();
  } else {
    res.status(429).json({
      message:
        "Too many requests. Please wait a few minutes before trying again.",
    });
  }
};

export default {
  rateLimit,
};
