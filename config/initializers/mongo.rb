mongo_uri = "mongodb://stevenzeiler:#{ENV['MONGOHQ_PASSWORD']}@paulo.mongohq.com:10027/zenterp"
MONGO =  Mongo::MongoClient.from_uri(mongo_uri).db("zenterp")