#!/usr/bin/env ruby
# frozen_string_literal: true

require "bundler/setup"
require "dotenv/load"
require_relative "../config/shopify_context"
require_relative "../lib/forma_shopify/admin_client"

FormaShopify::Context.setup!
client = FormaShopify::AdminClient.new

client.products(first: Integer(ENV.fetch("SHOPIFY_PRODUCT_LIMIT", "5"))).each do |product|
  puts "#{product.fetch("title")} — #{product.fetch("id")}" 
end
