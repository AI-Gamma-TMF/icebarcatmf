# GIT TASKS
pull: ## Pull the current branch
	@git pull origin $$(git branch | grep \* | cut -d ' ' -f2) --rebase

push: ## Push the current branch
	@git push origin $$(git branch | grep \* | cut -d ' ' -f2) --force-with-lease

rebase-with-prod:
	@echo "======================== Check Out to Prod ==================="
	@git checkout production
	@echo "======================== Pull From Prod ======================"
	@make pull
	@echo "======================== Check Out to Staging ==================="
	@git checkout staging
	@echo "======================== Pull From Staging ======================"
	@make pull
	@echo "======================== Rebase from Prod ================"
	@git pull origin production -r
	@echo "======================== Pushing on Staging ===================="
	@make push
	@echo "======================== Check Out to develop =================="
	@git checkout develop
	@echo "======================== Pull From Develop ====================="
	@make pull
	@echo "======================== Rebase From Staging ==================="
	@git pull origin staging -r
	@echo "======================== Pushing on develop ===================="
	@make push
	@echo "======================== Rebase SuccessFul ====================="

rebase-with-staging:
	@echo "======================== Check Out to Staging==================="
	@git checkout staging
	@echo "======================== Pull From Staging======================"
	@make pull
	@echo "======================== Check Out to develop =================="
	@git checkout develop
	@echo "======================== Pull From Develop ====================="
	@make pull
	@echo "======================== Rebase From Staging ==================="
	@git pull origin staging -r
	@echo "======================== Pushing on develop ===================="
	@make push
	@echo "======================== Rebase SuccessFul ====================="
