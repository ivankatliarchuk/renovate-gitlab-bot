terraform {
  required_providers {
    gitlab = {
      source  = "gitlabhq/gitlab"
      version = "15.9.0"
    }
  }

  backend "http" {}
}

provider "gitlab" {
  token = var.gitlab_renovate_bot_token
}

variable "gitlab_renovate_bot_token" {
  description = "GitLab Token for the gitlab-renovate-forks group bot"
  type        = string
  sensitive   = true
}

variable "projects" {
  description = "A list of projects to manage with renovate. The projects must be specified with their path with namespace, e.g. `gitlab-org/gitlab`."
  type        = list(string)
}

data "gitlab_group" "forks" {
  full_path = "gitlab-renovate-forks"
}

data "gitlab_project" "upstream" {
  for_each = toset(var.projects)

  path_with_namespace = each.key
}

resource "gitlab_project" "forks" {
  # Create a forked project for every project configuration
  for_each = data.gitlab_project.upstream

  # Fork from upstream project
  forked_from_project_id = each.value.id

  # Specify some project name and parent group
  name             = each.value.name
  description      = each.value.description
  namespace_id     = data.gitlab_group.forks.id
  visibility_level = "public"

  # Pull Mirroring settings
  import_url                          = each.value.http_url_to_repo
  mirror                              = true
  mirror_trigger_builds               = false
  mirror_overwrites_diverged_branches = true
  only_mirror_protected_branches      = true
}

output "renovate_forks" {
  value = [
    for k, v in gitlab_project.forks : { "id" = v.id, "name" = v.name, "path_with_namespace" = v.path_with_namespace, "web_url" : v.web_url }
  ]
}

