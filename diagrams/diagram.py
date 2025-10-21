# pyright: reportMissingTypeStubs = false
# pyright: reportUnusedExpression = false

from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import Lambda
from diagrams.aws.network import APIGateway, PublicSubnet, PrivateSubnet
from diagrams.aws.database import RDSPostgresqlInstance
from diagrams.aws.security import SecretsManager
from diagrams.aws.management import Cloudwatch
# from diagrams.aws.network import InternetGateway


with Diagram(
    "Reonic DevOps Challenge AWS Architecture",
    show=False,
    filename="reonic-aws-architecture",
    direction="TB",
):
    api = APIGateway("API Gateway\nReonicApiGateway")
    secret = SecretsManager("Secrets Manager\nReonicRDSSecret")

    with Cluster("VPC (us-east-1)"):
        # igw = InternetGateway("Internet Gateway (not used)")

        # Availability Zone 1.
        with Cluster("AZ1", direction="LR"):
            public1 = PublicSubnet("Subnet\nPublic (not used)")
            private_app1 = PrivateSubnet("Subnet\nPrivateApp")
            private_db1 = PrivateSubnet("Subnet\nPrivateDB")

        # Availability Zone 2.
        with Cluster("AZ2", direction="LR"):
            public2 = PublicSubnet("Subnet\nPublic (not used)")
            private_app2 = PrivateSubnet("Subnet\nPrivateApp")
            private_db2 = PrivateSubnet("Subnet\nPrivateDB")

        # Lambda Function.
        lambda_fn = Lambda("Lambda Function\nReonicLambda")
        api >> Edge(reverse=True) >> lambda_fn
        lambda_fn << Edge(style="dashed") << secret

        # RDS Postgres instance.
        rds = RDSPostgresqlInstance("RDS Instance\nReonicPostgres")
        rds << Edge(style="dashed") << secret
        lambda_fn >> Edge(reverse=True) >> rds

        # Attach Lambda to PrivateApp subnets
        lambda_fn - private_app1
        lambda_fn - private_app2

        # Attach RDS to DB subnets.
        rds - private_db1
        rds - private_db2

        # # Public subnets connect to IGW.
        # public1 >> igw
        # public2 >> igw

    # CloudWatch logging for both Lambda and RDS.
    logs = Cloudwatch("CloudWatch")
    lambda_fn - Edge(style="dashed") - logs
    rds - Edge(style="dashed") - logs
    api - Edge(style="dashed") - logs
