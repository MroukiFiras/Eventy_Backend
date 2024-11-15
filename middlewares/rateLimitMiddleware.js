const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW, 10);
const MAX_REQUESTS = parseInt(process.env.MAX_REQUESTS, 10);

const rateLimit = (req, res, next) => {
  const userId = req.user.id;
  //   console.log("RATE_LIMIT_WINDOW:", RATE_LIMIT_WINDOW);
  //   console.log("MAX_REQUESTS:", MAX_REQUESTS);
  //   console.log(req.user);

  const currentTime = Date.now();
  const userRequests = rateLimitMap.get(userId) || {
    count: 0,
    startTime: currentTime,
  };

  // If the time window has expired, reset the counter
  if (currentTime - userRequests.startTime > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(userId, { count: 1, startTime: currentTime });
    next(); 
  } else if (userRequests.count < MAX_REQUESTS) {
    // Update the request count
    rateLimitMap.set(userId, {
      count: userRequests.count + 1,
      startTime: userRequests.startTime,
    });
    next();
    // console.log(rateLimitMap);
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
