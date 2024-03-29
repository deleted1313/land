$(function() {
  var o = $(".menu");
  $(window).on("scroll", function() {
    var n = $(this).scrollTop();
    sections.each(function() {
      var t = $(this).offset().top - nav_height,
        i = t + $(this).outerHeight();
      t <= n &&
        n <= i &&
        (o.find("a").removeClass("active"),
        $(this).addClass("active"),
        o.find('a[href="#' + $(this).attr("id") + '"]').addClass("active"));
    });
  }),
    o.find("a").on("click", function() {
      var t = $(this).attr("href");
      return $("html, body").animate({ scrollTop: $(t).offset().top }, 500), !1;
    }),
    $(window).load(function() {
      $(".wrap_moments").masonry({
        itemSelector: ".item_moments",
        singleMode: !1,
        isResizable: !0,
        isAnimated: !0,
        animationOptions: { queue: !1, duration: 500 }
      });
    });
});
