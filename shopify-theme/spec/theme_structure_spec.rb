# frozen_string_literal: true

require 'pathname'

ROOT = Pathname.new(__dir__).join('..')
REQUIRED_FILES = %w[
  Gemfile
  assets/forma-theme.css.liquid
  assets/forma-theme.js
  assets/timber.js.liquid
  assets/ajax-cart.js.liquid
  assets/gift-card.scss.liquid
  layout/theme.liquid
  snippets/site-header.liquid
  snippets/site-footer.liquid
  snippets/product-card.liquid
  snippets/breadcrumb.liquid
  snippets/collection-sorting.liquid
  snippets/onboarding-empty-collection.liquid
  snippets/onboarding-featured-collections.liquid
  snippets/comment.liquid
  snippets/oldIE-js.liquid
  snippets/ajax-cart-template.liquid
  templates/404.liquid
  templates/article.liquid
  templates/blog.liquid
  templates/cart.liquid
  templates/collection.liquid
  templates/collection.list.liquid
  templates/index.liquid
  templates/list-collections.liquid
  templates/page.contact.liquid
  templates/page.liquid
  templates/product.liquid
  templates/search.liquid
  templates/gift_card.liquid
  templates/customers/account.liquid
  templates/customers/addresses.liquid
  templates/customers/login.liquid
  templates/customers/order.liquid
  templates/customers/register.liquid
  config.yml
  config/settings_schema.json
  config/settings_data.json
].freeze

missing = REQUIRED_FILES.reject { |file| ROOT.join(file).file? && ROOT.join(file).read.strip.length.positive? }
abort "Missing or empty theme files:\n#{missing.join("\n")}" if missing.any?

puts "Verified #{REQUIRED_FILES.length} Shopify theme files."
