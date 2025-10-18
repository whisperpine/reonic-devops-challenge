import { RemovalPolicy } from "aws-cdk-lib";
import { CfnOutput } from "aws-cdk-lib";
import { Construct } from "constructs";
import { Repository } from "aws-cdk-lib/aws-ecr";

/**
 * Create an AWS ECR repository.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @returns The created AWS ECR repository.
 */
export default function CreateECR(scope: Construct, env: string): Repository {
  // ECR repository.
  const repo = new Repository(scope, "ReonicECRRepository", {
    repositoryName: `reonic-ecr-${env}`, // Human-readable name
    imageScanOnPush: true, // Auto-scan for vulnerabilities
    removalPolicy: RemovalPolicy.DESTROY, // Clean up on destroy
    emptyOnDelete: true, // Delete images on stack destroy
  });

  // Output: repository uri (for docker push).
  new CfnOutput(scope, "ECRRepositoryUri", {
    value: repo.repositoryUri,
    description: "Push images here!",
  });

  return repo;
}
