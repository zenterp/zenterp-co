class SessionsController < ApplicationController
	def create
		render text: auth_hash
	end 

	def auth_hash
		request.env['omniauth.auth']
	end 
end 