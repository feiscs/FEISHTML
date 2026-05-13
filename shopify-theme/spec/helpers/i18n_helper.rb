# frozen_string_literal: true

EXCLUDED_KEYWORDS = ['date_formats'].freeze

module I18nHelper
  module_function

  def match_tags(path)
    File.open(path).read.scan(/\{\{\s*(?:'|")([a-z0-9._]+?)(?:'|")(?:\s*\|\s*t)/).flatten.map do |key|
      next if include_excluded_keywords?(key)

      truncate_plural_key(key.split('.'))
    end.compact.uniq
  end

  def include_excluded_keywords?(key)
    EXCLUDED_KEYWORDS.any? { |keyword| key.include?(keyword) }
  end

  def truncate_plural_key(parts)
    return parts.join('.') unless parts.last&.match?(/^(one|other|many|few|zero|two)$/)

    parts[0...-1].join('.')
  end

  def flatten_locale_keys(hash, prefix = nil)
    hash.each_with_object([]) do |(key, value), keys|
      next if include_excluded_keywords?(key)

      full_key = [prefix, key].compact.join('.')
      if value.is_a?(Hash)
        keys.concat(flatten_locale_keys(value, full_key))
      else
        keys << truncate_plural_key(full_key.split('.'))
      end
    end.uniq
  end
end
