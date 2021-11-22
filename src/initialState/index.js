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


export const initialState = {
  projectSetup: {
    isCreateProject: false,
    noOfStreams: 0,
    projectName: '',
    projectLocation: '',
    existingProjectLocation: '',
    isValid: false,
    selectedTab:'',
    setSelectedTab:'',
    tabCount:0,
    popUp:true,
  },
  existProjects: [],
  projects: [],
  
  componentsInitialState:  {
    data_stream_id:undefined,
    selectedIndex: undefined,
    selectedComponents: {   provisioned: false,
                            needReProvision: false,
                            devMode: true,
                            output: false,
                            action: null, 
                            params: [], 
                            nodes: [],
                            currentComponent: null,
                          
                        },
    components:[
        {
            type:'input',
            color: '#ff00ff',
            appName:"VideoIngestion",
            dirName: "VideoIngestion",
            containerName: "ia_video_ingestion"
        },
        {
            type:'default',
            color: '#ff00ff',
            appName:"VideoAnalytics",
            dirName:"VideoAnalytics",
            containerName: "ia_video_analytics"
        },
      
        {
            type:'output',
            appName:"WebVisualizer",
            dirName:"WebVisualizer",
            containerName: "ia_web_visualizer"
        },
   
    ],   
    
   },

componentsStateData:[],
getData:{
    appName:'',
    appNameleft:'',
    isOpen:false,
}   ,
buildResponse:{
    data:[],
    status:false,
    other:[]
}
};
