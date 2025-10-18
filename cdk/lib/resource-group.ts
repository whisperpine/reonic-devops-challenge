import { Construct } from "constructs";
import { CfnGroup } from "aws-cdk-lib/aws-resourcegroups";
import { getTagFilters } from "./tags";

/**
 * Create an AWS Resource Group.
 * @param scope Pass "this" in the constructor of InfraStack.
 * @param tags The same tags used to initialize InfraStack.
 * @returns The created AWS Resource Group.
 */
export default function CreateResourceGroup(
  scope: Construct,
  tags: { [key: string]: string },
): CfnGroup {
  return new CfnGroup(scope, "ReonicResourceGroup", {
    name: "reonic-devops-resource-group",
    description: "All MyApp Dev resources",
    resourceQuery: {
      type: "TAG_FILTERS_1_0",
      query: { tagFilters: getTagFilters(tags) },
    },
  });
}
