class RubyWeekly
  include HTTParty

  def self.all
    get("http://zenterp-api.herokuapp.com/ruby_weekly.json").parsed_response
  end 
end   
