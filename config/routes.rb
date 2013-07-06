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

  get 'training/railscasts', to: 'training/resources#railscasts'
  get 'training/videos',    to: 'training/resources#my_videos'
  get 'training/shows',    to: 'training/resources#shows'
  get 'training/newsletters',    to: 'training/resources#newsletters'
  get 'training//blog',    to: 'training/resources#my_blog'
  get 'training/books',    to: 'training/resources#books'
  get 'training/books',    to: 'training/resources#books'
  get 'training/codeschool', to: 'training/resources#codeschool'
  get 'training/peepcode', to: 'training/resources#peepcode'
  get 'training/css-tricks', to: 'training/resources#css_tricks'

  get 'training', to: 'training/resources#newsletters'
  get 'resources', to: 'training/resources#my_videos'
end
