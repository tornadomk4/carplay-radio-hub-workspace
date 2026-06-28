$urls = @(
  "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&media_type=all&q=carplay%20radio&search_type=keyword_unordered",
  "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=US&media_type=all&q=android%20auto%20head%20unit&search_type=keyword_unordered",
  "https://ads.tiktok.com/creative/creativeCenter",
  "https://www.tiktok.com/search?q=carplay%20radio%20install",
  "https://www.tiktok.com/search?q=android%20auto%20head%20unit",
  "https://www.instagram.com/explore/search/keyword/?q=carplay%20radio",
  "https://www.youtube.com/results?search_query=carplay+radio+install+shorts",
  "https://www.amazon.com/s?k=7+inch+double+din+carplay+radio+backup+camera"
)

foreach ($url in $urls) {
  Start-Process $url
}
