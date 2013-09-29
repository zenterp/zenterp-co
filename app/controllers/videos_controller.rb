class VideosController < ApplicationController
  def index 
    @video = YoutubeVideo.first
    render layout: "foundation"
  end 

  def show
  end   
end 
