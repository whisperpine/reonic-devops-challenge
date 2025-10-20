# --------------------
# npm
# --------------------

# [npm] install npm packages
install:
  npm install && cd app && npm install && cd ../cdk && npm install

# --------------------
# docker
# --------------------

# [docker] docker compose up --build -d
up:
  docker compose up --build -d

# [docker] docker compose down
down:
  docker compose down

# --------------------
# cdk
# --------------------

# [cdk] synthesize cloudformation templates
synth:
  cd cdk && cdk synth ReonicDevOpsStackDev

# [cdk] deploy cloudformation stack
deploy:
  cd cdk && cdk deploy --require-approval never ReonicDevOpsStackDev

# [cdk] destroy cloudformation stack
destroy:
  cd cdk && cdk destroy ReonicDevOpsStackDev

# [cdk] bootstrap cdk
bootstrap:
  cd cdk && cdk bootstrap

# --------------------
# test
# --------------------

# [test] run testing scripts for local deployment
test:
  sh ./scripts/test-local.sh
