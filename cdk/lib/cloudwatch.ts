import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import type { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import type { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import type { Construct } from "constructs";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";

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

