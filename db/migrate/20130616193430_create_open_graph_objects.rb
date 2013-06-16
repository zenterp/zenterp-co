class CreateOpenGraphObjects < ActiveRecord::Migration
  def change
    create_table :open_graph_objects do |t|
      t.integer :video_id
      t.text :data

      t.timestamps
    end
  end
end
