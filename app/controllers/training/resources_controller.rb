class Training::ResourcesController < ApplicationController
  def railscasts
    @railscasts = HTTParty.get("http://zenterp-api.herokuapp.com/starred_railscasts.json").parsed_response
  end 

  def my_videos
    @videos = YoutubeVideo.all
  end 
end 