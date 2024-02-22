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
  type = list(object({
    path      = string
    fork_path = optional(string)
  }))
}

data "gitlab_group" "forks" {
  full_path = "gitlab-renovate-forks"
}

data "gitlab_project" "upstream" {
  for_each = { for project in var.projects : project.path => project }

  path_with_namespace = each.key
}

resource "gitlab_project" "forks" {
  # Create a forked project for every project configuration
  for_each = { for project in var.projects : project.path => project }

  # Fork from upstream project
  forked_from_project_id = data.gitlab_project.upstream[each.key].id

  # Specify some project name and parent group
  name             = data.gitlab_project.upstream[each.key].name
  path             = coalesce(each.value.fork_path, data.gitlab_project.upstream[each.key].path)
  description      = data.gitlab_project.upstream[each.key].description
  namespace_id     = data.gitlab_group.forks.id
  visibility_level = "public"

  # Settings from the upstream project that matter for the fork
  ci_config_path = data.gitlab_project.upstream[each.key].ci_config_path

  # Pull Mirroring settings
  import_url                          = data.gitlab_project.upstream[each.key].http_url_to_repo
  mirror                              = true
  mirror_trigger_builds               = false
  mirror_overwrites_diverged_branches = true
  only_mirror_protected_branches      = true

  lifecycle {
    prevent_destroy = true
  }
}

output "renovate_forks" {
  value = [
    for k, v in gitlab_project.forks : { "id" = v.id, "name" = v.name, "path_with_namespace" = v.path_with_namespace, "web_url" : v.web_url }
  ]
}

