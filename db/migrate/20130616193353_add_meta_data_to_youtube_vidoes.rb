class AddMetaDataToYoutubeVidoes < ActiveRecord::Migration
  def change
    add_column :youtube_videos, :meta_title, :string
    add_column :youtube_videos, :meta_description, :text
    add_column :youtube_videos, :meta_keywords, :text
    add_column :youtube_videos, :training, :boolean
    add_index :youtube_videos, :training
  end
end
