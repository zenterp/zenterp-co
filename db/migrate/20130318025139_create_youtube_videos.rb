class CreateYoutubeVideos < ActiveRecord::Migration
  def change
    create_table :youtube_videos do |t|
      t.string :title
      t.string :url
      t.string :image_path
      t.text :description

      t.timestamps
    end
  end
end
