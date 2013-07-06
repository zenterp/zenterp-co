class GoogleBook
  include HTTParty

  class << self
    def get_shelf(name)
      @shelves ||= {} 
      url = "http://zenterp-api.herokuapp.com/bookshelves/#{name}.json"
      @shelves[name] ||= get(url).parsed_response      
    end 

    def union(shelf1, shelf2)
      condition_ids = get_shelf(shelf2).map { |s| s['title'] }
      get_shelf(shelf1).select { |v| condition_ids.include?(v['title']) }  
    end 
  end 
end 

