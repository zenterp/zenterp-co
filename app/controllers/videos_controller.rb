class VideosController < ApplicationController
  def index 
    @video = YoutubeVideo.first
    render layout: "foundation"
  end 

  def show
    @video = YoutubeVideo.find(params[:id]) 
    render "videos/video", layout: false
  end   
end 
