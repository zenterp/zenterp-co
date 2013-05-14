class CreateAuthCallbacks < ActiveRecord::Migration
  def change
    create_table :auth_callbacks do |t|
      t.string :provider
      t.string :email
      t.text :data

      t.timestamps
    end
  end
end
