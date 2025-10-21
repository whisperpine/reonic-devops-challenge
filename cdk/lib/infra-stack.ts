// Import third party modules.
import { Stack, type StackProps } from "aws-cdk-lib";
import type { Construct } from "constructs";
import type { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import type { Vpc } from "aws-cdk-lib/aws-ec2";
import type { Secret } from "aws-cdk-lib/aws-secretsmanager";
import type { DatabaseInstance } from "aws-cdk-lib/aws-rds";
import type { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";

// Import local modules in this repository.
import { defaultTags, ENVIRONMENTS } from "./tags";
import { CreateDashboard } from "./cloudwatch";
import CreateResourceGroup from "./resource-group";
import CreateLambda from "./lambda";
import CreateAPIGateway from "./api-gateway";
import CreateSecret from "./secrets-manager";
import CreateRds from "./rds";
import CreateVpc from "./vpc";

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
    CreateResourceGroup(this, mergedTags, env);

    // Create an AWS VPC and relevant resources.
    const vpc: Vpc = CreateVpc(this);

    // Create an AWS Secret managed by Secrets Manager.
    const secret: Secret = CreateSecret(this);

    // Create an AWS RDS Postgres instance.
    const db: DatabaseInstance = CreateRds(this, vpc, secret, env);

    // Create an AWS Lambda Function.
    const lambda: DockerImageFunction = CreateLambda(this, vpc, secret, db);

    // Create an AWS API Gateway.
    const api: LambdaRestApi = CreateAPIGateway(this, lambda);

    // Create a Cloudwatch Dashboard.
    CreateDashboard(this, lambda, api);
  }
}
