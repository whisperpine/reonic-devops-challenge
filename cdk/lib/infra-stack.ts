import * as cdk from "aws-cdk-lib";
import { CfnOutput, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { CfnGroup } from "aws-cdk-lib/aws-resourcegroups";

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
      tags: {
        "Repository": "reonic-devops-challenge",
        "Owner": "Yusong Lai",
        "CreatedBy": "CDK",
        ...props?.tags,
      },
    });

    // ECR repository.
    const repo = new Repository(this, "ReonicECRRepository", {
      repositoryName: "reonic-devops-ecr", // Human-readable name
      imageScanOnPush: true, // Auto-scan for vulnerabilities
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Clean up on destroy
      emptyOnDelete: true, // Delete images on stack destroy
    });

    // Output: repository uri (for docker push)
    new CfnOutput(this, "ECRRepositoryUri", { // ECR URI?
      value: repo.repositoryUri,
      description: "Push images here!",
    });

    // Resource group.
    new CfnGroup(this, "ReonicResourceGroup", {
      name: "reonic-devops-resource-group",
      description: "All MyApp Dev resources",
      resourceQuery: {
        type: "TAG_FILTERS_1_0",
        query: {
          tagFilters: [
            { key: "Repository", values: ["reonic-devops-challenge"] },
            { key: "Owner", values: ["Yusong Lai"] },
            { key: "CreatedBy", values: ["CDK"] },
            // { key: "Environment", values: ["Dev, Prod"] },
          ],
        },
      },
    });
  }
}
