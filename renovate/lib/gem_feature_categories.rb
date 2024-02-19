#!/usr/bin/env ruby
# frozen_string_literal: true

require 'rubocop'
require 'json'

class GemWithFeatureCategory
  extend RuboCop::AST::NodePattern::Macros
  include RuboCop::AST::Traversal

  def_node_matcher :feature_category_value, <<~PATTERN
    (send nil? :gem
      (str $_)
      ...
      (hash <(pair (sym :feature_category) (sym $_)) ...>)
      ...
    )
  PATTERN

  def run(source)
    ast = RuboCop::AST::ProcessedSource.new(source, RUBY_VERSION[/\d+\.\d+/].to_f).ast

    walk(ast)
  end

  def on_send(node)
    gem_name, feature_category = feature_category_value(node)

    gem[gem_name] = { feature_category: feature_category } if gem_name
  end

  def gem
    @gem ||= {}
  end
end

main = GemWithFeatureCategory.new
main.run($stdin.read)
puts JSON.pretty_generate(main.gem)
