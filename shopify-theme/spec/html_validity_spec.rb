# frozen_string_literal: true

require 'spec_helper'

describe 'Theme HTML' do
  Dir[THEME_ROOT.join('{layout,snippets,templates}/**/*.liquid')].each do |path|
    it "uses known HTML tags in #{Pathname.new(path).relative_path_from(THEME_ROOT)}" do
      expect(HTMLValidator.invalid_html_tags(path)).to eq([])
    end
  end
end
