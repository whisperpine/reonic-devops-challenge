import * as cdk from "aws-cdk-lib";
import { CfnOutput, Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Repository } from "aws-cdk-lib/aws-ecr";

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

    // Create ecr repository.
    const repo = new Repository(this, "ECRRepository", {
      repositoryName: "reonic-devops-challenge", // Human-readable name
      imageScanOnPush: true, // Auto-scan for vulnerabilities
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Clean up on destroy
      emptyOnDelete: true, // Delete images on stack destroy
    });

    // Output: repository uri (for docker push)
    new CfnOutput(this, "ECRRepositoryUri", { // ECR URI?
      value: repo.repositoryUri,
      description: "Push images here!",
    });
  }
}
