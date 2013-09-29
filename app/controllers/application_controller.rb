class ApplicationController < ActionController::Base
  protect_from_forgery

  def index 
  	@videos = videos.find().to_a
  end

  def search
    @videos = videos.find({
      "youtube_title" => {
        "$regex" => "#{params[:query]}",
        "$options" => "i"
      }
    })
    render template: 'application/index'
  end

  def videos
    @mongo_videos_collection ||= MONGO.collection('videos')
  end
end
