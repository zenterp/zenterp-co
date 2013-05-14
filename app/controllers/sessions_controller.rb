class SessionsController < ApplicationController
	def create
		AuthCallback.create({
			provider: params[:provider],
			email: auth_hash["info"]["email"],
			data: auth_hash.to_json
		})

		redirect_to root_path, notice: "You authenticated with #{params[:provider]}"
	end 

	def auth_hash
		request.env['omniauth.auth']
	end 
end 