class ResearchController < ApplicationController
  def index
  	@youtube_videos = YoutubeVideo.all
  end 
end