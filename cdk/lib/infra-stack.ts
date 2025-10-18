import * as cdk from "aws-cdk-lib";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import CreateECR from "./ecr";
import CreateResourceGroup from "./resource-group";

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

    CreateResourceGroup(this);
    CreateECR(this);
  }
}
