WORKING_DIR = $(shell pwd)
VERSION=$(shell node -pe "require('./package.json').version")
IMAGE_ID=kuklatech/gmfi
REPOSITORY_HOSTNAME=registry.gitlab.com

build: ## Build image (version from package.json)
	@( read -p "Did you bump service version? ($(IMAGE_ID):$(VERSION)) [y/N]" sure && case "$$sure" in [yY]) true;; *) false;; esac )
	- docker build --platform=linux/amd64 -t $(REPOSITORY_HOSTNAME)/$(IMAGE_ID):$(VERSION) ./

build-local: ## Build image to be ran locally
	@( read -p "Did you bump service version? ($(IMAGE_ID):$(VERSION)) [y/N]" sure && case "$$sure" in [yY]) true;; *) false;; esac )
	- docker build -t $(IMAGE_ID):$(VERSION) ./

run: ## RUN built image LOCALLY
	- docker run -p 8888:8888 -v $(WORKING_DIR)/credentials:/app/credentials --env-file .env -it $(IMAGE_ID):$(VERSION)

bash: ## Run BASH in built image
	- docker run -p 8888:8888 -v $(WORKING_DIR)/credentials:/app/credentials --env-file .env -it $(IMAGE_ID):$(VERSION) bash

push: ## PUSH CURRENT version (also marked as 'latest') to DockerHub repo
	- docker tag $(REPOSITORY_HOSTNAME)/$(IMAGE_ID):$(VERSION) $(REPOSITORY_HOSTNAME)/$(IMAGE_ID):latest
	- docker push $(REPOSITORY_HOSTNAME)/$(IMAGE_ID):$(VERSION)
	- docker push $(REPOSITORY_HOSTNAME)/$(IMAGE_ID):latest

.PHONY: build run bash push

# -----------------------------------------------------------
# -----  EVERYTHING BELOW THIS LINE IS NOT IMPORTANT --------
# -----       (Makefile helpers and decoration)      --------
# -----------------------------------------------------------
#
# Decorative Scripts - Do not edit below this line unless you know what it is

.PHONY: help
.DEFAULT_GOAL := help

NO_COLOR    = \033[0m
INDENT      = -30s
BIGINDENT   = -50s
GREEN       = \033[36m
BLUE        = \033[34m
DIM         = \033[2m
help:
	@printf '\n\n$(DIM)Commands:$(NO_COLOR)\n'
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN) % $(BIGINDENT)$(NO_COLOR) - %s\n", $$1, $$2}'
