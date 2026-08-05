import aj from "../config/arcjet.js";
import { slidingWindow } from "@arcjet/node";
const securityMiddleware = async (req, res, next) => {
    if (process.env.NODE_ENV === "test")
        return next();
    try {
        const role = req.user?.role ?? "guest";
        let limit;
        let message;
        switch (role) {
            case 'admin':
                limit = 100;
                message = "admin request limit exceeded";
                break;
            case 'teacher':
            case 'student':
                limit = 80;
                message = "user request limit exceeded (10 pre minute)";
                break;
            default:
                limit = 40;
                message = " guest request limit exceeded (5 pre minute)";
                break;
        }
        const client = aj.withRule(slidingWindow({
            mode: "LIVE",
            interval: "1m",
            max: limit,
        }));
        const arcjetRequest = {
            headers: req.headers,
            method: req.method,
            url: req.originalUrl ?? req.url,
            socket: { remoteAddress: req.socket.remoteAddress ?? req.ip ?? "0.0.0.0" },
        };
        const decision = await client.protect(arcjetRequest);
        if (decision.isDenied() && decision.reason.isBot()) {
            return res.status(403).json({ error: "Forbidden", message: "Automated Request are not allowed" });
        }
        if (decision.isDenied() && decision.reason.isShield()) {
            return res.status(403).json({ error: "Forbidden", message: "Automated Request are not allowed" });
        }
        if (decision.isDenied() && decision.reason.isRateLimit()) {
            return res.status(403).json({ error: "Forbidden", message: "Automated Request are not allowed" });
        }
        next();
    }
    catch (error) {
        console.error('arcjet Middleware', error);
        res.status(500).json({ error: "Internal error", message: 'something went wrong with security Middleware ' });
    }
};
export default securityMiddleware;
//# sourceMappingURL=security.js.map