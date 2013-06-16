class Admin::VideosController < ApplicationController
  def index
    @videos = YoutubeVideo.all

    respond_to do |f| 
      f.json { render json: @videos.to_json } 
      f.html { render layout: "admin" } 
    end   
  end 


  def update
    @video = YoutubeVideo.find(params[:id])
  end 
end
