/** The value for the key "repository". */
const REPOSITORY = "reonic-devops-challenge";
/** The value for the key "managed-by". */
const MANAGED_BY = "cdk";
/** The value for the key "owner". */
const OWNER = "Yusong Lai";
/** The value for the key "environment", in dev. */
export const ENVIRONMENT_DEV = "dev";
/** The value for the key "environment", in prod. */
export const ENVIRONMENT_PROD = "prod";
/** All possible values for the "environment" tag. */
export const ENVIRONMENTS: string[] = [ENVIRONMENT_PROD, ENVIRONMENT_DEV];

// The same as `Stack.tags`.
interface Tags {
  [key: string]: string;
}

/** The default tags for all AWS resources. */
export const defaultTags: Tags = {
  repository: REPOSITORY,
  "managed-by": MANAGED_BY,
  owner: OWNER,
};

// The same as `CfnGroup.TagFilterProperty`.
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
  const result: TagFilterProperty[] = [];
  for (const key in tags) {
    result.push({ key, values: [tags[key]] });
  }
  return result;
}
