class User
  def initialize(opts)
    @email = opts[:email]
  end 

  def authorizations
    AuthCallback.where(email: @email)
  end 
end 