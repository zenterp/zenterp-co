class SessionsController < ApplicationController
	def create
		render json: {
			provider: params[:provider],
			auth: auth_hash.to_json
		}

		AuthCallback.create({
			provider: params[:provider],
			email: auth_hash["info"]["email"],
			data: auth_hash.to_json
		})
	end 

	def auth_hash
		request.env['omniauth.auth']
	end 
end 