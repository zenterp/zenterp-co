class YoutubeVideo < ActiveRecord::Base
  attr_accessible :description, :image_path, :title, :url
end
