# frozen_string_literal: true

require "shopify_api"

module FormaShopify
  class StorefrontClient
    PRODUCTS_QUERY = <<~GRAPHQL
      query FormaStorefrontProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              featuredImage { url altText }
              priceRange {
                minVariantPrice { amount currencyCode }
              }
            }
          }
        }
      }
    GRAPHQL

    def initialize(
      shop_url: ENV.fetch("SHOPIFY_SHOP_DOMAIN"),
      public_token: ENV["SHOPIFY_STOREFRONT_PUBLIC_TOKEN"],
      private_token: ENV["SHOPIFY_STOREFRONT_PRIVATE_TOKEN"]
    )
      token_options = private_token.to_s.empty? ? { public_token: public_token } : { private_token: private_token }
      @client = ShopifyAPI::Clients::Graphql::Storefront.new(shop_url, **token_options)
    end

    def products(first: 10)
      response = @client.query(query: PRODUCTS_QUERY, variables: { first: first })
      response.body.fetch("data").fetch("products").fetch("edges").map { |edge| edge.fetch("node") }
    end
  end
end
