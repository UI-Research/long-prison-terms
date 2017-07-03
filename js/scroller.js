
/**
 * scroller - handles the details
 * of figuring out which section
 * the user is currently scrolled
 * to.
 *
 */
function scroller() {
  var windowHeight;
  var container = d3.select('body');
  // event dispatcher
  var dispatch = d3.dispatch("active", "progress", "resized");

  // d3 selection of all the
  // text sections that will
  // be scrolled through
  var sections = null;

  // array that will hold the
  // y coordinate of each section
  // that is scrolled through
  var sectionPositions = [];
  var currentIndex = -1;
  // y coordinate of
  var containerStart = 0;

  /**
   * scroll - constructor function.
   * Sets up scroller to monitor
   * scrolling of els selection.
   *
   * @param els - d3 selection of
   *  elements that will be scrolled
   *  through by user.
   */
  function scroll(els) {
    sections = els;

    // when window is scrolled call
    // position. When it is resized
    // call resize.
    d3.select(window)
      .on("scroll.scroller", position)
      .on("resize.scroller", resize);

    // manually call resize
    // initially to setup
    // scroller.
    resize();

    // hack to get position
    // to be called once for
    // the scroll position on
    // load.
    d3.timer(function() {
      position();
      return true;
    });
  }

  /**
   * resize - called initially and
   * also when page is resized.
   * Resets the sectionPositions
   *
   */
  function resize() {
    // sectionPositions will be each sections
    // starting position relative to the top
    // of the first section.
    sectionPositions = [];
    var startPos;
    sections.each(function(d,i) {
      var top = this.getBoundingClientRect().top;
      if(i === 0) {
        startPos = top;
      }
      sectionPositions.push(top - startPos);
    });
    containerStart = container.node().getBoundingClientRect().top + window.pageYOffset;
    dispatch.resized(this)
  }

  /**
   * position - get current users position.
   * if user has scrolled to new section,
   * dispatch active event with new section
   * index.
   *
   */
  function position() {
    var off = (IS_MOBILE) ? 150 : 10;
    var pos = window.pageYOffset - off - containerStart;
    var sectionIndex = d3.bisect(sectionPositions, pos);
    sectionIndex = Math.min(sections.size() - 1, sectionIndex);

    if (currentIndex !== sectionIndex) {
      dispatch.active(sectionIndex);
      currentIndex = sectionIndex;
    }

    var prevIndex = Math.max(sectionIndex - 1, 0);
    var prevTop = sectionPositions[prevIndex];
    var progress = (pos - prevTop) / (sectionPositions[sectionIndex] - prevTop);
    dispatch.progress(currentIndex, progress);

    if(IS_PHONE()){

    }
    else if(IS_TABLET()){
      if(ACTIVE_CONTAINER() == "animation"){
        d3.select("#lineChart")
          .style("left", (window.innerWidth - 180) + "px")
        d3.select("#breadCrumb")
          .style("left", "0px")
        d3.select("#legend")
          .style("margin-left", "53px")
        d3.select("#animationTick0")
          .style("margin-left", "53px")
        d3.select("#sections")
          .style("left", ((window.innerWidth - 400)*.5) + "px") 
        d3.select("#animationTick100")
          .style("left", ((window.innerWidth - 205 + 33) + "px")) 
        d3.select("#animationTick50")
          .style("left", ((window.innerWidth - 205)*.5 + 53) + "px")
        d3.select("#animationLabel")
          .style("left", ((window.innerWidth - 205)*.5 + 28) + "px")
  // #animationLabel{
  //   left: calc(50% - 105px)
  // }
  // #animationTick0{
  //   left: 23px;
  // }
  // #animationTick50{
  //   left: calc(50% - 78.5px);
  // }
  // #animationTick100{
  //   left: calc(50% + 110px);
  // }

 
      }

    }else if(IS_MOBILE()){

      var gutter = visGutter(false);
      var bGutter = visGutter(true)
      d3.selectAll(".animationComponents")
        .style("margin-left", bGutter + "px")
      d3.select("#lineChart")
        .style("left", (320 + gutter) + "px")
      d3.select("#breadCrumb")
        .style("left", (-21 + gutter) + "px")
      d3.select("#sections")
        .style("left", ((window.innerWidth - 400)*.5) + "px") 
      d3.select("#animationTick100")
        .style("left", null) 
      d3.select("#animationTick50")
        .style("left", null)
      d3.select("#animationLabel")
        .style("left", null)
    }else{
      var gutter = visGutter(false);
      var bGutter = visGutter(true)
      d3.selectAll(".animationComponents")
        .style("margin-left", bGutter + "px")
      d3.select("#lineChart")
        .style("left", (370 + gutter) + "px")
      d3.select("#breadCrumb")
        .style("left", (810 + gutter) + "px")
      d3.select("#sections")
        .style("left", (850 + gutter) + "px")
      d3.select("#animationTick100")
        .style("left", null) 
      d3.select("#animationTick50")
        .style("left", null)
      d3.select("#animationLabel")
        .style("left", null)

    }
    d3.select("#featureContainer")
      .style("height", function(){
        return d3.select("#graphic").node().getBoundingClientRect().height + "px"
      })
  }

  /**
   * container - get/set the parent element
   * of the sections. Useful for if the
   * scrolling doesn't start at the very top
   * of the page.
   *
   * @param value - the new container value
   */
  scroll.container = function(value) {
    if (arguments.length === 0) {
      return container;
    }
    container = value;
    return scroll;
  };

  // allows us to bind to scroller events
  // which will interally be handled by
  // the dispatcher.
  d3.rebind(scroll, dispatch, "on");

  return scroll;
}
