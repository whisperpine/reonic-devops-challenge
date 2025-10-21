import { RemovalPolicy } from "aws-cdk-lib";
import type { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import type { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import type { Construct } from "constructs";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

import {
  Alarm,
  ComparisonOperator,
  Dashboard,
  GraphWidget,
  TreatMissingData,
} from "aws-cdk-lib/aws-cloudwatch";

/**
 * Create an AWS Cloudwatch Log Group.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @param name The name used to be the part of th LogGroupName.
 * @returns The created AWS Cloudwatch Log Group.
 */
export default function CreateCloudwatchLogGroup(
  scope: Construct,
  name: string,
): LogGroup {
  // Log Group.
  const apiLogGroup = new LogGroup(scope, "ReonicApiGatewayLogGroup", {
    logGroupName: `/aws/apigateway/${name}`,
    retention: RetentionDays.ONE_WEEK,
    removalPolicy: RemovalPolicy.DESTROY,
  });

  // IAM Role for API Gateway to write logs
  const apiLogRole = new Role(scope, "ReonicApiGatewayCloudWatchRole", {
    assumedBy: new ServicePrincipal("apigateway.amazonaws.com"),
  });

  apiLogRole.addManagedPolicy(
    ManagedPolicy.fromAwsManagedPolicyName(
      "service-role/AmazonAPIGatewayPushToCloudWatchLogs",
    ),
  );

  return apiLogGroup;
}

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
