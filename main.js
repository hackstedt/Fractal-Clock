const width = innerWidth * devicePixelRatio, height = innerHeight * devicePixelRatio
const halfWidth = width / 2, halfHeight = height / 2

const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")

canvas.style.width = width + "px"
canvas.style.height = height + "px"
canvas.width = width
canvas.height = height


const handWidth = 1
const handWidthHalf = handWidth / 1

const shrink = 0.67
const smallestSecondHand = 4

// Calculate the length of the second hand
// L:   halfHeight
// 4:   smallestSecondHand
// 0.7: shrink ratio
// l:   secondHandLength
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
calc.a = Math.log( smallestSecondHand / (halfHeight * (1 - shrink) + smallestSecondHand * shrink) )
calc.n = calc.a / calc.b
calc.l = smallestSecondHand / Math.pow(shrink, calc.n)

const secondHandLength = calc.l
const minuteHandLength = secondHandLength / 1.62
const hourHandLength = minuteHandLength / 1.62

const initAngle = - Math.PI
let secondHandAngle = ( 0 * Math.PI / 180)
let minuteHandAngle = (45 * Math.PI / 180)
let hourHandAngle   = (30 * Math.PI / 180)

ctx.fillStyle = 'white'


requestAnimationFrame(action)

let angle = initAngle
function action() {
  requestAnimationFrame(action)

  secondHandAngle += 0.01
  minuteHandAngle += 0.001
  hourHandAngle += 0.001

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, width, height);
  ctx.translate(halfWidth, halfHeight)
  ctx.rotate(initAngle);

  drawHands(secondHandLength, minuteHandLength, hourHandLength)
}

function drawHands(secondHandLength, minuteHandLength, hourHandLength) {
  if (secondHandLength >= smallestSecondHand ) {

    // second
    ctx.save()
    ctx.rotate(secondHandAngle);
    ctx.fillRect(-handWidthHalf, 0, handWidth, secondHandLength)
    ctx.translate(0, secondHandLength)
    drawHands(secondHandLength * shrink, minuteHandLength * shrink, hourHandLength * shrink)
    ctx.restore()

    // minute
    ctx.save()
    ctx.rotate(minuteHandAngle);
    ctx.fillRect(-handWidthHalf, 0, handWidth, minuteHandLength)
    ctx.translate(0, minuteHandLength)
    drawHands(secondHandLength * shrink, minuteHandLength * shrink, hourHandLength * shrink)
    ctx.restore()

    // hour
    //ctx.save()
    //ctx.rotate(hourHandAngle);
    //ctx.fillRect(-handWidthHalf, 0, handWidth, hourHandLength)
    //ctx.translate(0, hourHandLength)
    //drawHands(secondHandLength * shrink, minuteHandLength * shrink, hourHandLength * shrink)
    //ctx.restore()
  }
}

const a = false

if ( a ) {
  for (let r=1; ++r<120;) {
    const ints = [step];
    let int = step;

    while (int != 2) {
      int = (int & 1) ? (int * 3 + 1) / 2 : int / 2
      ints.push(int);
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(100, height - 100);

    for (int of ints.reverse()) {
      ctx.fillStyle = 'hsl('+ step % 360 +',100%,50%)';

      if (isOdd(int)) {
        ctx.fillRect(0, - wHalf, l, w);
        ctx.translate(l, 0);
      } else {
        ctx.rotate(-rotationAngle);
        ctx.fillRect(0, - wHalf, l*2, w);
        ctx.translate(l*2, 0);
        ctx.rotate(rotationAngle);
      }
    }
    if (step > end) {
      step-=increment
    } else if (step < end) {
      step+=increment
    }
  }
}
