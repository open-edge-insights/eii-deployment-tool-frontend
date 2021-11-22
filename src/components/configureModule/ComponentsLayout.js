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

import React, { useState, useRef, useCallback, useEffect ,useLayoutEffect} from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, removeElements} from 'react-flow-renderer';
import './ComponentsLayout.css';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import GetConfigApi from '../api/GetConfigApi';
import getLayoutedElements from './LayoutElement';
import ActionType from '../../actionTypes/index';
import errorIcon from '../images/error.png';
import blankIcon from '../images/blank.png';
import BuilderApi from '../api/BuilderApi';
import UpdateConfigApi from '../api/UpdateConfigApi';
import { connect } from 'react-redux';
import ConfigForm from './ConfigForm';
import Slide from '@material-ui/core/Slide';
import _ from 'lodash';
import horizontal from '../../images/horizontal.png';
import vertical from '../../images/vertical.png';
import LoadCompApi from '../api/LoadCompApi';

var timer = null;
const initialElements = [];
const layoutedElements = getLayoutedElements(initialElements);
var edges = [];
var currentSelectedCompName = '';
var flowText = '';
var gId = 0;
const getId = () => `${gId++}`;
var gProvisionInfo = {};
var gCurrentFileEdit = null;
var currentSelectedComp = {};

const useStyles = makeStyles((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));

const ComponentsLayout = (props) => {
    const [openAlert, setOpenAlert] = useState(false);
    const [openFileEdit, setOpenFileEdit] = useState(false);
    const [stateComponent, setStateComponent] = useState(props.stateComponent);

    const [elements, setElements] = useState([layoutedElements]);
    const [open, setOpen] = useState(false);
    const [ctxopen, setContextMenuOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState(false);
    const [alertConfigInvalid, setAlertConfigInvalid] = useState(false);
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [statusIcon, setStatusIcon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);

    let currentComponentData = { ...stateComponent };

    useEffect(() => {
        setStateComponent(props.stateComponent);
    }, [props.stateComponent]);
    useEffect(() => {
        if (reactFlowInstance && elements.length) {
            console.log("fitview1",reactFlowInstance);
            reactFlowInstance.fitView();
            console.log("fitview2");
        }
    }, [reactFlowInstance, elements]);
    
    useEffect(() => {
        var TB='TB';
        console.log("useeffect onlayout check");
        onLayout(TB);

    }, [props.stateComponent]);


    if (currentComponentData.selectedIndex >= 0)
        currentSelectedComp = currentComponentData.selectedComponents.nodes[currentComponentData.selectedIndex];

    const onLayout = useCallback(
            (direction) => {
                const layoutedElements = getLayoutedElements(elements, direction);
                setElements(layoutedElements);
                console.log("onload function called2");
            },
            [elements]
            );

    function trimDigits(s) {
        return s.replace(/\d+$/, '');
    }

    function getDigits(s) {
        let digits = s.match(/\d+$/);
        if (digits) return digits[0];
        return '';
    }
    const handleClose = () => {
        setOpen(false);
    };
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction='up' ref={ref} {...props} />;
    });


    if (timer) {
        clearInterval(timer);
    }

    const handleAlertClose = (event) => {
        setAlertConfig(false);
        setAlertConfigInvalid(false);
    };



    const updateSelectedIdex = (data) => {
        if (data && data.data && data.data.label) {
            for (let i = 0; i < currentComponentData.selectedComponents.nodes.length; i++) {
                if (currentComponentData.selectedComponents.nodes[i].data.label === data.data.label) {
                    currentComponentData.selectedIndex = i;
                    props.dispatchComponents(currentComponentData);
                    break;

                }
            }
        }
    };



    const updateConfigData = (service, data) => {
        let stat = false;
        try {
            JSON.stringify(data);
        } catch (err) {
            return false;
        }

        if(data && ("config" in data) && ("interfaces" in data)){
            for(let i=0; i< currentComponentData.selectedComponents.nodes.length; i++){
                if(currentComponentData.selectedComponents.nodes[i].data.label === service){
                    currentComponentData.selectedIndex = i;
                    console.log("UpdateCOnfigData(): " ,{
                        main:currentComponentData.selectedComponents.nodes,
                        node:currentComponentData.selectedComponents.nodes[i],
                        i
                    });
                    stat = true;
                    break;
                }
            }

            if (stat) {
                let config = {};
                config[service] = {"config": data.config, "interfaces": data.interfaces};
                UpdateConfigApi.updateconfig(
                        { ...config},
                        (respons) => {

                        },
                        (response) => {
                            stat = false;
                        }
                        );
                makeNodeConnections();
                props.dispatchComponents(currentComponentData);
            }
        }
        return stat;
    };

    const handlePaneClick =  (event) => {
        setOpen(false);
    }

    const handleClickOpen =  (event, data) => {
        console.log({event,data});
        if(getComponentById(data.id) == null) {
            console.log("Edge selected.");
            return;
        }

        updateSelectedIdex(data);
        event.preventDefault();
        var services = [data.data.label];
        GetConfigApi.getconfig(
                services,
                (e) => {
                    var response = e.data;
                    var configData = {};
                    Object.keys(response).map((el) => {
                        if (el == data.data.label) {
                            configData = response[el];
                        }
                    });

                    currentSelectedComp.config =  configData.config;
                    currentSelectedComp.interfaces =  configData.interfaces;
                    currentSelectedComp.data = data.data;
                    console.log('data', { currentSelectedComp, response });
                    setOpen(true);
                },
                (response) => {
                    alert('failed to get config for ' + JSON.stringify(services));
                }
                );
    };

    const onContextMenu = (event, data) => {
        currentSelectedCompName = data.data.label;

        setContextMenuOpen(true);
        event.stopPropagation();
        event.preventDefault();
    };

    const onConfigCancel = (event) => {
        setOpen(false);
        event.stopPropagation();
    };

    const onConfigOK = (event, data) => {
        console.log("data in onConfigOk:",data);

        let stat = updateConfigData(currentSelectedComp.data.label, data);
        console.log("onconfigok",{label:currentSelectedComp.data.label, data})

            if (stat) {

                setAlertConfig(true);

            } else {
                setAlertConfigInvalid(true);
            }
        event.preventDefault();
        event.stopPropagation();
    };

    const onFileEditCancel = (event) => {
        setOpenFileEdit(false);
        event.stopPropagation();
    };

    function isEdgeExists(id) {
        for (let i = 0; i < edges.length; i++) {
            if (edges[i].id === id) return true;
        }
        return false;
    }

    function getComponentById(id) {
        var comps = currentComponentData.selectedComponents.nodes;
        let n = comps.length;
        for (var i = 0; i < n; i++) {
            if (comps[i].id === id) return comps[i];
        }
        return null;
    }

    function getNewPSName(appName, ps) {
        if (ps !== 'Publishers' && ps !== 'Subscribers') {
            console.log('Error in getNewPSName: expected "Publishers" or "Subscribers"');
            return null;
        }
        let comps = currentComponentData.selectedComponents.nodes;
        let psFound = true;
        var psName = '';
        for (let cnt = 1; psFound && cnt < 100; cnt++) {
            psName = appName + '_' + ps.slice(0, -1) + '_' + cnt;
            psFound = false;
            for (let i = 0; i < comps.length && !psFound; i++) {
                let intf = comps[i].interfaces[ps];
                if (!intf) {
                    continue;
                }
                for (let j = 0; j < intf.length; j++) {
                    if (psName === intf[j].Name) {
                        psFound = true;
                        break;
                    }
                }
            }
        }
        console.log('Generated new ' + ps + ' Name: ' + psName);
        return psName;
    }

    function getNewEndPoint(ipAddress) {
        let comps = currentComponentData.selectedComponents.nodes;
        let portFound = true;
        var port;
        for (port = 6100; portFound && port < 6399; port++) {
            portFound = false;
            for (let i = 0; i < comps.length && !portFound; i++) {
                let ps = ['Publishers', 'Subscribers'];
                for (let k = 0; k < ps.length && !portFound; k++) {
                    let intf = comps[i].interfaces[ps[k]];
                    if (!intf) {
                        continue;
                    }

                    for (let j = 0; j < intf.length; j++) {
                        if (intf[j].EndPoint === undefined || intf[j].EndPoint.indexOf(':') < 0) {
                            continue;
                        }
                        if (port === parseInt(intf[j].EndPoint.split(':')[1])) {
                            portFound = true;
                            break;
                        }
                    }
                }
            }
        }
        port--;
        console.log('Generated new endpoint: ' + ipAddress + ':' + port);
        return ipAddress + ':' + port;
    }

    function addConnectableInterface(src, trg, type = 'zmq_tcp') {
        if (src.interfaces.Publishers && src.interfaces.Publishers.length > 0) {
            let sIntf = src.interfaces.Publishers[0];
            let srcInstance = getDigits(src.data.label);
            let trgEndPoint = null;
            if (type === 'zmq_tcp') {
                trgEndPoint = src.containerName + srcInstance + ':' + sIntf.EndPoint.split(':')[1];
            } else {
                trgEndPoint = sIntf.EndPoint;
            }
            let tIntf = {
                Name: getNewPSName(trg.data.label, 'Subscribers'),
                Type: sIntf.Type,
                EndPoint: trgEndPoint,
                Topics: sIntf.Topics,
                PublisherAppName: src.data.label,
                ref: 0,
            };
            if (!isIn(trg.data.label, sIntf.AllowedClients)) sIntf.AllowedClients.push(trg.data.label);
            if (trg.interfaces.Subscribers) {
                trg.interfaces.Subscribers.push(tIntf);
            } else {
                trg.interfaces['Subscribers'] = [tIntf];
            }
        } else {
            var endPoint = getNewEndPoint('127.0.0.1');
            let sIntf = {
                Name: getNewPSName(src.data.label, 'Publishers'),
                Type: type,
                EndPoint: endPoint,
                Topics: [src.data.label + '_topic'],
                AllowedClients: [trg.data.label],
                ref: 0,
            };
            let tIntf = {
                Name: getNewPSName(trg.data.label, 'Subscribers'),
                Type: type,
                EndPoint: endPoint,
                Topics: [src.data.label + '_topic'],
                PublisherAppName: src.data.label,
                ref: 0,
            };

            if (src.interfaces.Publishers) {
                src.interfaces.Publishers.push(sIntf);
            } else {
                src.interfaces['Publishers'] = [sIntf];
            }
            if (trg.interfaces.Subscribers) {
                trg.interfaces.Subscribers.push(tIntf);
            } else {
                trg.interfaces['Subscribers'] = [tIntf];
            }
        }
    }

    const onConnect = (params) => {
        var eid = 'e' + params.source + '-' + params.target;
        if (isEdgeExists(eid)) return false;

        let src = getComponentById(params.source);
        if (!src) {
            console.log('Invalid component id: ' + params.source);
            return false;
        }
        let trg = getComponentById(params.target);
        if (!trg) {
            console.log('Invalid component id: ' + params.target);
            return false;
        }
        addConnectableInterface(src, trg);
        makeNodeConnections();
    };

    function checkAndRemoveEdgeInterfaces(a, b) {
        var intf = getConnectableInterfaces(a, b);
        if (intf) {
            if (intf.pub) {
                if (intf.pub.ref - 1 < 1) {
                    intf.pub.ref--;
                    a.interfaces.Publishers.splice(intf.pi, 1);
                }
                if (intf.sub.ref - 1 < 1) {
                    intf.sub.ref--;
                    b.interfaces.Subscribers.splice(intf.si, 1);
                }
            } else if (intf.ser) {
                if (intf.ser.ref - 1 < 1) {
                    intf.ser.ref--;
                    a.interfaces.Servers.splice(intf.si, 1);
                }
                if (intf.cli.ref - 1 < 1) {
                    intf.cli.ref--;
                    b.interfaces.Clients.splice(intf.ci, 1);
                }
            }
        }
    }

    function checkAndRemoveInterfaces(a) {
        var comps = currentComponentData.selectedComponents.nodes;
        for (let i = 0; i < comps.length; i++) {
            var b = comps[i];
            if (a.id === b.id) continue;
            checkAndRemoveEdgeInterfaces(a, b);
            checkAndRemoveEdgeInterfaces(b, a);
        }
    }



    const onElementsRemove = (elementsToRemove) => {
        setOpen(false);
        var nodeRemoved = false;
        var comps = currentComponentData.selectedComponents.nodes;
        for (let i = 0; i < elementsToRemove.length; i++) {
            for (let j = 0; j < comps.length; j++) {
                if (comps[j].id === elementsToRemove[i].id) {
                    checkAndRemoveInterfaces(comps[j]);
                    comps.splice(j, 1);
                    nodeRemoved = true;

                    // If VI/VA remove the VI/VA instance pair
                    let name = elementsToRemove[i].data.label;
                    let instance = getDigits(elementsToRemove[i].data.label);
                    let pairName = "";
                    if(name.startsWith("VideoIngestion"))
                        pairName = "VideoAnalytics" + instance;
                    else if(name.startsWith("VideoAnalytics"))
                        pairName = "VideoIngestion" + instance;
                    else
                        continue;
                    for (let j = 0; j < comps.length; j++) {
                        if (comps[j].data.label === pairName) {
                            checkAndRemoveInterfaces(comps[j]);
                            comps.splice(j, 1);
                        }
                    }

                    break;
                }
            }
        }
        if (!nodeRemoved) {
            for (let i = 0; i < elementsToRemove.length; i++) {
                if (elementsToRemove[i].id[0] === 'e') {
                    let src = getComponentById(elementsToRemove[i].source);
                    let trg = getComponentById(elementsToRemove[i].target);
                    checkAndRemoveEdgeInterfaces(src, trg);
                }
            }
        }
        setElements((els) => removeElements(elementsToRemove, els));
        makeNodeConnections();
        currentComponentData.selectedComponents.needReProvision = true;

        updateOutputState();
        props.dispatchComponents(currentComponentData);
        reloadAndRenderComponents();
        return true;
    };

    function showNetworkError(show) {
        if (show) {
            setStatusIcon(errorIcon);
        } else {
            setStatusIcon(blankIcon);
        }
    }

    function hasOutput() {
        var comps = currentComponentData.selectedComponents;
        for (let i = 0; i < comps.nodes.length; i++) {
            if (comps.nodes[i].type === 'output' && comps.nodes[i].running) {
                return true;
            }
        }
        return false;
    }

    function updateOutputState() {
        currentComponentData.selectedComponents.output = hasOutput();
    }
    const parseSelectedComponent = (s, cfgdata) => {
        currentSelectedComp = comp;
        let id = getId();
        var bgcolor = null;
        var running = null;
        var label = appName;
        var dirName = null;
        var containerName = null;
        var type = null;
        var appName = null;
        var postisan_id = null;
        var componentObj = {};
        var config = {};
        var keys = Object.keys(cfgdata);
        var removeComp = ['EtcdUI', 'GlobalEnv'];
        for (let i = 0; i < keys.length; i++) {
            if (getComponentName(keys[i]) === s) {
                console.log('ondrop function:13');
                if (removeComp.includes(s)) continue;
                console.log('ondrop function:14');
                appName = s;
                postisan_id = getNumber(s);
                componentObj = getComponentObject(appName);
                config = getConfiragtionObject(cfgdata, appName);
                type = componentObj?.type;
                dirName = componentObj?.dirName;
                containerName = componentObj?.containerName;
                break;
            }
        }

        if(appName == null) {
            console.log("ondrop event called: 7");
            console.log("Unrecorgnized service: " + s);
            return;
        }
        var comp = {};
        comp['service'] = appName;
        comp['config'] = config['config'] || {};
        comp['interfaces'] = config['interfaces'] || {};

        var haveIndex = _.findIndex(currentComponentData.selectedComponents.nodes, (e) => {
            return e.service == appName;
        });

        if (haveIndex == -1 && appName != null) {
            console.log('ondrop function:15');
            var position = {x: 0, y: 0};
            var node = {
                ...comp,
                id: `${id}`,
                type,
                running,
                position,
                style: { background: `${bgcolor}` },
                data: { label: `${appName}` },
                label,
                dirName,
                containerName,
                // config,
            };

            setElements((es) => es.concat(node));

            currentComponentData.selectedComponents.nodes.push(node);
            currentComponentData.selectedComponents.needReProvision = true;
            currentComponentData.selectedIndex = currentComponentData.selectedComponents.nodes.length - 1;
            makeNodeConnections();
            updateOutputState();
            props.dispatchComponents(currentComponentData);
            console.log('ondrop function:16');
        }
    };

    function reloadAndRenderComponents(services = null, instances = null) {
        if(services == null) {
            services = [];
            var c = currentComponentData.selectedComponents.nodes;
            for (let i = 0; i < c.length; i++) services.push(c[i].dirName);
            console.log("ondrop event called: 13",props.name);
        }
        let builder_services = services.filter((item, i, ar) => ar.indexOf(item) === i);
        console.log("builder_services:",builder_services);
        console.log("aakas",{services});
        if(instances == null) {
            let cnt = new Array(services.length).fill(1);
            console.log("cnt:",cnt);
            for (let i = 0; i < services.length - 1; i++)
            {
                console.log("cnt1:",cnt);
                for (let j = i + 1; j < services.length; j++)
                {
                    console.log("cnt2:",cnt);
                    if (services[i] === services[j]) 
                    {
                        console.log("cnt3:",cnt);
                        cnt[i]++;
                        console.log("cnt4:",cnt);
                    }
                }
            }
            for (let i = 0; i < cnt.length; i++) {
                if (cnt[i] > instances) instances = cnt[i];
            }
        }

        BuilderApi.builder(
                builder_services,
                instances,
                false,
                (response) => {
                    let config = response;
                    console.log("config value:",config);


                    if (instances >= 1) {
                        removeAllNodes().then(()=>{
                            let p = 1;
                            Object.keys(config).forEach(function (key, index) {
                                parseSelectedComponent(getComponentName(key), config);
                                p++;
                                updateOutputState();
                            });
                        })
                    }
                },
                (response) => {
                    console.log('failed to run builder for ' + services);
                }
        );

    }

    const onLoad = (event, reactFlowInstance) => {

        setReactFlowInstance(event);    

        if (props?.projectSetup?.isCreateProject == false) {
            console.log('props.projectSetup', props.projectSetup);
            LoadCompApi.get(
                    props?.projectSetup?.projectName,
                    (response) => {
                        let config = response;

                        removeAllNodes();

                        Object.keys(config).forEach(function (key, index) {
                            parseSelectedComponent(getComponentName(key), config);

                        });
                        setLoading(false);
                    },
                    (response) => {
                        console.log('failed to run builder for ' + props?.projectSetup?.projectName);
                        setLoading(false);
                    });      
        } else {
            let instances = Number(props?.projectSetup?.noOfStreams);
            BuilderApi.builder(
                    ["VideoIngestion", "VideoAnalytics"],
                    instances,
                    true,
                    (response) => {
                        let config = response;

                        if (instances >= 1) {
                            removeAllNodes();

                            Object.keys(config).forEach(function (key, index) {
                                parseSelectedComponent(getComponentName(key), config);
                            });
                            setLoading(false);
                        } else {
                            parseSelectedComponent(props.name, config);
                            setLoading(false);
                        }
                    },
                    (response) => {
                        setLoading(false);
                    }
            );
        }


    };
    const onDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    function isIn(str, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (str === arr[i]) return true;
        }
        return false;
    }

    function hasCommon(arr1, arr2) {
        for (var i = 0; i < arr1.length; i++)
            for (var j = 0; j < arr2.length; j++) {
                if (arr1[i] === arr2[j]) return true;
            }
        return false;
    }

    function isEndPointsConnectable(pubContainterName, p, s) {
        if (p.Type === 'zmq_ipc' && s.Type === 'zmq_ipc') return p.EndPoint === s.EndPoint;

        if (p.Type !== s.Type) return false;

        let pep = p.EndPoint.split(':');
        let pubHostName = pep[0];
        let pubPort = pep[1];
        let sep = s.EndPoint.split(':');
        var subHostName = sep[0];
        var subPort = sep[1];
        if (pubPort !== subPort) return false;

        if (
                ['127.0.0.1', 'localhost', '0.0.0.0'].includes(pubHostName) &&
                ['127.0.0.1', 'localhost', pubContainterName].includes(subHostName)
           )
            return true;

        return false;
    }

    function isConnectablePS(srcName, srcContainerName, p, trgName, s) {
        while (true) {
            if (!isEndPointsConnectable(srcContainerName, p, s)) break;
            if (!(isIn('*', p.AllowedClients) || isIn(trgName, p.AllowedClients))) break;
            if (!(srcName === s.PublisherAppName || s.PublisherAppName === '*')) break;
            if (!hasCommon(p.Topics, s.Topics)) break;
            if (!(p.Type === s.Type)) break;
            return true;
        }
        return false;
    }

    function isConnectableSC(srcName, s, trgName, c) {
        while (true) {
            if (s.EndPoint !== c.EndPoint) break;
            if (!(isIn('*', s.AllowedClients) || isIn(trgName, c.AllowedClients))) break;
            if (!(srcName === c.ServerAppName || c.ServerAppName === '*')) break;
            if (!(s.Type === c.Type)) break;
            return true;
        }
        return false;
    }

    function validatePublisher(p) {
        if (!('EndPoint' in p) || !('AllowedClients' in p) || !('Topics' in p) || !('Type' in p)) {
            console.log('Error: No EndPoint/AllowedClients/Topics found in: ' + JSON.stringify(p));
            return false;
        }
        return true;
    }

    function validateSubscriber(s) {
        if (!('EndPoint' in s) || !('Topics' in s) || !('PublisherAppName' in s) || !('Type' in s)) {
            console.log('Error: No EndPoint/ServerAppName/Topics found in: ' + JSON.stringify(s));
            return false;
        }
        return true;
    }

    function validateServer(s) {
        if (!('EndPoint' in s) || !('AllowedClients' in s) || !('Type' in s)) {
            return false;
        }
        return true;
    }

    function validateClient(c) {
        if (!('EndPoint' in c) || !('ServerAppName' in c) || !('Type' in c)) {
            return false;
        }
        return true;
    }




    function getConnectableInterfaces(a, b) {
        var srcName = a.data.label;
        var pubs = a.interfaces.Publishers;
        var servers = a.interfaces.Servers; 
        var trgName = b.data.label; 
        var subs = b.interfaces.Subscribers;
        var clients = b.interfaces.Clients;    
        var srcContainerName = a.containerName;
        let srcInstances = getDigits(srcName);
        if(srcInstances) {
            srcContainerName += srcInstances; 
        }

        if(pubs && subs) {
            for(let pi = 0; pi < pubs.length; pi++) {
                var p = pubs[pi];
                if(!validatePublisher(p)){
                    console.log("Error: No EndPoint/AllowedClients/Topics found in: " + JSON.stringify(p));
                    continue;
                }
                for(let si = 0; si < subs.length; si++) {
                    let s = subs[si];
                    if(!validateSubscriber(s)) {
                        console.log("Error: No EndPoint/ServerAppName/Topics found in: " + JSON.stringify(s));
                        continue;
                    }

                    if(!isConnectablePS(srcName, srcContainerName, p, trgName, s)) {
                        continue;
                    }
                    return {"pub": p, "sub": s, "pi": pi, "si": si};
                }
            }
        }

        if(servers && clients) {
            for(let si = 0; si < servers.length; si++) {
                let s = servers[si];
                if(!validateServer(s)) {
                    console.log("Error: No EndPoint/AllowedClients/Type found in: " + JSON.stringify(s));
                    continue;
                }
                for(let ci = 0; ci < clients.length; ci++) {
                    var c = clients[ci];
                    if(!validateClient(c)) {
                        console.log("Error: No EndPoint/ServerAppName/type found in: " + JSON.stringify(c));
                        continue;
                    }
                    if(!isConnectableSC(srcName, s, trgName, c))
                        continue;
                    return {"ser": s, "cli": c, "si": si, "ci": ci};
                }
            }
        }
        return null;
    }


    async function removeAllNodes() {
        setElements((els) => []);
        currentComponentData.selectedComponents.nodes = [];
        props.dispatchComponents(currentComponentData);
        return new Promise((resolve, reject) => {
            return resolve(true);
        })
    }

    function updateFlowText(s1, s2) {
        flowText = flowText + ' | ' + s1 + ' --> ' + s2;
    }

    function resetRefCounts() {
        var c = currentComponentData.selectedComponents.nodes;
        for(let i = 0; i < c.length; i++) {
            let ifs =[c[i].interfaces.Publishers, c[i].interfaces.Subscribers, c[i].interfaces.Servers, c[i].interfaces.Clients];
            for(let j = 0; j < ifs.length; j++) {
                if(ifs[j]) {
                    for(let k = 0; k < ifs[j].length; k++) {
                        ifs[j][k].ref = 0;
                    }    
                }
            }
        }    
    }

    function removeAllEdges() {
        resetRefCounts();
        if(currentComponentData.selectedComponents.nodes.length === 0)
            setElements([]);
        else
            setElements(currentComponentData.selectedComponents.nodes);    
        edges = [];
        flowText = "";
    }

    function getComponentName(str) {
        return str.split('/')[1];
    }

    function removeNumber(str) {
        return str.slice(0, -1);
    }
    function getNumber(str) {
        return str.charAt(str.length - 1);
    }
    function getComponentObject(str) {
        return _.find(currentComponentData.components, (e) => {
            return e.appName == trimDigits(str);
        });
    }

    function getConfiragtionObject(config, name) {
        var data = {};
        data['config'] = config[`/${name}/config`];
        data['interfaces'] = config[`/${name}/interfaces`];

        return data;
    }

    function checkAndMakeConnection(a, b) {
        let intf = getConnectableInterfaces(a, b);

        if (intf) {
            var newEdge = { id: 'e' + a.id + '-' + b.id, source: a.id, target: b.id, animated: false, type: 'default' };
            edges.push(newEdge);
            setElements((els) => addEdge(newEdge, els));
            if (intf.pub) {
                if (a.interfaces.Publishers[intf.pi].ref === undefined) {
                    a.interfaces.Publishers[intf.pi]['ref'] = 0;
                }
                if (b.interfaces.Subscribers[intf.si].ref === undefined) {
                    b.interfaces.Subscribers[intf.si]['ref'] = 0;
                }
                a.interfaces.Publishers[intf.pi].ref++;
                b.interfaces.Subscribers[intf.si].ref++;
            }
            if (intf.ser) {
                if (a.interfaces.Servers[intf.si].ref === undefined) {
                    a.interfaces.Servers[intf.si]['ref'] = 0;
                }
                if (b.interfaces.Clients[intf.ci].ref === undefined) {
                    b.interfaces.Clients[intf.ci]['ref'] = 0;
                }
                a.interfaces.Servers[intf.si].ref++;
                b.interfaces.Clients[intf.ci].ref++;
            }

            updateFlowText(a.data.label, b.data.label);
        }
    }

    function makeNodeConnections() {
        removeAllEdges();

        flowText = '';
        var comp = currentComponentData.selectedComponents.nodes;
        var n = comp.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                checkAndMakeConnection(comp[i], comp[j]);
                checkAndMakeConnection(comp[j], comp[i]);
            }
        }
    }

    const onDivContextMenu = (event) => {
        makeNodeConnections();
    };

    const onDrop = (event) => {
        console.log('ondrop function:0', event);
        event.preventDefault();

        let services = [props.name];
        var c = currentComponentData.selectedComponents.nodes;
        for (let i = 0; i < c.length; i++) services.push(c[i].dirName);
        console.log("ondrop event called: 13",props.name);
        reloadAndRenderComponents(services);
    };
    return (
            <>
            <div className='dndflow layoutflow layout1'>
            <Snackbar
            className='width100'
            open={alertConfig}
            anchorOrigin={{ horizontal: 'top', vertical: 'center' }}
            autoHideDuration={5000}
            onClose={handleAlertClose}
            >
            <Alert onClose={handleAlertClose} severity='success'>
            Configuration saved
            </Alert>
            </Snackbar>
            <Snackbar
            className='width100'
            open={alertConfigInvalid}
            anchorOrigin={{ horizontal: 'top', vertical: 'center' }}
            autoHideDuration={5000}
            onClose={handleAlertClose}
            >
                <Alert onClose={handleAlertClose} severity='error'>
                Configuration is invalid!
                </Alert>
                </Snackbar>
                <div id="component" className="zoompanflow" style={{width:"100%"}}>
                <ReactFlowProvider key='ws'>
                <div className='reactflow-wrapper' id="reactflow" ref={reactFlowWrapper} onContextMenu={(e) => e.preventDefault()}>

                <button id="va" hidden style={{float:"right"}} onClick={() => onLayout("TB")}><img src={vertical} alt="vertical logo"/></button>
                <button id="ha" hidden style={{float:"right"}} onClick={() => onLayout("LR")}><img src={horizontal}  alt="horizontal logo"/></button>

                <ReactFlow
                elements={elements}
    nodesConnectable={true}
    selectNodesOnDrag={false}
    onNodeContextMenu={onContextMenu}
    onConnect={onConnect}
    onElementsRemove={onElementsRemove}
    onLoad={onLoad}
    onDrop={onDrop}
    onContextMenu={onDivContextMenu}
    onDragOver={onDragOver}
    onElementClick={handleClickOpen}
    onPaneClick={handlePaneClick}
    style={{ fill: 'darkblue', background: 'white' }}
    deleteKeyCode={46}
    key='edges'
        markerEndId='react-flow__arrowclosed'
        zoomOnScroll={false}
    zoomOnDoubleClick={false}
    ></ReactFlow>
        </div>
        </ReactFlowProvider>
        </div>
        </div> 

        {currentSelectedComp && currentSelectedComp.config && open ? (
                <ConfigForm
                open={open}
                onConfigCancel={onConfigCancel}
                onConfigOK={onConfigOK}
                DB={currentSelectedComp}
                main_title={currentSelectedComp.data.label}
                />

                ) : ( 
                    ''   
                    )
        }
    </>
        );
};

const mapStateToProps = (state, oldProps) => {
    var componentsData = state.ConfigureBuildReducer.componentsInitialState;

    return {
        stateComponent: componentsData,
        appName: state.ConfigureBuildReducer.getData.appName,
        noOfStreams: state?.ConfigureBuildReducer?.projectSetup?.noOfStreams,
        projectSetup: state?.ConfigureBuildReducer?.projectSetup,

    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchComponents: (currentComponentData) => {
            dispatch({ type: ActionType.UPDATE_MAIN_OBJECT, value: { ...currentComponentData } });
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ComponentsLayout);
