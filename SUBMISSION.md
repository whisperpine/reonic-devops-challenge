# SUBMISSION

It's an engaging challenge that I enjoyed tackling!

I've accomplished all the objectives in README.md with good practices.

Let's cut to the chase - Here's my solution.

## AWS Downtime

Coincidently, I encountered a downtime of AWS itself:
[Multiple services were disrupted in us-east-1 on October 20](https://health.aws.amazon.com/health/status?eventID=arn:aws:health:us-east-1::event/MULTIPLE_SERVICES/AWS_MULTIPLE_SERVICES_OPERATIONAL_ISSUE/AWS_MULTIPLE_SERVICES_OPERATIONAL_ISSUE_BA540_514A652BE1A).
During this downtime, the part of the cloud infra were not working, including
the deployed `ReonicDevOpsStackDev` responding with "internal server error" and
new CDK deployment kept failing (see [this github actions execution](https://github.com/whisperpine/reonic-devops-challenge/actions/runs/18644788324/job/53149877855)).

The downtime of a cloud provider rarely happens (but is still possible like this
one). We can make a trade-off here: In mission critical services, *multi-cloud
deployment* is the ultimate solution with the cost of operational overhead; But
if we're allowed to tolerate these sennarios, it would be easier for cloud setup.
In common cases, we can adopt the *multi-regional* solution with a single cloud
provider, this mitigates both concerns: SLA (service level agreement) and
operational overhead.

P.S. Luckily the outage did't end up with troubles for my take-home challenge,
because I accomplished most of the work in weekends, day before this disaster.
Therefore I feel calm at the moment of writing this document.
