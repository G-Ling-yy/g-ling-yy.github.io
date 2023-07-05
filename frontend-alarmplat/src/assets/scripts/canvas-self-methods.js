/* eslint-disable */
/* 
绘制简单箭头
* ctx 上下文对象 
及 起始点坐标
* l: Number 箭镞的长度
* arrowheadAngle: Number 箭镞的角度(弧度制: Math.PI / 180 * n)
 */
export function drawSimpleArrow(
  ctx,
  startX,
  startY,
  endX,
  endY,
  l,
  arrowheadAngle
) {
  // 箭身与水平线夹角
  const arrowAngle = Math.atan2(
      endY - startY,
      endX - startX
    ),
    arrowPoint1x =
      endX - l * Math.cos(arrowAngle - arrowheadAngle),
    arrowPoint1y =
      endY - l * Math.sin(arrowAngle - arrowheadAngle),
    arrowPoint2x =
      endX - l * Math.cos(arrowAngle + arrowheadAngle),
    arrowPoint2y =
      endY - l * Math.sin(arrowAngle + arrowheadAngle)

  ctx.beginPath()

  // 绘制箭身路径
  ctx.moveTo(startX, startY)
  ctx.lineTo(endX, endY)

  // 绘制箭镞路径
  ctx.moveTo(arrowPoint1x, arrowPoint1y)
  ctx.lineTo(endX, endY)
  ctx.lineTo(arrowPoint2x, arrowPoint2y)

  // 绘制
  ctx.stroke()
}

/* 
两点绘制矩形
* ctx 上下文对象 
及 起始点坐标
 */
export function drawRectBy2p(
  ctx,
  startX,
  startY,
  endX,
  endY,
  isFill = false
) {
  const x = Math.min(startX, endX),
    y = Math.min(startY, endY),
    width = Math.abs(startX - endX),
    height = Math.abs(startY - endY)
  isFill
    ? ctx.fillRect(x, y, width, height)
    : ctx.strokeRect(x, y, width, height)
}
