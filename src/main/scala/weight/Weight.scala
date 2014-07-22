package weight

object Weight {

  def time[A](a: => A) = {
    val now = System.nanoTime
    val result = a
    val millis = (System.nanoTime - now) / (1000 * 1000)
    println("%d milliseconds".format(millis))
    result
  }

  case class Combination(euro2: Int, euro1: Int, cent50: Int, cent20: Int, cent10: Int, cent5: Int, cent2: Int, cent1: Int) {
    def numCoins = euro2 + euro1 + cent50 + cent20 + cent10 + cent5 + cent2 + cent1

    def costCoins = euro2 * 2.0 + euro1 * 1.0 + cent50 + 0.5 + cent20 + 0.2 + cent10 + 0.1 + cent5 + 0.05 + cent2 + 0.02 + cent1 + 0.01

    /**
     * @param w The closer to 1 the more you value the number of coins over their euro value. 
     *          Must be between 0 and 1.
     */
    def weightedAverage(w: Double) = w * numCoins + (1 - w) * costCoins
  }

  def solutions(targetWeight: Int) = {
    // What we are looking for:
    // 1000 = a * 85 + b * 75 + c * 78 + d * 57 + e * 41 + f * 39 + g * 30 + h * 23
    for {
      a <- 0 to (targetWeight / 85)
      b <- 0 to (targetWeight / 75)
      if a * 85 + b * 75 <= targetWeight
      c <- 0 to (targetWeight / 78)
      if a * 85 + b * 75 + c * 78 <= targetWeight
      d <- 0 to (targetWeight / 57)
      if a * 85 + b * 75 + c * 78 + d * 57 <= targetWeight
      e <- 0 to (targetWeight / 41)
      if a * 85 + b * 75 + c * 78 + d * 57 + e * 41 <= targetWeight
      f <- 0 to (targetWeight / 39)
      if a * 85 + b * 75 + c * 78 + d * 57 + e * 41 + f * 39 <= targetWeight
      g <- 0 to (targetWeight / 30)
      if a * 85 + b * 75 + c * 78 + d * 57 + e * 41 + f * 39 + g * 30 <= targetWeight
      h <- 0 to (targetWeight / 23)
      if a * 85 + b * 75 + c * 78 + d * 57 + e * 41 + f * 39 + g * 30 + h * 23 == targetWeight
    } yield Combination(a, b, c, d, e, f, g, h)
  }

  def main(args: Array[String]): Unit = {

    val res = time {
      solutions(targetWeight = 1000) // == 100g, adjusted to use integer math
    }

    res.sortBy(_.numCoins).take(1000).foreach(x => println(s"$x, numCoins = ${x.numCoins}"))
    //res.sortBy(_.costCoins).take(1000).foreach(x => println(x + ", costCoins = %2f".format(x.costCoins)))
    //res.sortBy(_.weightedAverage(0.5)).take(1000).foreach(println)
  }
}
