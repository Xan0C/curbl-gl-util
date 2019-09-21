/**
 * @fileoverview This file contains functions every webgl program will need
 * a version of one way or another.
 *
 * Instead of setting up a context manually it is recommended to
 * use. This will check for success or failure. On failure it
 * will attempt to present an approriate message to the user.
 *
 *       gl = WebGLUtils.setupWebGL(canvas);
 *
 * For animated WebGL apps use of setTimeout or setInterval are
 * discouraged. It is recommended you structure your rendering
 * loop like this.
 *
 *       function render() {
 *         window.requestAnimationFrame(render, canvas);
 *
 *         // do rendering
 *         ...
 *       }
 *       render();
 *
 * This will call your rendering function up to the refresh rate
 * of your display but will stop rendering if your app is not
 * visible.
 */

/**
 * Mesasge for getting a webgl browser
 * @type {string}
 */
const GET_A_WEBGL_BROWSER =
    '' +
    'This page requires a browser that supports WebGL.<br/>' +
    '<a href="http://get.webgl.org">Click here to upgrade your browser.</a>';

/**
 * Mesasge for need better hardware
 * @type {string}
 */
const OTHER_PROBLEM =
    '' + "It doesn't appear your computer can support WebGL.<br/>" + '<a href="http://get.webgl.org">Click here for more information.</a>';

/**
 * Creates the HTLM for a failure message
 * @param {string} canvasContainerId id of container of th
 *        canvas.
 * @return {string} The html.
 */
function makeFailHTML(msg: string): string {
    return '' + '<div style="margin: auto; width:500px;z-index:10000;margin-top:20em;text-align:center;">' + msg + '</div>';
}

/**
 * Creates a webgl context.
 * @param {!Canvas} canvas The canvas tag to get context
 *     from. If one is not passed in one will be created.
 * @param {!WebGLContextCreationAttirbutes} optAttribs
 *     creation attributes you want to pass in.
 * @return {!WebGLContext} The created context.
 */
export function create3DContext(
    canvas: HTMLCanvasElement,
    optAttribs: WebGLContextAttributes,
): WebGL2RenderingContext | CanvasRenderingContext2D | null {
    const names = ['webgl2', 'webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
    let context = null;
    for (const name of names) {
        try {
            context = canvas.getContext(name, optAttribs);
        } catch (e) {}
        if (context) {
            break;
        }
    }

    //@ts-ignore
    return context;
}

/**
 * Creates a webgl context. If creation fails it will
 * change the contents of the container of the <canvas>
 * tag to an error message with the correct links for WebGL.
 * @param {Element} canvas. The canvas element to create a
 *     context from.
 * @param {WebGLContextCreationAttirbutes} optAttribs Any
 *     creation attributes you want to pass in.
 * @param {function:(msg)} optOnError An function to call
 *     if there is an error during creation.
 * @return {WebGL2RenderingContext} The created context.
 */
export function setupWebGL(
    canvas: Element,
    optAttribs?: WebGLContextAttributes,
    optOnError?: (msg: string) => any,
): WebGL2RenderingContext | CanvasRenderingContext2D | null {
    function handleCreationError(msg: string) {
        const container: Element = document.getElementsByTagName('body')[0];
        if (container) {
            let str = window['WebGL2RenderingContext'] ? OTHER_PROBLEM : GET_A_WEBGL_BROWSER;
            if (msg) {
                str += '<br/><br/>Status: ' + msg;
            }
            container.innerHTML = makeFailHTML(str);
        }
    }

    const onError = optOnError || handleCreationError;
    if (canvas.addEventListener) {
        canvas.addEventListener(
            'webglcontextcreationerr',
            (event: any) => {
                onError(event.statusMessage);
            },
            false,
        );
    }
    const context = create3DContext(canvas as HTMLCanvasElement, optAttribs!);
    if (!context) {
        if (!window['WebGL2RenderingContext']) {
            onError('');
        } else {
            onError('');
        }
    }

    return context;
}

/**
 * Provides requestAnimationFrame in a cross browser
 * way.
 */
if (!window.requestAnimationFrame) {
    window['requestAnimationFrame'] = (function() {
        return (
            window['requestAnimationFrame'] ||
            window['webkitRequestAnimationFrame'] ||
            //@ts-ignore
            window['mozRequestAnimationFrame'] ||
            //@ts-ignore
            window['oRequestAnimationFrame'] ||
            //@ts-ignore
            window['msRequestAnimationFrame'] ||
            function(callback: (...args: any[]) => any) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    })();
}

/** * ERRATA: 'cancelRequestAnimationFrame' renamed to 'cancelAnimationFrame' to reflect an update to the W3C Animation-Timing Spec.
 *
 * Cancels an animation frame request.
 * Checks for cross-browser support, falls back to clearTimeout.
 * @param {number}  Animation frame request. */
if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame =
        //@ts-ignore
        window['cancelRequestAnimationFrame'] ||
        window['webkitCancelAnimationFrame'] ||
        //@ts-ignore
        window['webkitCancelRequestAnimationFrame'] ||
        //@ts-ignore
        window['mozCancelAnimationFrame'] ||
        //@ts-ignore
        window['mozCancelRequestAnimationFrame'] ||
        //@ts-ignore
        window['msCancelAnimationFrame'] ||
        //@ts-ignore
        window['msCancelRequestAnimationFrame'] ||
        //@ts-ignore
        window['oCancelAnimationFrame'] ||
        //@ts-ignore
        window['oCancelRequestAnimationFrame'] ||
        window.clearTimeout;
}
