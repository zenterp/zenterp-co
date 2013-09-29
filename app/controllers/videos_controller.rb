class VideosController < ApplicationController
  def index 
    @video = YoutubeVideo.first
    render layout: "foundation"
  end 

  def show
    @video = MONGO.collection('videos').find(url_stub: params[:slug]).to_a[0]
  end   
end 
