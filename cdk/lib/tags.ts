/**
 * The value for the key "repository"
 */
const REPOSITORY: string = "reonic-devops-challenge";
/**
 * The value for the key "managed-by"
 */
const MANAGED_BY: string = "cdk";
/**
 * The value for the key "owner"
 */
const OWNER: string = "Yusong Lai";
/**
 * The value for the key "environment", in dev.
 */
export const ENVIRONMENT_DEV: string = "dev";
/**
 * The value for the key "environment", in prod.
 */
export const ENVIRONMENT_PROD: string = "prod";

// Stack.tags
interface Tags {
  [key: string]: string;
}

/**
 * The default tags for all AWS resources.
 */
export const defaultTags: Tags = {
  "repository": REPOSITORY,
  "managed-by": MANAGED_BY,
  "owner": OWNER,
};

// CfnGroup.TagFilterProperty
interface TagFilterProperty {
  readonly key?: string;
  readonly values?: Array<string>;
}

/**
 * Convert `Stack.tags` to `CfnGroup.TagFilterProperty`.
 * @param tags Tags that are used to initialize `InfraStack`.
 * @returns The value which can be assigned to tagFilters in a `CfnGroup`.
 */
export function getTagFilters(tags: Tags): TagFilterProperty[] {
  let result: TagFilterProperty[] = [];
  for (const key in tags) {
    result.push({ key, values: [tags[key]] });
  }
  return result;
}
