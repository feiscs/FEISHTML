# frozen_string_literal: true

require "shopify_api"

module FormaShopify
  class AdminClient
    PRODUCTS_QUERY = <<~GRAPHQL
      query FormaProducts($first: Int!) {
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges {
            node {
              id
              title
              handle
              productType
              status
              createdAt
              onlineStoreUrl
              featuredImage { url altText }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    sku
                    price
                    compareAtPrice
                    selectedOptions { name value }
                  }
                }
              }
            }
          }
        }
      }
    GRAPHQL

    def initialize(shop: ENV.fetch("SHOPIFY_SHOP_DOMAIN"), access_token: ENV.fetch("SHOPIFY_ADMIN_ACCESS_TOKEN"))
      @session = ShopifyAPI::Auth::Session.new(shop: shop, access_token: access_token)
      @client = ShopifyAPI::Clients::Graphql::Admin.new(session: @session)
    end

    def products(first: 10)
      response = @client.query(query: PRODUCTS_QUERY, variables: { first: first })
      response.body.fetch("data").fetch("products").fetch("edges").map { |edge| edge.fetch("node") }
    end
  end
end
