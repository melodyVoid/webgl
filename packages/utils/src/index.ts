/**
 * 获取 WebGL 绘制上下文对象
 */
export const getWebGLContext = (element: HTMLElement | null) => {
  if (element === null) {
    throw new Error('element is null')
  }
  const gl = (element as HTMLCanvasElement).getContext('webgl')

  if (gl === null) {
    throw new Error('fail to get rendering context of WebGL')
  }
  return gl
}

/**
 * 创建并初始化着色器
 */
export const createShader = (
  gl: WebGLRenderingContext,
  type: number,
  source: string
) => {
  const shader = gl.createShader(type)
  if (shader === null) {
    throw new Error('fail to createShader')
  }
  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  // 检测编译是否正常
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (success) {
    return shader
  }
  console.error(gl.getShaderInfoLog(shader))
  gl.deleteShader(shader)
  throw new Error('fail to compile shader')
}

/**
 * 创建 Program
 */
export const createProgram = (
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragShader: WebGLShader
) => {
  // 创建程序
  const program = gl.createProgram()

  if (program === null) {
    throw new Error('fail to create program')
  }

  // 绑定着色器
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragShader)

  // 链接程序
  gl.linkProgram(program)

	// 是否链接成功
  const success = gl.getProgramParameter(program, gl.LINK_STATUS)

  if (success) {
    return {
      program,
    }
  }
	// 链接失败
  const errorLog = gl.getProgramInfoLog(program)
  gl.deleteProgram(program)
  throw errorLog
}
