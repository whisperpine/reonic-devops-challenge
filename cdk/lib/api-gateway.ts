import { CfnOutput } from "aws-cdk-lib";
import type { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import type { Construct } from "constructs";
import {
  AccessLogFormat,
  Cors,
  LambdaRestApi,
  LogGroupLogDestination,
  MethodLoggingLevel,
} from "aws-cdk-lib/aws-apigateway";
import { LogGroup } from "aws-cdk-lib/aws-logs";

import CreateCloudwatchLogGroup from "./cloudwatch";

/**
 * Create an AWS API Gateway.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @param lambdaFunction The Lambda Function triggered by this API Gateway.
 * @returns The created AWS API Gateway.
 */
export default function CreateAPIGateway(
  scope: Construct,
  lambdaFunction: DockerImageFunction,
): LambdaRestApi {
  // Create an AWS Cloudwatch Log Group.
  const logGroup: LogGroup = CreateCloudwatchLogGroup(
    scope,
    "ReonicApiGatewayLogGroup",
  );

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
