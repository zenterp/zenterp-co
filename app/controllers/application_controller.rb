class ApplicationController < ActionController::Base
  protect_from_forgery
  
  def index 
  	@videos = MONGO.collection('videos').find().to_a
  end
end
