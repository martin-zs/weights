importScripts('type.js');
importScripts('../bower_components/underscore/underscore.js');

var PosInf = 1.7976931348623157E+10308;
var NegInf = -1.7976931348623157E+10308;

var sortFuncs = {
  numCoins: function (s) {
    return s[0] + s[1] + s[2] + s[3] + s[4] + s[5] + s[6] + s[7];
  },

  costCoins: function (s) {
    return s[0] * 2.0 + s[1] * 1.0 + s[2] + 0.5 + s[3] + 0.2 + s[4] + 0.1 + s[5] + 0.05 + s[6] + 0.02 + s[7] + 0.01;
  }
};

var cache = {};

// http://europa.eu/legislation_summaries/economic_and_monetary_affairs/introducing_euro_practical_aspects/l25028_en.htm
function findSolutions(targetWeigth, callback) {
  var tw = (targetWeigth * 10) || 1000;

  if (cache[tw]) {
    return cache[tw];
  }

  var hMax = (tw / 23);
  var gMax = (tw / 30);
  var fMax = (tw / 39);
  var eMax = (tw / 41);
  var dMax = (tw / 57);
  var cMax = (tw / 78);
  var bMax = (tw / 75);
  var aMax = (tw / 85);

  var res = [];
  for (var h = 0; h < hMax; h++) {
    for (var g = 0; g < gMax; g++) {
      if (h * 23 + g * 30 <= tw) {
        for (var f = 0; f < fMax; f++) {
          if (h * 23 + g * 30 + f * 39 <= tw) {
            for (var e = 0; e < eMax; e++) {
              if (h * 23 + g * 30 + f * 39 + e * 41 <= tw) {
                for (var d = 0; d < dMax; d++) {
                  if (h * 23 + g * 30 + f * 39 + e * 41 + d * 57 <= tw) {
                    for (var c = 0; c < cMax; c++) {
                      if (h * 23 + g * 30 + f * 39 + e * 41 + d * 57 + c * 78 <= tw) {
                        for (var b = 0; b < bMax; b++) {
                          if (h * 23 + g * 30 + f * 39 + e * 41 + d * 57 + c * 78 + b * 75 <= tw) {
                            for (var a = 0; a < aMax; a++) {
                              if (h * 23 + g * 30 + f * 39 + e * 41 + d * 57 + c * 78 + b * 75 + a * 85 == tw) {
                                // found a solution
                                callback([a, b, c, d, e, f, g, h], res);
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  cache[tw] = res;
  return res;
}

var minNum = PosInf, maxNum = NegInf,
    minCost = PosInf, maxCost = NegInf;

function updateMinMax(res) {
  for (var i = 0; i < res.length; i++) {
    var s = res[i];
    
    var num = sortFuncs.numCoins(s);
    var cost = sortFuncs.costCoins(s);
    
    if (num < minNum) minNum = num;
    else if (num > maxNum) maxNum = num;
    
    if (cost < minCost) minCost = cost;
    else if (cost > maxCost) maxCost = cost;
  }
}

self.addEventListener('message', function (e) {
  var offset = e.data.offset || 0;
  var limit = e.data.limit || 100;

  var sortFunc = sortFuncs[e.data.sort];
  if (e.data.sort === 'weightedAverage') {
    sortFunc = function (s) {
      
    };
  }

  var pg = 100000;
  var solutions = findSolutions(e.data.targetWeight, function (sol, res) {
    res.push(sol);

    // informing the client
    if (res.length % pg === 0) {
      self.postMessage({
        type: Type.Progress,
        numSolutions: res.length,
        solutions: _.drop(_.take(_.sortBy(res, sortFunc), limit), offset)
      });
    }
  });

  self.postMessage({
    type: Type.Result,
    numSolutions: solutions.length,
    solutions: _.drop(_.take(_.sortBy(solutions, sortFunc), limit), offset)
  });
}, false);

/*
 function time(a) {
 var now = new Date().getTime();
 var result = a.call();
 var millis = (new Date().getTime()) - now;
 console.log(millis + " milliseconds");
 return result;
 }
 */
