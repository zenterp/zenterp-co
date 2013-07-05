class TrainingController < ApplicationController
  def resources
    @railscasts = HTTParty.get("http://zenterp-api.herokuapp.com/starred_railscasts.json").parsed_response

  end 
end 