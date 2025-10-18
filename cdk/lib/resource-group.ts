import { Construct } from "constructs";
import { CfnGroup } from "aws-cdk-lib/aws-resourcegroups";

/**
 * Create an AWS Resource Group.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @returns The created AWS Resource Group.
 */
export default function CreateResourceGroup(scope: Construct): CfnGroup {
  // Resource group.
  const group = new CfnGroup(scope, "ReonicResourceGroup", {
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

  return group;
}
