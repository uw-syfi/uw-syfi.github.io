(function () {
  var AREAS = ["efficient_ai", "flexible_ai", "resilient_ai"];
  var VIEWBOX_WIDTH = 600;
  var VIEWBOX_HEIGHT = 540;
  var GRID_STEP = 2;
  var OVERLAP_PADDING = 3;
  var EXACT_CELL_PENALTY = 10000000;
  var TARGET_BOX_PENALTY = 200000;
  var UNTAGGED_CORNER_PENALTY = 5000;
  var OVERLAP_AREA_PENALTY = 500000;

  function areaKey(areas) {
    return areas.slice().sort().join("|");
  }

  function parseAreas(value) {
    return (value || "").split(/\s+/).filter(Boolean).sort();
  }

  function pointInCircle(circle, x, y) {
    var dx = x - circle.cx;
    var dy = y - circle.cy;
    return Math.sqrt(dx * dx + dy * dy) <= circle.r;
  }

  function getCircles(diagram) {
    var circles = {};
    diagram.querySelectorAll(".research-areas-circle").forEach(function (circle) {
      AREAS.forEach(function (area) {
        var areaName = area.replace("_ai", "");
        if (circle.classList.contains("research-areas-circle--" + areaName)) {
          circles[area] = {
            cx: Number(circle.getAttribute("cx")),
            cy: Number(circle.getAttribute("cy")),
            r: Number(circle.getAttribute("r"))
          };
        }
      });
    });
    return circles;
  }

  function isInsideAreas(circles, areas, x, y) {
    return areas.every(function (area) {
      return pointInCircle(circles[area], x, y);
    });
  }

  function untaggedInsideCount(circles, targetAreas, x, y) {
    return AREAS.reduce(function (count, area) {
      if (targetAreas.indexOf(area) !== -1) {
        return count;
      }
      return count + (pointInCircle(circles[area], x, y) ? 1 : 0);
    }, 0);
  }

  function getBoxCorners(box) {
    return [
      [box.x, box.y],
      [box.x + box.width, box.y],
      [box.x, box.y + box.height],
      [box.x + box.width, box.y + box.height]
    ];
  }

  function boxInsideTargetAreas(circles, areas, box) {
    return getBoxCorners(box).every(function (point) {
      return isInsideAreas(circles, areas, point[0], point[1]);
    });
  }

  function untaggedCornerCount(circles, areas, box) {
    return getBoxCorners(box).reduce(function (count, point) {
      return count + untaggedInsideCount(circles, areas, point[0], point[1]);
    }, 0);
  }

  function overlapArea(a, b) {
    var xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
    var yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
    return xOverlap * yOverlap;
  }

  function paddedBox(box) {
    return {
      x: box.x - OVERLAP_PADDING,
      y: box.y - OVERLAP_PADDING,
      width: box.width + OVERLAP_PADDING * 2,
      height: box.height + OVERLAP_PADDING * 2
    };
  }

  function totalOverlapArea(box, placedBoxes) {
    var padded = paddedBox(box);
    return placedBoxes.reduce(function (total, placed) {
      return total + overlapArea(padded, paddedBox(placed));
    }, 0);
  }

  function centroidForCell(circles, areas, exact) {
    var sumX = 0;
    var sumY = 0;
    var count = 0;

    for (var y = 0; y <= VIEWBOX_HEIGHT; y += GRID_STEP) {
      for (var x = 0; x <= VIEWBOX_WIDTH; x += GRID_STEP) {
        if (!isInsideAreas(circles, areas, x, y)) {
          continue;
        }
        if (exact && untaggedInsideCount(circles, areas, x, y) > 0) {
          continue;
        }
        sumX += x;
        sumY += y;
        count += 1;
      }
    }

    if (count === 0 && exact) {
      return centroidForCell(circles, areas, false);
    }

    if (count === 0) {
      return { x: VIEWBOX_WIDTH / 2, y: VIEWBOX_HEIGHT / 2, count: 1 };
    }

    return { x: sumX / count, y: sumY / count, count: count };
  }

  function getAnchors(circles, items) {
    var anchors = {};
    items.forEach(function (item) {
      var key = areaKey(item.areas);
      if (!anchors[key]) {
        anchors[key] = centroidForCell(circles, item.areas, true);
      }
    });
    return anchors;
  }

  function candidateScore(circles, item, anchor, placedBoxes, box, options) {
    var centerX = box.x + box.width / 2;
    var centerY = box.y + box.height / 2;
    if (!isInsideAreas(circles, item.areas, centerX, centerY)) {
      return null;
    }

    var untaggedCenterCount = untaggedInsideCount(circles, item.areas, centerX, centerY);
    if (options.requireExact && untaggedCenterCount > 0) {
      return null;
    }

    var overlap = totalOverlapArea(box, placedBoxes);
    if (overlap > 0 && !options.allowOverlap) {
      return null;
    }

    var distanceX = centerX - anchor.x;
    var distanceY = centerY - anchor.y;
    var score = distanceX * distanceX + distanceY * distanceY;
    score += untaggedCenterCount * EXACT_CELL_PENALTY;
    score += boxInsideTargetAreas(circles, item.areas, box) ? 0 : TARGET_BOX_PENALTY;
    score += untaggedCornerCount(circles, item.areas, box) * UNTAGGED_CORNER_PENALTY;
    score += overlap * OVERLAP_AREA_PENALTY;

    return score;
  }

  function bestCandidate(circles, item, anchor, placedBoxes, options) {
    var best = null;
    var maxX = Math.max(0, VIEWBOX_WIDTH - item.width);
    var maxY = Math.max(0, VIEWBOX_HEIGHT - item.height);

    for (var y = 0; y <= maxY; y += GRID_STEP) {
      for (var x = 0; x <= maxX; x += GRID_STEP) {
        var box = { x: x, y: y, width: item.width, height: item.height };
        var score = candidateScore(circles, item, anchor, placedBoxes, box, options);
        if (score === null) {
          continue;
        }
        if (!best || score < best.score) {
          best = { x: x, y: y, width: item.width, height: item.height, score: score };
        }
      }
    }

    return best;
  }

  function sortItemsForPlacement(items, anchors) {
    var counts = items.reduce(function (all, item) {
      var key = areaKey(item.areas);
      all[key] = (all[key] || 0) + 1;
      return all;
    }, {});

    return items.slice().sort(function (a, b) {
      var aKey = areaKey(a.areas);
      var bKey = areaKey(b.areas);
      var aSpace = anchors[aKey].count / counts[aKey];
      var bSpace = anchors[bKey].count / counts[bKey];
      if (aSpace !== bSpace) {
        return aSpace - bSpace;
      }
      if (a.areas.length !== b.areas.length) {
        return b.areas.length - a.areas.length;
      }
      var aSize = a.width * a.height;
      var bSize = b.width * b.height;
      if (aSize !== bSize) {
        return bSize - aSize;
      }
      return a.index - b.index;
    });
  }

  function getTitleObstacles(diagram) {
    return Array.prototype.slice.call(diagram.querySelectorAll(".research-areas-label"))
      .map(function (label) {
        var box = label.getBBox();
        return { x: box.x, y: box.y, width: box.width, height: box.height };
      });
  }

  function measureItems(diagram) {
    var bounds = diagram.getBoundingClientRect();
    var scaleX = VIEWBOX_WIDTH / bounds.width;
    var scaleY = VIEWBOX_HEIGHT / bounds.height;

    return Array.prototype.slice.call(diagram.querySelectorAll(".research-areas-region li"))
      .map(function (item, index) {
        var link = item.querySelector(".research-areas-paper");
        var linkBounds = link.getBoundingClientRect();
        return {
          element: item,
          index: index,
          areas: parseAreas(item.getAttribute("data-venn-areas")),
          width: linkBounds.width * scaleX,
          height: linkBounds.height * scaleY
        };
      })
      .filter(function (item) {
        return item.areas.length > 0;
      });
  }

  function placeItems(diagram) {
    if (!diagram.getBoundingClientRect().width) {
      return;
    }

    diagram.classList.add("research-areas-venn--auto-layout");

    var circles = getCircles(diagram);
    var items = measureItems(diagram);
    var anchors = getAnchors(circles, items);
    var orderedItems = sortItemsForPlacement(items, anchors);
    var placedBoxes = getTitleObstacles(diagram);

    orderedItems.forEach(function (item) {
      var anchor = anchors[areaKey(item.areas)];
      var placement = bestCandidate(circles, item, anchor, placedBoxes, { allowOverlap: false, requireExact: true });
      if (!placement) {
        placement = bestCandidate(circles, item, anchor, placedBoxes, { allowOverlap: false, requireExact: false });
      }
      if (!placement) {
        placement = bestCandidate(circles, item, anchor, placedBoxes, { allowOverlap: true, requireExact: true });
      }
      if (!placement) {
        placement = bestCandidate(circles, item, anchor, placedBoxes, { allowOverlap: true, requireExact: false });
      }
      if (!placement) {
        placement = { x: anchor.x - item.width / 2, y: anchor.y - item.height / 2, width: item.width, height: item.height };
      }

      item.element.style.left = (placement.x / VIEWBOX_WIDTH * 100).toFixed(3) + "%";
      item.element.style.top = (placement.y / VIEWBOX_HEIGHT * 100).toFixed(3) + "%";
      placedBoxes.push(placement);
    });
  }

  function scheduleLayout(diagram) {
    if (diagram._researchAreasLayoutFrame) {
      window.cancelAnimationFrame(diagram._researchAreasLayoutFrame);
    }

    diagram._researchAreasLayoutFrame = window.requestAnimationFrame(function () {
      placeItems(diagram);
    });
  }

  function initResearchAreaLayouts() {
    document.querySelectorAll(".research-areas-venn").forEach(function (diagram) {
      scheduleLayout(diagram);

      if (window.ResizeObserver) {
        var observer = new ResizeObserver(function () {
          scheduleLayout(diagram);
        });
        observer.observe(diagram);
      } else {
        window.addEventListener("resize", function () {
          scheduleLayout(diagram);
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initResearchAreaLayouts);
  } else {
    initResearchAreaLayouts();
  }
}());
