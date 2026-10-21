
import http from "k6/http";
import { sleep, check } from "k6";
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

const BASE_URL = __ENV.API_BASE_URL || "http://localhost:8080";

export const options = {
  duration: "30s",
  vus: 1,
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"],
  },
};

export default function () {
  const healthRes = http.get(`${BASE_URL}/api/health`);

  check(healthRes, {
    "health check status is 200": (r) => r.status === 200,
  });

  const payload = JSON.stringify({
    title: `Test Bug ${Date.now()}`,
    description: "This is a test bug created by k6",
    priority: "Medium",
    status: "Open",
  });

  const headers = { "Content-Type": "application/json" };

  const createBugRes = http.post(
    `${BASE_URL}/api/bugs`,
    payload,
    { headers }
  );

  check(createBugRes, {
    "create bug status is 201": (r) => r.status === 201,
    "bug has an id": (r) => {
      try {
        return JSON.parse(r.body).id !== undefined;
      } catch {
        return false;
      }
    },
  });

  sleep(5);
}

export function handleSummary(data) {
  return {
    "perf-results.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
