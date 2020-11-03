const smallestSecondHand = 9,
initAngle = - Math.PI,
   TWO_PI = 2*Math.PI,
      dpr = devicePixelRatio,
   shrink = 2/3,

    width = innerWidth, height = innerHeight,
halfWidth = width / 2, halfHeight = height / 2,
   radius = Math.min(halfHeight, halfWidth),

   canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d")

canvas.style.width = width + "px"
canvas.style.height = height + "px"
canvas.width = Math.floor(width * dpr)
canvas.height = Math.floor(height * dpr)


// Calculate the length of the second hand
// L:   radius = min(halfHeight, halfWidth)
// 4:   smallestSecondHand
// 0.7: shrink ratio
// l:   secondHandLength <= we want this
//            /            4            \
// n = log    |-------------------------|
//        0,7 \ L * (1 - 0,7) + 4 * 0,7 /
//
//        <b>  <---------- a ---------->
//
// n = log (a)
//        b
//
// n = log(a) / log(b)
//
// l = 4 / (0,7^n)

const calc = {}
calc.b = Math.log(shrink)
calc.a = Math.log( smallestSecondHand / (radius * (1 - shrink) + smallestSecondHand * shrink) )
calc.n = calc.a / calc.b
calc.l = smallestSecondHand / Math.pow(shrink, calc.n)

const
secondHandLength = calc.l,
minuteHandLength = secondHandLength,
  hourHandLength = minuteHandLength,

handWidth     = 2,
handWidthHalf = handWidth / 2

let
secondHandAngle = ( 0 * Math.PI / 180),
minuteHandAngle = (45 * Math.PI / 180),
hourHandAngle   = (30 * Math.PI / 180)


function tick() {
  requestAnimationFrame(tick)


  // hands rotation
  secondHandAngle += 0.02
  minuteHandAngle += 0.002
  hourHandAngle += 0.017


  color = 'hsl(' + ( hourHandAngle % TWO_PI ) / TWO_PI * 360 + ', 100%, 50%)'


  // initial clock setup
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, width, height)
  ctx.translate(halfWidth, halfHeight)
  ctx.rotate(initAngle)


  // recursion
  ctx.fillStyle = color
  drawHands(secondHandLength, minuteHandLength, hourHandLength)


  // clock face

  // every 5 minutes
  ctx.save()
  for (let i = 0; i < 12; ++i) {
    ctx.fillStyle = 'hsl(' + ( i * 30 ) % 360 + ', 100%, 50%)'
    ctx.fillRect(-3, secondHandLength + 10, 6, 15)
    ctx.rotate(TWO_PI / 12)
  }
  ctx.restore()

  // every 1 minutes
  ctx.save()
  for (let i = 0; i < 60; ++i) {
    ctx.fillStyle = 'hsl(' + ( i * 6 ) % 360 + ', 100%, 50%)'
    ctx.fillRect(-1.5, secondHandLength + 15, 3, 10)
    ctx.rotate(TWO_PI / 60)
  }
  ctx.restore()


  // hands
  ctx.fillStyle = 'hsla(0, 0%, 90%, 0.8)'

  // secondHand
  ctx.save()
  ctx.rotate(secondHandAngle)
  ctx.fillRect(-handWidthHalf, 0, handWidth, secondHandLength)
  ctx.restore()

  // minuteHand
  ctx.save()
  ctx.rotate(minuteHandAngle)
  ctx.fillRect(-handWidthHalf, 0, handWidth, minuteHandLength)
  ctx.restore()

  // hourHand
  ctx.save()
  ctx.rotate(hourHandAngle)
  ctx.fillRect(-handWidthHalf*2, 0, handWidth*2, hourHandLength)
  ctx.restore()
}


function drawHands(secondHandLength, minuteHandLength, hourHandLength) {
  if (secondHandLength >= smallestSecondHand ) {

    // second
    ctx.save()
    ctx.rotate(secondHandAngle)
    ctx.fillRect(-handWidthHalf, 0, handWidth, secondHandLength)
    ctx.translate(0, secondHandLength)
    drawHands(secondHandLength * shrink, minuteHandLength * shrink, hourHandLength * shrink)
    ctx.restore()

    // minute
    ctx.save()
    ctx.rotate(minuteHandAngle)
    ctx.fillRect(-handWidthHalf, 0, handWidth, minuteHandLength)
    ctx.translate(0, minuteHandLength)
    drawHands(secondHandLength * shrink, minuteHandLength * shrink, hourHandLength * shrink)
    ctx.restore()

    // hour
    ctx.save()
    ctx.rotate(hourHandAngle)
    ctx.fillRect(-handWidthHalf, 0, handWidth, hourHandLength)
    ctx.translate(0, hourHandLength)
    drawHands(secondHandLength * shrink, minuteHandLength * shrink, hourHandLength * shrink)
    ctx.restore()
  }
}


requestAnimationFrame(tick)
