class ApplicationController < ActionController::Base
  protect_from_forgery

  def index 
  	@youtube_videos = YoutubeVideo.where("youtube_videos.image_path <> ''")
    Graphite.send_stat('timings.login', 0.5)    
  end 

  def contact
  end
end
