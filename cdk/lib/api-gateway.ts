import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import {
  AccessLogFormat,
  Cors,
  LambdaRestApi,
  LogGroupLogDestination,
  MethodLoggingLevel,
} from "aws-cdk-lib/aws-apigateway";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import type { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import type { Construct } from "constructs";

/**
 * Create an AWS API Gateway.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @param lambdaFunction The Lambda Function triggered by this API Gateway.
 * @returns The created AWS API Gateway.
 */
export default function createApiGateway(
  scope: Construct,
  lambdaFunction: DockerImageFunction,
): LambdaRestApi {
  // Create an AWS Cloudwatch Log Group.
  const logGroup: LogGroup = createCloudwatchLogGroup(scope);

  // Create an AWS API Gateway.
  const api = new LambdaRestApi(scope, "ReonicApiGateway", {
    handler: lambdaFunction,
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
    },
    deployOptions: {
      stageName: "dev",
      // Enable Execution Logging.
      accessLogDestination: new LogGroupLogDestination(logGroup),
      accessLogFormat: AccessLogFormat.jsonWithStandardFields({
        httpMethod: true,
        ip: true,
        protocol: true,
        requestTime: true,
        resourcePath: true,
        responseLength: true,
        status: true,
        caller: false,
        user: false,
      }),
      loggingLevel: MethodLoggingLevel.INFO, // default is OFF.
      dataTraceEnabled: true, // logs full request/response
    },
  });

  // Output the API Gateway's URL.
  new CfnOutput(scope, "ApiGatewayURL", {
    value: api.url,
    description: "The API Gateway's URL. Click it for end-to-end test!",
  });

  return api;
}

/**
 * Create an AWS Cloudwatch Log Group for API Gateway.
 * @returns The created AWS Cloudwatch Log Group.
 */
function createCloudwatchLogGroup(scope: Construct): LogGroup {
  // Log Group.
  const apiLogGroup = new LogGroup(scope, "ReonicApiGatewayLogGroup", {
    // logGroupName: "/aws/apigateway/ReonicApiGatewayLogGroup",
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
