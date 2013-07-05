class HTML5Weekly
  include HTTParty

  class << self
    def all
      get('http://zenterp-api.herokuapp.com/html5_weekly.json').parsed_response
    end 
  end 
end 