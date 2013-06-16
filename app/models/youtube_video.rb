class YoutubeVideo < ActiveRecord::Base
  attr_accessible :description, :image_path, :title, :url, :meta_title, 
                  :meta_description, :meta_keywords, :training
end
