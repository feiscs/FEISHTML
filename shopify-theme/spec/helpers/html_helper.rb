# frozen_string_literal: true

module HTMLValidator
  HTML5_TAGS = [
    'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo',
    'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup',
    'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset',
    'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header',
    'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li',
    'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol',
    'optgroup', 'option', 'output', 'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt',
    'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strong', 'style',
    'sub', 'summary', 'sup', 'svg', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th',
    'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video', 'wbr'
  ].freeze

  LIQUID_TAG_PATTERN = /\{[%{].*?[%}]\}/m

  module_function

  def html_fragment_for(path)
    source = File.read(path)
    without_liquid = HTMLEntities.new.decode(source.gsub(LIQUID_TAG_PATTERN, ''))
    Nokogiri::HTML5.fragment(without_liquid)
  rescue NameError
    Nokogiri::HTML.fragment(without_liquid)
  end

  def invalid_html_tags(path)
    html_fragment_for(path).css('*').map(&:name).uniq.reject { |tag| HTML5_TAGS.include?(tag) }
  end
end
