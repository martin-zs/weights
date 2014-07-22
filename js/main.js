function time(a) {
  var now = new Date().getTime();
  var result = a.call();
  var millis = (new Date().getTime()) - now;
  console.log(millis + " milliseconds");
  return result;
}

function solutions(tw) {
  var targetWeight = (tw * 10) || 1000;

  var res = [];
  for (var a = 0; a < (targetWeight / 85); a++) {
    for (var b = 0; b < (targetWeight / 75); b++) {
      if (a * 85 + b * 75 <= targetWeight) {
        for (var c = 0; c < (targetWeight / 78); c++) {
          if (a * 85 + b * 75 + c * 78 <= targetWeight) {
            for (var d = 0; d < (targetWeight / 57); d++) {
              if (a * 85 + b * 75 + c * 78 + d * 57 <= targetWeight) {
                for (var e = 0; e < (targetWeight / 41); e++) {
                  if (a * 85 + b * 75 + c * 78 + d * 57 + e * 41 <= targetWeight) {
                    for (var f = 0; f < (targetWeight / 39); f++) {
                      if (a * 85 + b * 75 + c * 78 + d * 57 + e * 41 + f * 39 <= targetWeight) {
                        for (var g = 0; g < (targetWeight / 30); g++) {
                          if (a * 85 + b * 75 + c * 78 + d * 57 + e * 41 + f * 39 + g * 30 <= targetWeight) {
                            for (var h = 0; h < (targetWeight / 23); h++) {
                              if (a * 85 + b * 75 + c * 78 + d * 57 + e * 41 + f * 39 + g * 30 + h * 23 == targetWeight) {
                                res.push([a, b, c, d, e, f, g, h])
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
  
  return res;
}
