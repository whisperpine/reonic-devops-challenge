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
  cd cdk && cdk deploy ReonicDevOpsStackDev

# [cdk] destroy cloudformation stack
destroy:
  cd cdk && cdk destroy ReonicDevOpsStackDev

# [cdk] bootstrap cdk
bootstrap:
  cd cdk && cdk bootstrap
