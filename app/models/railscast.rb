class Railscast
  include HTTParty
  
  def self.top_100
    get("http://zenterp-api.herokuapp.com/starred_railscasts.json").parsed_response
  end 
end   