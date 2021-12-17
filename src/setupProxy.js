/* Copyright (c) 2021 Intel Corporation.

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
    let prot = (process.env.dev_mode=="true") ? "http":"https";
    let be_ip = process.env.DEPLOYMENT_TOOL_BACKEND_HOST;
    let be_port = process.env.DEPLOYMENT_TOOL_BACKEND_PORT;
    let wv_ip = process.env.WEB_VISUALIZER_HOST;
    let wv_port = process.env.WEB_VISUALIZER_DEV_PORT;

    /* Proxy for backend REST APIs */
    app.use('/eii/ui/*', createProxyMiddleware({
	target: prot + '://' + be_ip + ':' + be_port,
	changeOrigin: true,
	secure: false}));

    /* Proxy for WebVisualizer APIs */
    app.use('/webvisualizer/*', createProxyMiddleware({
	target: "http://" + wv_ip + ":" + wv_port,
        pathRewrite: {'^/webvisualizer/*': '/'},
	changeOrigin: true,
	secure: false}));
}
