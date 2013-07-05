require 'httparty'
require 'nokogiri'
require 'json'
require 'active_support'


class Link < Struct.new(:text, :url)
  def to_json
    { text: self.text, url: self.url }
  end 
end 

class HTML5Weekly
  include HTTParty

  ARCHIVE_URL = 'http://html5weekly.com/archive'
  LINK_SELECTOR = '.item a'

  class << self

    def get_page(n)
      get("#{ARCHIVE_URL}/#{n}.html").parsed_response
    end

    def parse_links(html)
      doc = Nokogiri::HTML(html)
      if (links = doc.css('a')).length > 0 
        links = doc.css('a').collect { |a| 
          Link.new(a.text, a.attributes['href'].value).to_json
        }
      else
        []
      end 
    end 

    def download_all(n = 150)
      newsletters = {}
      (1..n).each do |i|
        newsletters[i] = {
          url: "#{ARCHIVE_URL}/#{i}.html",
          links: parse_links(get_page(i))
        }
      end 
      newsletters
    end 
 
  end 
end 

page = ARGV[0].to_i
jj HTML5Weekly.download_all(95)