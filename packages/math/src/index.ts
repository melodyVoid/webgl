export const deg2radian = Math.PI / 180
export const radian2deg = 180 / Math.PI
/**
 * 角度转弧度
 */
export const deg2radians = (deg: number) => {
  return deg * deg2radian
}

/**
 * 弧度转角度
 */
export const radians2deg = (radians: number) => {
  return radians * radian2deg
}

export const clamp = (value: number, min: number, max: number) => {
  return Math.max(min, Math.min(value, max))
}

/**
 * 随机数
 */
export const random = (min: number, max: number) => {
  return Math.random() * (max - min) + min
}


