import { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { Cors, LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

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
  return new LambdaRestApi(scope, "ReonicApiGateway", {
    handler: lambdaFunction,
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
    },
  });
}
