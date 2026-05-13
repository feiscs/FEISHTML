# frozen_string_literal: true

require "shopify_api"

module FormaShopify
  class AdminClient
    PRODUCTS_QUERY = <<~GRAPHQL
      query FormaProducts($first: Int!, $after: String) {
        products(first: $first, after: $after, sortKey: CREATED_AT, reverse: true) {
          pageInfo { hasNextPage endCursor }
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
      requested_limit = Integer(first)
      page_size = [requested_limit, 250].min
      after = nil
      products = []

      while products.length < requested_limit
        response = @client.query(
          query: PRODUCTS_QUERY,
          variables: { first: [page_size, requested_limit - products.length].min, after: after }
        )
        connection = response.body.fetch("data").fetch("products")
        products.concat(connection.fetch("edges").map { |edge| edge.fetch("node") })

        page_info = connection.fetch("pageInfo")
        break unless page_info.fetch("hasNextPage") && page_info.fetch("endCursor")

        after = page_info.fetch("endCursor")
      end

      products
    end
  end
end
