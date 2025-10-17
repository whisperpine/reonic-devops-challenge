import { createServer } from "http";
import { handler } from "./dist/handler.js";

const server = createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  try {
    let event = {};
    // let isLambdaInvocation = false;

    // Check if this is a Lambda runtime invocation
    if (
      req.url === "/2015-03-31/functions/function/invocations" &&
      req.method === "POST"
    ) {
      // isLambdaInvocation = true;

      // Get request body
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        try {
          event = JSON.parse(body || "{}");
          await handleLambdaInvocation(event, res);
        } catch (error) {
          console.error("Error parsing Lambda event:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON in request body" }));
        }
      });
      return;
    }

    // Handle direct HTTP calls (for testing)
    if (req.method === "POST" && req.url === "/") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        try {
          event = JSON.parse(body || "{}");
          await handleDirectHttp(event, res);
        } catch (error) {
          console.error("Error parsing request body:", error);
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON in request body" }));
        }
      });
    } else {
      // Handle GET requests or other paths
      event = {
        httpMethod: req.method,
        path: req.url,
        headers: req.headers,
        body: "",
      };
      await handleDirectHttp(event, res);
    }
  } catch (error) {
    console.error("Server error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error" }));
  }
});

async function handleLambdaInvocation(event, res) {
  try {
    const result = await handler(event);

    // Return the result in Lambda runtime format
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error("Handler error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      statusCode: 500,
      body: JSON.stringify({ error: "Handler error", message: error.message }),
    }));
  }
}

async function handleDirectHttp(event, res) {
  try {
    const result = await handler(event);

    // Return the result directly (for easier testing)
    res.writeHead(result.statusCode, result.headers || {});
    res.end(result.body);
  } catch (error) {
    console.error("Handler error:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Handler error", message: error.message }));
  }
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Local server running on port ${PORT}`);
  console.log(
    `Lambda runtime interface: curl -XPOST "http://localhost:${PORT}/2015-03-31/functions/function/invocations" -H "Content-Type: application/json" -d '{}'`,
  );
  console.log(`Direct HTTP testing: curl -X POST http://localhost:${PORT}/`);
});
