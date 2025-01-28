all:config

config:.pre-commit-config.yaml
	@echo "installing precommit hooks..."
	pip install pre-commit
	pre-commit install
	pre-commit run --all-files
	@echo "precommit hooks have been installed!"