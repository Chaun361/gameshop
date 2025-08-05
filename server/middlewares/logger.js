const logger = (req, res, next) => {
    console.log(`${req.method} ${req.url} ${req.headers.origin}`);
    next();
}

export default logger;