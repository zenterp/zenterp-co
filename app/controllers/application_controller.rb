class ApplicationController < ActionController::Base
  protect_from_forgery

  def index 
  	@youtube_videos = YoutubeVideo.first(4)
    Graphite.send_stat('timings.login', 0.5)    
  end 

  def contact
  end
end
