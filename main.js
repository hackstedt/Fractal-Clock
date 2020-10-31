const TWO_PI = 2*Math.PI

const dpr = devicePixelRatio

const width = innerWidth, height = innerHeight
const halfWidth = width / 2, halfHeight = height / 2
const radius = Math.min(halfHeight, halfWidth)

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.style.width = width + "px"
canvas.style.height = height + "px"
canvas.width = Math.floor(width * dpr)
canvas.height = Math.floor(height * dpr)


const handWidth = 2
const handWidthHalf = handWidth / 2

const shrink = 0.67
const smallestSecondHand = 2

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
// n = log(a) / log(b);
//
// l = 4 / (0,7^n)

const calc = {}
calc.b = Math.log(shrink)
calc.a = Math.log( smallestSecondHand / (radius * (1 - shrink) + smallestSecondHand * shrink) )
calc.n = calc.a / calc.b
calc.l = smallestSecondHand / Math.pow(shrink, calc.n)

const secondHandLength = calc.l
const minuteHandLength = secondHandLength / 1.62
const hourHandLength = minuteHandLength / 1.62

const initAngle = - Math.PI
let secondHandAngle = ( 0 * Math.PI / 180)
let minuteHandAngle = (45 * Math.PI / 180)
let hourHandAngle   = (30 * Math.PI / 180)


function action() {
  requestAnimationFrame(action)


  // hands rotation
  secondHandAngle += 0.02
  minuteHandAngle += 0.002
  hourHandAngle += 0.001


  // initial clock setup
  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, width, height);
  ctx.translate(halfWidth, halfHeight)
  ctx.rotate(initAngle);


  // clock face
  ctx.fillStyle = 'black'

  // every 5 minutes
  ctx.save()
  for (let i = 0; i < 12; ++i) {
    ctx.rotate(TWO_PI / 12);
    ctx.fillRect(-2, secondHandLength - 5, 4, 10)
  }
  ctx.restore()
  // every 1 minutes
  ctx.save()
  for (let i = 0; i < 60; ++i) {
    ctx.rotate(TWO_PI / 60);
    ctx.fillRect(-0.5, secondHandLength - 5, 1, 10)
  }
  ctx.restore()

  // every 5 minutes
  ctx.save()
  for (let i = 0; i < 12; ++i) {
    ctx.rotate(TWO_PI / 12);
    ctx.fillRect(-2, radius - 15, 4, 10)
  }
  ctx.restore()

  // every 1 minutes
  ctx.save()
  for (let i = 0; i < 60; ++i) {
    ctx.rotate(TWO_PI / 60);
    ctx.fillRect(-0.5, radius - 15, 1, 10)
  }
  ctx.restore()


  // recursion
  drawHands(secondHandLength, minuteHandLength, hourHandLength)


  // hands
  ctx.fillStyle = 'black'

  // secondHand
  ctx.save()
  ctx.rotate(secondHandAngle);
  ctx.fillRect(-handWidthHalf, 0, handWidth, secondHandLength)
  ctx.fillRect(-0.5*handWidthHalf, 0, 0.5*handWidth, radius)
  ctx.restore()

  // minuteHand
  ctx.save()
  ctx.rotate(minuteHandAngle);
  ctx.fillRect(-handWidthHalf, 0, handWidth, minuteHandLength)
  ctx.restore()

  // hourHand
  ctx.save()
  ctx.rotate(hourHandAngle);
  ctx.fillRect(-handWidthHalf, 0, handWidth, hourHandLength)
  ctx.restore()
}


function drawHands(secondHandLength, minuteHandLength, hourHandLength) {
  if (secondHandLength >= smallestSecondHand ) {
    drawSecond(secondHandLength, minuteHandLength, hourHandLength)
    drawMinute(secondHandLength, minuteHandLength, hourHandLength)
    //drawHour(secondHandLength, minuteHandLength, hourHandLength)
  }
}


function drawSecond(secondHandLength, minuteHandLength, hourHandLength) {
  ctx.save()
  ctx.fillStyle = 'red'
  ctx.rotate(secondHandAngle);
  ctx.fillRect(-handWidthHalf, 0, handWidth, secondHandLength)
  ctx.translate(0, secondHandLength)
  drawHands(secondHandLength * shrink, minuteHandLength * shrink, hourHandLength * shrink)
  ctx.restore()
}


function drawMinute(secondHandLength, minuteHandLength, hourHandLength) {
  ctx.save()
  ctx.fillStyle = 'green'
  ctx.rotate(minuteHandAngle);
  ctx.fillRect(-handWidthHalf, 0, handWidth, minuteHandLength)
  ctx.translate(0, minuteHandLength)
  drawHands(secondHandLength * shrink, minuteHandLength * shrink, hourHandLength * shrink)
  ctx.restore()
}


function drawHour(secondHandLength, minuteHandLength, hourHandLength) {
  ctx.save()
  ctx.fillStyle = 'blue'
  ctx.rotate(hourHandAngle);
  ctx.fillRect(-handWidthHalf, 0, handWidth, hourHandLength)
  ctx.translate(0, hourHandLength)
  drawHands(secondHandLength * shrink, minuteHandLength * shrink, hourHandLength * shrink)
  ctx.restore()
}


requestAnimationFrame(action)
