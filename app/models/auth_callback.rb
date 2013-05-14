class AuthCallback < ActiveRecord::Base
  attr_accessible :data, :email, :provider

  validates_uniqueness_of :email, scope: [:provider]
end
