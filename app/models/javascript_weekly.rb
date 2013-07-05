class JavascriptWeekly
  include HTTParty

  class << self
    def all
      get('http://zenterp-api.herokuapp.com/javascript_weekly.json').parsed_response
    end 
  end 
end 