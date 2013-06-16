class ResearchController < ApplicationController
  def index
  
    if params[:q].present?
      @youtube_videos = YoutubeVideo.where("title like ?", "%#{params[:q]}%") | 
                        YoutubeVideo.where("description like ?", "%#{params[:q]}%")
    else 
      @youtube_videos = YoutubeVideo.all
    end 
  end 
end