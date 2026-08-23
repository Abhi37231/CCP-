const reqQuery = { targetAudience: { in: ['Student', 'Both'] } };
let queryStr = JSON.stringify(reqQuery);
queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => $\);
console.log(queryStr);
