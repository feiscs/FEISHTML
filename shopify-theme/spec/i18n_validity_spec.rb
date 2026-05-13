# frozen_string_literal: true

require 'spec_helper'

describe 'Theme i18n' do
  liquid_files = Dir[THEME_ROOT.join('**/*.liquid')]
  locale_files = Dir[THEME_ROOT.join('locales/*.json')]

  file_keys = liquid_files.flat_map { |path| I18nHelper.match_tags(path) }.compact.sort.uniq
  locale_keys = locale_files.each_with_object({}) do |path, result|
    result[File.basename(path)] = I18nHelper.flatten_locale_keys(JSON.parse(File.read(path))).sort
  end

  it 'has locale files' do
    expect(locale_files).not_to be_empty
  end

  it 'defines every translation key used by Liquid files' do
    missing_by_locale = locale_keys.transform_values { |keys| file_keys - keys }.reject { |_locale, missing| missing.empty? }
    expect(missing_by_locale).to eq({})
  end

  it 'does not contain completely unused locale keys' do
    unused_by_locale = locale_keys.transform_values { |keys| keys - file_keys }.reject { |_locale, unused| unused.empty? }
    expect(unused_by_locale).to eq({})
  end
end
