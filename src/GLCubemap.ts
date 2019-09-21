import { GLTexture } from './GLTexture';

export class GLCubemap extends GLTexture {
    protected gl: WebGL2RenderingContext;
    protected _textureID: number;
    protected _texture: WebGLTexture;
    protected mipmap: boolean;
    protected _width: number;
    protected _height: number;
    protected format: number;
    protected internalformat: number;
    protected type: number;
    public premultiplyAlpha: boolean;

    constructor(
        gl: WebGL2RenderingContext,
        textureID = 0,
        width = -1,
        height = -1,
        internalFormat: number = gl.RGBA,
        format: number = gl.RGBA,
        type: number = gl.UNSIGNED_BYTE,
    ) {
        super(gl, textureID, width, height, internalFormat, format, type);
        this.gl = gl;
        this._textureID = textureID;
        this._texture = gl.createTexture();
        this.mipmap = false;
        this.premultiplyAlpha = false;
        this._width = width;
        this._height = height;
        this.format = format;
        this.type = type;
    }

    /**
     * Uploads this texture to the GPU
     * @param source {HTMLImageElement|ImageData|HTMLVideoElement}
     * @param flip - {boolean} flip the texture
     * @param face {number}
     * @param level {number} mipmap level
     */
    public upload(source: HTMLImageElement | ImageData | HTMLVideoElement, flip = false, face = 0, level = 0) {
        this.bind();
        const gl = this.gl;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, (this.premultiplyAlpha as any) as GLint);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, (flip as any) as GLint);
        gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + face, level, this.internalformat, this.format, this.type, source);
        if (level === 0) {
            this._width = source.width;
            this._height = source.height;
        }
        this.unbind();
    }

    /**
     * Use a data source and uploads this texture to the GPU
     * @param data {TypedArray} data to upload to the texture
     * @param width {number} new width of the texture
     * @param height {number} new height of the texture
     * @param flip - {boolean} flip the texture
     * @param face {number}
     */
    public uploadData(
        data: Float32Array,
        face: number,
        width: number = this._width,
        height: number = this._height,
        flip = false,
        level = 0,
    ) {
        this.bind();
        const gl = this.gl;
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, (this.premultiplyAlpha as any) as GLint);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, (flip as any) as GLint);
        gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
            level,
            this.internalformat,
            width,
            height,
            0,
            this.format,
            this.type,
            data || null,
        );
        if (level === 0) {
            this._width = width;
            this._height = height;
        }
        this.unbind();
    }

    /**
     * Binds the texture
     * @param location
     */
    public bind(location: number = this._textureID): GLCubemap {
        const gl = this.gl;
        if (location !== undefined) {
            gl.activeTexture(gl.TEXTURE0 + location);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._texture);
        return this;
    }

    public unbind(location: number = this._textureID): GLCubemap {
        const gl = this.gl;
        if (location !== undefined) {
            gl.activeTexture(gl.TEXTURE0 + location);
        }
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        return this;
    }

    /**
     * Enables linear filtering
     */
    public enableLinearScaling() {
        this.minFilter(true);
        this.magFilter(true);
    }

    /**
     * Enabled nearest neighbour interpolation
     */
    public enableNearestScaling() {
        this.minFilter(false);
        this.magFilter(false);
    }

    /**
     * @param linear {boolean} if we want to use linear filtering or nearest neighbour interpolation
     */
    public minFilter(linear: boolean) {
        this.bind();
        const gl = this.gl;
        if (this.mipmap) {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
        } else {
            gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, linear ? gl.LINEAR : gl.NEAREST);
        }
        this.unbind();
    }

    /**
     * @param linear {boolean} if we want to use linear or nearest neighbour interpolation
     */
    public magFilter(linear: boolean) {
        const gl = this.gl;
        this.bind();
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, linear ? gl.LINEAR : gl.NEAREST);
        this.unbind();
    }

    /**
     * Enables mipmapping
     */
    public enableMipmap() {
        const gl = this.gl;
        this.bind();
        this.mipmap = true;
        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
        this.unbind();
    }

    /**
     * Enables clamping on the texture wo WebGL will not repeat it
     */
    public enableWrapClamp() {
        const gl = this.gl;
        this.bind();
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        this.unbind();
    }

    /**
     * Enable tiling on the texture
     */
    public enableWrapRepeat() {
        const gl = this.gl;
        this.bind();
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.REPEAT);
        this.unbind();
    }

    public enableWrapMirrorRepeat() {
        const gl = this.gl;
        this.bind();
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.MIRRORED_REPEAT);
        this.unbind();
    }

    /**
     * Destroys this texture
     */
    public destroy() {
        const gl = this.gl;
        gl.deleteTexture(this._texture);
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    /**
     * create CubeMap from source data
     * @param gl
     * @param source - the src
     * @param flip - flip the texture default: false
     * @param premultiplyAlpha - premultiplyAlpha
     * @param textureID - textureID
     * @param internalformat
     * @param format
     * @param type
     */
    public static cubemapFromSource(
        gl: WebGL2RenderingContext,
        source: Array<HTMLImageElement | ImageData> | HTMLImageElement | ImageData,
        flip = false,
        premultiplyAlpha = false,
        textureID = 0,
        internalformat?: number,
        format?: number,
        type?: number,
    ): GLCubemap {
        const cubemap = new GLCubemap(gl, textureID, null, null, internalformat, format, type);
        const sources = [].concat(source);
        cubemap.premultiplyAlpha = premultiplyAlpha;
        const mipLevels = Math.floor(sources.length / 6);
        for (let j = 0; j < mipLevels; j++) {
            for (let i = 0; i < 6; i++) {
                cubemap.upload(sources[j * 6 + i], flip, i, j);
            }
        }

        if (GLTexture.isPowerOf2(sources[0].width) && GLTexture.isPowerOf2(sources[0].height)) {
            cubemap.enableMipmap();
            cubemap.enableWrapRepeat();
        } else {
            cubemap.enableWrapClamp();
        }

        cubemap.enableLinearScaling();
        return cubemap;
    }

    public static cubemapFromData(
        gl: WebGL2RenderingContext,
        data: Array<Float32Array> | Float32Array,
        width: number,
        height: number,
        flip = false,
        textureID = 0,
        internalformat?: number,
        format?: number,
        type?: number,
    ): GLCubemap {
        const cubemap = new GLCubemap(gl, textureID, null, null, internalformat, format, type);
        const sources = [].concat(data);
        for (let i = 0; i < 6; i++) {
            cubemap.uploadData(sources[i], i, width, height, flip);
        }

        return cubemap;
    }
}
