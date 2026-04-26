# frozen_string_literal: true

source "https://rubygems.org"

gem "jekyll-theme-chirpy", "~> 7.4", ">= 7.4.1"

# Multilingual support (FR/EN). Generates one site per language; non-default
# languages live under `/<lang>/...` and hreflang is exposed via the
# `I18n_Headers` Liquid tag (used in `_includes/metadata-hook.html`).
gem "jekyll-polyglot", "~> 1.12"

gem "html-proofer", "~> 5.0", group: :test

platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.2.0", :platforms => [:mingw, :x64_mingw, :mswin]
