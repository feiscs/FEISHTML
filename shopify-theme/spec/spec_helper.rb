# frozen_string_literal: true

require 'rubygems'
require 'bundler'
require 'nokogiri'
require 'htmlentities'
require 'pry'
require 'json'
require 'pathname'

Dir[File.join(__dir__, 'helpers', '*.rb')].sort.each { |helper| require helper }

THEME_ROOT = Pathname.new(__dir__).join('..').expand_path
