import { Stack, type StackProps } from "aws-cdk-lib";
import type { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import type { Vpc } from "aws-cdk-lib/aws-ec2";
import type { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import type { DatabaseInstance } from "aws-cdk-lib/aws-rds";
import type { Secret } from "aws-cdk-lib/aws-secretsmanager";
import type { Construct } from "constructs";
import createApiGateway from "./api-gateway";
import { createDashboard } from "./cloudwatch";
import createLambda from "./lambda";
import createRds from "./rds";
import createResourceGroup from "./resource-group";
import createSecret from "./secrets-manager";
import { defaultTags, ENVIRONMENTS } from "./tags";
import createVpc from "./vpc";

/** The entrypoint for setting up an AWS Cloudformation Stack. */
export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    // Merged tags.
    const mergedTags: {
      [x: string]: string;
    } = {
      ...defaultTags,
      ...props?.tags,
    };

    // Make sure the "environment" tag is a valid value.
    const env: string = mergedTags.environment;
    if (!ENVIRONMENTS.includes(env)) {
      throw new Error(
        `Invalid tag "environment" of value: ${env}.\n` +
          `Expected one of: ${ENVIRONMENTS.join(", ")}.`,
      );
    }

    // Initialize the base class.
    super(scope, id, { ...props, tags: mergedTags });

    // Create an AWS Resource Group.
    createResourceGroup(this, mergedTags, env);

    // Create an AWS VPC and relevant resources.
    const vpc: Vpc = createVpc(this);

    // Create an AWS Secret managed by Secrets Manager.
    const secret: Secret = createSecret(this);

    // Create an AWS RDS Postgres instance.
    const db: DatabaseInstance = createRds(this, vpc, secret, env);

    // Create an AWS Lambda Function.
    const lambda: DockerImageFunction = createLambda(this, vpc, secret, db);

    // Create an AWS API Gateway.
    const api: LambdaRestApi = createApiGateway(this, lambda);

    // Create a Cloudwatch Dashboard.
    createDashboard(this, lambda, api);
  }
}
