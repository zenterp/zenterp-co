class ApplicationController < ActionController::Base
  protect_from_forgery

  def index 
  	@youtube_videos = YoutubeVideo.find([7,1,2,11])
  end 

  def contact
  end
end
