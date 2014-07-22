import scala.scalajs.js
import scala.scalajs.js.annotation.JSExport
import weight.Weight
import weight.Weight.Combination

@JSExport
object Export {

  var sols: Seq[Combination] = _

  @JSExport
  def main(): Unit = {
    println("Hello world!")
  }

  @JSExport
  def calcSolutions(targetWeight: js.Number) = {
    sols = Weight.solutions(targetWeight.toInt * 10)
  }

  @JSExport
  def getSolutions(offset: js.Number = 0, limit: js.Number = 0) = {
    val res = js.Array[js.Array[js.Number]]()
    sols.sortBy(_.costCoins).drop(offset.toInt).take(limit.toInt).foreach {
      x =>
        res.push(js.Array(x.euro2, x.euro1, x.cent50, x.cent20, x.cent10, x.cent5, x.cent2, x.cent1))
    }
    res
  }
}
