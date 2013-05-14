class AuthCallback < ActiveRecord::Base
  attr_accessible :data, :email, :provider
end
