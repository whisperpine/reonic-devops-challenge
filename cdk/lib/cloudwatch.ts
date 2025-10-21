import type { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import type { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import type { Construct } from "constructs";

import {
  Alarm,
  ComparisonOperator,
  Dashboard,
  GraphWidget,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

/**
 * Create a Cloudwatch Dashboard.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @param lambdaFunction The Lambda Function to retrieve metrics from.
 * @param api The API Gateway to retrieve metrics from.
 */
export function CreateDashboard(
  scope: Construct,
  lambdaFunction: DockerImageFunction,
  api: LambdaRestApi,
): void {
  // Create Dashboard.
  const dashboard = new Dashboard(scope, "ReonicDashboard", {
    dashboardName: "ReonicDashboard",
  });

  // Lambda Function Metrics.
  dashboard.addWidgets(
    // Duration & Invocations.
    new GraphWidget({
      title: "Lambda Duration & Invocations",
      left: [lambdaFunction.metricDuration()],
      right: [lambdaFunction.metricInvocations()],
      width: 24,
      height: 6,
    }),
    // Errors & Throttles.
    new GraphWidget({
      title: "Errors & Throttles",
      left: [lambdaFunction.metricErrors()],
      right: [lambdaFunction.metricThrottles()],
      width: 12,
      height: 6,
    }),
  );

  // API Gateway Metrics.
  const apiDuration = api.metricLatency({ statistic: "Average" });
  dashboard.addWidgets(
    new GraphWidget({
      title: "API Gateway Latency",
      left: [apiDuration],
      width: 12,
      height: 6,
    }),
  );
}
