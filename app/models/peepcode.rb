class Peepcode
  include HTTParty

  def self.all
    get("http://zenterp-api.herokuapp.com/peepcode_screencasts.json").parsed_response
  end 
end   
