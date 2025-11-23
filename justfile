# list all available subcommands
_default:
  @just --list

# --------------------
# npm
# --------------------

# install npm packages
[group("npm")]
install:
  npm install && cd app && npm install && cd ../cdk && npm install

# --------------------
# docker
# --------------------

# docker compose up --build -d
[group("docker")]
up:
  docker compose up --build -d

# docker compose down
[group("docker")]
down:
  docker compose down

# --------------------
# cdk
# --------------------

# synthesize cloudformation templates
[group("cdk")]
synth:
  cd cdk && cdk synth ReonicDevOpsStackDev

# deploy cloudformation stack
[group("cdk")]
deploy:
  cd cdk && cdk deploy --require-approval never ReonicDevOpsStackDev

# destroy cloudformation stack
[group("cdk")]
destroy:
  cd cdk && cdk destroy ReonicDevOpsStackDev

# bootstrap cdk
[group("cdk")]
bootstrap:
  cd cdk && cdk bootstrap

# --------------------
# test
# --------------------

# run testing scripts for local deployment
[group("test")]
test:
  sh ./scripts/test-local.sh
