
# 🧪 Reonic DevOps Take-Home Challenge

Welcome to the Reonic DevOps & Platform Engineering challenge! This test simulates the kind of platform automation and infrastructure-as-code work you'd be doing with us.

---

## 🌱 Context

We provide you with a demo Lambda application packaged as a Docker container. Your job is to:
1. Add AWS CDK infrastructure to support it
2. Update the GitHub Actions workflow to automate deployment

---

## 🎯 Your Objectives

### 1. **Infrastructure-as-Code (CDK)**
Implement an AWS CDK stack in TypeScript that includes:
- ✅ An API Gateway endpoint triggering a Lambda (based on the Dockerfile)
- ✅ A VPC with public and private subnets (min. 2 AZs)
- ✅ A PostgreSQL RDS instance in the private subnets
- ✅ Secrets Manager secret for database credentials
- ✅ IAM permissions and least-privilege configuration
- ✅ Logging via CloudWatch Logs

> **Bonus:** Add monitoring/alarms.

### 2. **CI/CD Pipeline (GitHub Actions)**
Update the provided GitHub Actions workflow to:
- ✅ Build and push the Lambda container to ECR
- ✅ Deploy the CDK stack on push to `main`
- ✅ Use GitHub Actions secrets for AWS credentials

---

## 🧰 Project Structure
```
reonic-devops-challenge/
├── app/                              # Application code
│   ├── src/
│   │   └── handler.ts                # Lambda function handler
│   ├── Dockerfile                    # Lambda Docker image
│   ├── package.json                  # App dependencies
│   └── tsconfig.json                 # App TypeScript config
├── cdk/                              # Infrastructure as Code
│   ├── bin/
│   │   └── app.ts                    # CDK app entry point
│   ├── lib/
│   │   └── infra-stack.ts            # CDK infrastructure stack
│   ├── package.json                  # CDK dependencies
│   ├── cdk.json                      # CDK configuration
│   └── tsconfig.json                 # CDK TypeScript config
├── .github/workflows/deploy.yml      # GitHub Actions workflow
├── package.json                      # Root workspace config
└── README.md                         # You're here
```

---

## 🚀 Getting Started

### 🔧 Install dependencies
```bash
npm run install:all
```

### 🧱 Compile TypeScript
```bash
npm run build
```

> This will build both the application and CDK stack. Be sure to run `npm run build` before building the Docker image.

### 🧪 Run locally
You can run the Lambda handler locally using Docker if needed:
```bash
npm run test:local
```

Or manually:
```bash
cd app
npm run build
docker build -t local-lambda .
docker run -p 9000:8080 local-lambda
```

### 🧪 Test Locally via Docker Compose
The application now includes PostgreSQL integration. To test locally:

```bash
# Start PostgreSQL and Lambda services
npm run test:compose

# In another terminal, test the Lambda
npm run test:lambda

# Or use the automated test script
./test-local.sh
```

The Lambda function will:
- Connect to PostgreSQL using environment variables
- Create a `test_records` table if it doesn't exist
- Insert a new row with a timestamped message
- Return the total count of records in the table

For detailed PostgreSQL setup instructions, see [POSTGRES_SETUP.md](./POSTGRES_SETUP.md).

### 🌐 Deploy
```bash
npm run deploy
```

> Make sure you have configured your AWS CLI with valid credentials, or use environment variables.

---

## 📬 Submission Guidelines

- Push your changes to a public GitHub repository or share access to a private one with @hanshuebner.
- Include a brief summary in a `SUBMISSION.md` file with:
    - How you approached the task
    - Any assumptions or trade-offs you made
    - How to use the solution and test it
    - (Optional) What you would improve with more time

---

## 🧠 Evaluation Criteria
| Area | What We’re Looking For |
|------|------------------------|
| ✅ Infrastructure Design | Clean, modular CDK with good defaults |
| 🔐 Security | Reasonable IAM, use of Secrets Manager, VPC isolation |
| ⚙️ Automation | Functional and understandable GitHub Actions workflow |
| 📚 Documentation | Clear setup instructions and reasoning |
| 🚀 Bonus | Monitoring, rollback strategies, multi-env support |

---

## ⏱️ Time Expectation
We suggest no more than **5 hours** of work. Focus on clarity and quality over quantity.

We look forward to seeing what you build! ✨
