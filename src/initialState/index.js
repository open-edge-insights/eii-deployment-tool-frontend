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
   // list of dynamic tabs
  componentsInitialState:  {
    selectedIndex: undefined,
    selectedComponents: {   provisioned: false,
                            needReProvision: false,
                            devMode: true,
                            output: false,
                            action: null, 
                            params: [], 
                            nodes: [],
                            currentComponent: null,
                            // slideToggle:false,
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
        }
    ],   
    
},
getData:{
    appName:'',
    appNameleft:'',
    isOpen:false,
}   
};
