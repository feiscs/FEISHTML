# frozen_string_literal: true

require "shopify_api"

module FormaShopify
  module Context
    module_function

    def setup!
      ShopifyAPI::Context.setup(
        api_key: env!("SHOPIFY_API_KEY"),
        api_secret_key: env!("SHOPIFY_API_SECRET"),
        host_name: env!("SHOPIFY_SHOP_DOMAIN"),
        scope: ENV.fetch("SHOPIFY_SCOPES", "read_products"),
        is_embedded: false,
        is_private: false,
        api_version: ENV.fetch("SHOPIFY_API_VERSION", "2026-04"),
        rest_disabled: true
      )
    end

    def env!(key)
      value = ENV[key]
      return value unless value.nil? || value.strip.empty?

      raise KeyError, "Missing required environment variable: #{key}"
    end
  end
end
