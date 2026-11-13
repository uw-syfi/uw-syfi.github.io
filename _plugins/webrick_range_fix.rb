# Dev-server-only fix: WEBrick's FileHandler#not_modified? treats a Range
# request's If-Range header the same as If-None-Match, replying 304 (no body)
# instead of 206 with the requested bytes. Browsers need ranged requests to
# play MP4s under `jekyll serve`. Production (GitHub Pages) is unaffected.
# See https://github.com/jekyll/jekyll/issues/9812
require "webrick"

module WebrickRangeFix
  def not_modified?(req, res, mtime, etag)
    req["Range"] ? false : super
  end
end

WEBrick::HTTPServlet::DefaultFileHandler.prepend(WebrickRangeFix)
