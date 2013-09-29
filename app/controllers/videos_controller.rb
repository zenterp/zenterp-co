class VideosController < ApplicationController
  def show
    @latest = latest
    @popular = popular
    @video = videos.find(url_stub: params[:slug]).to_a[0]
  end   

private

  def latest
    videos.find(_id: { '$in' => [
        BSON::ObjectId('52475965084e66cfdc0001a3'),
        BSON::ObjectId('52475a53084e66bad900024b'),
        BSON::ObjectId('52475b820c5ef48dd000016c')
      ]
    })
  end

  def popular
    videos.find(_id: { '$in' => [
        BSON::ObjectId('52475b820c5ef48dd000016c'),
        BSON::ObjectId('52475d0ed5cfd091230001e1'),
        BSON::ObjectId('52475a74b546d6d8a00001c1')
      ]
    })
  end

  def videos
    @mongo_videos_collection ||= MONGO.collection('videos')
  end
end 
