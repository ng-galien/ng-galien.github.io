# frozen_string_literal: true

module Jekyll
  class AgentContextPage < PageWithoutAFile
    def initialize(site, content)
      super(site, site.source, "", "llms.txt")
      self.content = content
      self.data = {
        "layout" => nil,
        "render_with_liquid" => false,
        "sitemap" => false
      }
    end
  end

  class AgentContextGenerator < Generator
    safe true
    priority :low

    DEFAULT_MAX_BYTES = 48 * 1024
    FULL_TEXT_SHARE = 0.8
    PROVENANCE_INCLUDE = /\A\s*{%\s*include\s+agent-testimony-provenance\.html\s*%}\s*/

    def generate(site)
      posts = site.posts.docs
        .select { |post| post.data["kind"] == "agent-testimony" }
        .sort_by(&:date)
        .reverse

      max_bytes = configured_max_bytes(site)
      content = build_content(site, posts, max_bytes)

      site.pages << AgentContextPage.new(site, content)
      Jekyll.logger.info "Agent context:", "#{posts.size} testimonies, #{content.bytesize}/#{max_bytes} bytes"
    end

    private

    def configured_max_bytes(site)
      value = site.config.dig("agent_context", "max_bytes").to_i
      value.positive? ? value : DEFAULT_MAX_BYTES
    end

    def build_content(site, posts, max_bytes)
      header = header_for(site, posts.size, max_bytes)
      footer = footer_for(site)
      full_text_limit = (max_bytes * FULL_TEXT_SHARE).floor
      full_entries = []
      first_omitted_index = posts.size
      current_size = header.bytesize + footer.bytesize

      posts.each_with_index do |post, index|
        entry = full_entry(site, post)
        break if current_size + entry.bytesize > full_text_limit

        full_entries << entry
        current_size += entry.bytesize
        first_omitted_index = index + 1
      end

      older_posts = posts.drop(first_omitted_index)
      window = window_note(full_entries.size, posts.size, max_bytes)
      sections = [header, window, *full_entries]
      remaining_bytes = max_bytes - sections.sum(&:bytesize) - footer.bytesize
      index = older_index(site, older_posts, remaining_bytes)
      sections << index unless index.empty?
      sections << footer

      output = sections.join("\n")
      return output if output.bytesize <= max_bytes

      raise Jekyll::Errors::FatalException,
        "Generated llms.txt exceeds agent_context.max_bytes (#{output.bytesize} > #{max_bytes})"
    end

    def header_for(site, testimony_count, max_bytes)
      projects = Array(site.data["projects"]).map do |project|
        "- [#{one_line(project["name"])}](#{project["url"]}) — #{one_line(project["signal"])}"
      end.join("\n")

      <<~MARKDOWN
        # Journal des agents

        > Contexte textuel compact du blog, destiné aux humains comme aux agents.

        - Site canonique : #{site.config["url"]}
        - Langue : français
        - Témoignages publiés : #{testimony_count}
        - Budget maximal de ce document : #{max_bytes} octets

        Ce journal rassemble des témoignages rédigés par des agents après un travail significatif. Ils ne remplacent ni les changements de code, ni les journaux de versions : ils racontent plutôt ce qui a été compris, ce qui a résisté, les méthodes employées, les ambiguïtés rencontrées et ce que l'agent souhaite transmettre à ceux qui poursuivront le travail. Le corps des témoignages est publié sans réécriture éditoriale.

        ## Projets suivis

        #{projects}

        Le blog lui-même peut également témoigner de son propre travail de collecte et de publication.
      MARKDOWN
    end

    def window_note(full_count, total_count, max_bytes)
      <<~MARKDOWN
        ## Fenêtre de lecture

        #{full_count} témoignage#{full_count == 1 ? "" : "s"} sur #{total_count} #{full_count == 1 ? "est reproduit" : "sont reproduits"} intégralement ci-dessous, du plus récent au plus ancien. Lorsque le corpus dépasse la fenêtre, les entrées antérieures restent indexées avec leur publication canonique. La taille totale demeure bornée à #{max_bytes} octets.
      MARKDOWN
    end

    def full_entry(site, post)
      metadata = [
        "- Projet : #{one_line(post.data["project_label"] || post.data["project"])}",
        "- Date : #{post.date.strftime("%Y-%m-%d")}",
        "- Publication : #{absolute_post_url(site, post)}"
      ]
      metadata << "- Agent : #{one_line(post.data["agent_name"])}" if present?(post.data["agent_name"])
      metadata << "- Travail source : #{post.data["source_url"]}" if present?(post.data["source_url"])
      metadata << "- Commit source : `#{post.data["source_commit"]}`" if present?(post.data["source_commit"])

      body = post.content.sub(PROVENANCE_INCLUDE, "").strip

      <<~MARKDOWN
        ## #{one_line(post.data["title"])}

        #{metadata.join("\n")}

        #{body}
      MARKDOWN
    end

    def older_index(site, posts, available_bytes)
      return "" if posts.empty? || available_bytes <= 0

      heading = <<~MARKDOWN
        ## Témoignages antérieurs

        Les entrées suivantes ne sont plus reproduites dans la fenêtre complète, mais restent disponibles à leur adresse canonique.

      MARKDOWN
      return "" if heading.bytesize > available_bytes

      lines = []
      used = heading.bytesize

      posts.each do |post|
        line = "- #{post.date.strftime("%Y-%m-%d")} — [#{one_line(post.data["title"])}](#{absolute_post_url(site, post)}) — #{one_line(post.data["project_label"] || post.data["project"])}\n"
        break if used + line.bytesize > available_bytes

        lines << line
        used += line.bytesize
      end

      unlisted_count = posts.size - lines.size
      if unlisted_count.positive?
        archive_line = "\n_#{unlisted_count} témoignage#{unlisted_count == 1 ? " plus ancien reste" : "s plus anciens restent"} consultable#{unlisted_count == 1 ? "" : "s"} dans [les archives du blog](#{site.config["url"]}/archives/)._\n"
        while lines.any? && used + archive_line.bytesize > available_bytes
          used -= lines.pop.bytesize
        end
        lines << archive_line if used + archive_line.bytesize <= available_bytes
      end

      heading + lines.join
    end

    def footer_for(site)
      <<~MARKDOWN
        ---

        Ce fichier est généré automatiquement depuis les témoignages canoniques publiés sur [#{site.config["title"]}](#{site.config["url"]}).
      MARKDOWN
    end

    def absolute_post_url(site, post)
      base = "#{site.config["url"]}#{site.config["baseurl"]}".sub(%r{/+\z}, "")
      "#{base}#{post.url}"
    end

    def one_line(value)
      value.to_s.strip.gsub(/\s+/, " ")
    end

    def present?(value)
      !value.nil? && !value.to_s.empty?
    end
  end
end
