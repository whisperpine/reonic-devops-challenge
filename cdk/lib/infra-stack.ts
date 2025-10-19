import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DockerImageFunction } from "aws-cdk-lib/aws-lambda";
import { Vpc } from "aws-cdk-lib/aws-ec2";

import { defaultTags, ENVIRONMENTS } from "./tags";
import CreateResourceGroup from "./resource-group";
import CreateLambda from "./lambda";
import CreateAPIGateway from "./api-gateway";
import CreateVpc from "./vpc";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    // Merged tags.
    const mergedTags: {
      [x: string]: string;
    } = {
      ...defaultTags,
      ...props?.tags,
    };

    // Make sure the "environment" tag is a valid value.
    const env: string = mergedTags["environment"];
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

    // Create an AWS Lambda Function.
    const lambda: DockerImageFunction = CreateLambda(this, vpc);

    // Create an AWS API Gateway.
    CreateAPIGateway(this, lambda);
  }
}
