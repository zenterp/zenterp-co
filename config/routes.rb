Zenterp::Application.routes.draw do
  devise_for :users
  devise_for :admins

  root to: 'application#index'
  get 'contact' => 'application#contact'
  get 'team', to: 'team#index'

  resources :research, only: :index
  resources :videos, only: [:index, :show]

  mount RailsAdmin::Engine => '/console', as: 'admin'

  get '/oauth2callback', to: 'sessions#create'
  get 'admin/videos', to: 'admin/videos#index'

  get 'training/resources/railscasts', to: 'training/resources#railscasts'
  get 'training/resources/stevenzeiler/videos',    to: 'training/resources#my_videos'

  get 'training', to: 'training/resources#my_videos'
  get 'resources', to: 'training/resources#my_videos'

end
