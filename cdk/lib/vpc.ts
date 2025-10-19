import { Construct } from "constructs";
import {
  InterfaceVpcEndpointAwsService,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";

/**
 * Create an AWS VPC and relevant resources.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @returns The created AWS VPC.
 */
export default function CreateVpc(scope: Construct): Vpc {
  const vpc = new Vpc(scope, "ReonicVPC", {
    maxAzs: 2,
    natGateways: 0, // we don't actually use public subnets.
    subnetConfiguration: [
      {
        // These public subnets are created as require by the tasks in REAME.md,
        // but are not actually used by any AWS resources.
        cidrMask: 24,
        name: "Public",
        subnetType: SubnetType.PUBLIC,
      },
      {
        // These private subnets are meant to be used with apps (e.g. Lambda).
        cidrMask: 24,
        name: "PrivateApp", // will be used to filter subnets in ./lambda.ts
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
      {
        // These private subnets are meant to be used with databases (e.g. RDS).
        cidrMask: 28,
        name: "PrivateDB", // will be used to filter subnets in ./rds.ts
        subnetType: SubnetType.PRIVATE_ISOLATED,
      },
    ],
  });

  // Add VPC Endpoint for Secrets Manager.
  vpc.addInterfaceEndpoint("SecretsManagerEndpoint", {
    service: InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
  });

  return vpc;
}
