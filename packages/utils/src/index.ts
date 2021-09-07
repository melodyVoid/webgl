/**
 * 获取 WebGL 绘制上下文对象
 */
export const getWebGLContext = (
  element: HTMLElement | null
): WebGLRenderingContext => {
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
): WebGLShader => {
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
): { program: WebGLProgram } => {
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

/**
 * 生成随机色
 */
export const randomColor = () => {
  // 生成 [0, 255] 的随机整数
  const min = 0
  const max = 255
  const random = () => Math.floor(Math.random() * (max - min) + 1) + min

  return {
    r: random(),
    g: random(),
    b: random(),
    a: 1, // alpha，要不然容易出现白点过多的情况
  }
}

/**
 * 创建 buffer
 */
export interface VertexAttribPointerOptions {
  /**
   * 每次取几个数据
   */
  size: number
  /**
   * 数据类型，一般为 gl.Float
   */
  type?: number
  /**
   * 是否需要归一化
   */
  normalized?: boolean
  /**
   * 每次迭代运行需要移动数据数 * 每个数据所占内存 到下一个数据开始点。
   */
  stride?: number
  /**
   * 从缓冲位置偏移量
   */
  offset?: number
}
export const createBuffer = (
  gl: WebGLRenderingContext,
  attribute: number,
  vertexAttribPointer: VertexAttribPointerOptions
) => {
  const {
    size,
    type = gl.FLOAT,
    normalized = false,
    stride = 0,
    offset = 0,
  } = vertexAttribPointer

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)

  gl.vertexAttribPointer(attribute, size, type, normalized, stride, offset)
  gl.enableVertexAttribArray(attribute)

  return buffer
}

/**
 * 加载纹理
 */
export const loadTexture = (
  gl: WebGLRenderingContext,
  src: string,
  attribute: WebGLUniformLocation | null,
  callback: () => void
) => {
  /**
   * 加载图片
   */
  const img = new Image()
  img.src = src
  img.crossOrigin = 'anonymous'

  img.onload = () => {
    /**
     * 激活 0 号纹理通道 gl.TEXTURE0
     */
    gl.activeTexture(gl.TEXTURE0)

    /**
     * 创建纹理对象
     */
    const texture = gl.createTexture()

    /**
     * 绑定纹理对象到当前纹理绑定点(gl.TEXTURE_2D)上
     */
    gl.bindTexture(gl.TEXTURE_2D, texture)
    /**
     * 为片元着色器传递图片数据
     */
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img)
    /**
     * 置图片在放大或者缩小时采用的算法 gl.LINEAR
     */
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)

    /**
     * 为片元着色器传递 0 号纹理单元
     */
    gl.uniform1i(attribute, 0)
    /**
     * 执行回调
     */
    callback?.()
  }
}
