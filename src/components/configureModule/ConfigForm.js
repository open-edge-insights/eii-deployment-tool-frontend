import React, { createRef } from 'react';
import './ConfigForm.css';
import _ from 'lodash';
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import { renderToString } from 'react-dom/server';
var o_cfg = null;
var cfg = null;
var ki = 0;
var objectkey = '';


Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
var refrence = [];
export default function ConfigForm(props) {
    const {DB,main_title,open,onConfigCancel,onConfigOK} = props;
  function processDict(c) {
    for (var k in c) {
      let nk = k + '_' + ki;
      ki = ki + 1;
      c[nk] = c[k];
      delete c[k];
      var v = c[nk];
      if (Array.isArray(v)) {
        for (let i = 0; i < v.length; i++) {
          if (typeof v[i] == 'object') {
            processDict(v[i]);
          }
        }
      } else if (typeof v == 'object') {
        processDict(v);
      }
    }
    return c;
  }

  function filter(key) {
    var key1 = key.replace(/\d+$/, '').slice(0, -1);
    return key1;
  }

  function generate() {
    o_cfg = DB;
    var html = [];

    // var cfg_copy = DB; // JSON.parse(JSON.stringify(o_cfg));
    var cfg_copy = JSON.parse(JSON.stringify(o_cfg));
    var config = processDict(cfg_copy.config);
  
    var ifs = processDict(cfg_copy.interfaces);
    var objs = [config, ifs];
    var keys = Object.keys({
        config:cfg_copy.config,     
        interfaces:cfg_copy.interfaces,
    });
  
     for (let i = 0; i < objs.length; i++) {
      var obj = objs[i];
      let btn = [];

      for (var key in obj) {
        btn.push(
          <button
            className='tablinks'
            data-id={key}
            onClick={(e) => {
            
              openTab(e.target.getAttribute('data-id'), e);
            }}
          >
            {filter(key)}
          </button>
        );
      }

      html.push(
        <div className='tab'>
          <br />
          {btn}
        </div>
      );
      
      for (var key in obj) {
        var value = obj[key];
     
        html.push(
          <div id={key} className='tabcontent'>
            {getElement(key, value, 0, `${keys[i]}.${key}`)}
          </div>
        );
      }
      setTimeout(() => {
        for (var key in obj) {
          openTab([key]);
          break;
        }
      }, 2000);
    }
    return html;
  }

  function onSelect(selboxId, key) {
    var selElem = document.getElementById(selboxId);
    if (selElem.selectedIndex > 0) {
      openTab([key, key + '_' + selElem.selectedIndex]);
    }
  }


  // add a select option

  // function AddInSelectObject(obj, prop, newValue) {
  //   var a = prop.split('.');

  //   a = _.map(a, (e) => {
  //     return e.split('_')[0];
  //   });

  //   return (function f(o, v, i) {
  //     if (i == a.length - 1) {
  //       o[a[i]].push(JSON.parse(v));
  //       return o;
  //     }
  //     return f(o[a[i]], v, ++i);
  //   })(obj, newValue, 0);
  // }

  const _AddInSelect = (withKey, value) => {
    var result = AddInSelectObject(DB, withKey, value);
    console.log({ withKey, result, DB });
  };


  function deleteEntry(id, key, withKey) {
    var sel = document.getElementById(id);
    console.log({ id, key, sel, withKey, DB, selectedIndex: sel.selectedIndex });
    let i = sel.selectedIndex;

    if (i > 0) {
      sel.remove(i);
      DeleteInSelectObject(DB, withKey, i);
      openTab([key]);
    }
  }


  function deleteListEntry(id) {
    var sel = document.getElementById(id);
    let i = sel.selectedIndex;
    if (i >= 0) {
      sel.remove(i);
    }
  }

  function getMaxTextWidth(form) {
    var kw = 0;
    for (let key in form) {
      let w = getTextWidth(key);
      if (w > kw) {
        kw = w;
      }
    }
    return kw;
  }

  function addListEntry(id, withKey) {
    console.log(id);
    var inp = prompt('New entry: ', '');
    if (inp == null || inp == '') {
      return;
    }
    var sel = document.getElementById(id);
    var opt = document.createElement('option');
    opt.text = opt.value = inp;
    _AddInSelect(withKey, opt.value);
    sel.options.add(opt);
  }

  function removeNo(key) {
    var a = key.split('_');
    if (a.length > 1) {
      a.pop();
      return a.join('_');
    }
    return a[0];
  }
  function addEntry(id, key, withKey) {
    var sel = document.getElementById(id);
    let n = sel?.options?.length;
    console.log({ id, key: removeNo(key), sel, withKey });

    if (n > 1) {
      // create new option element
      var opt = document.createElement('option');
      let exist = true;
      let str = null;
      let idx = null;
      for (let i = 1; i < 999 && exist; i++) {
        str = `${removeNo(key)}#${i}`;
        exist = false;
        for (let j = 0; j < sel.options.length; j++) {
          if (sel.options[j].text == str) {
            exist = true;
            break;
          }
        }
        idx = i;
      }
      if (exist) {
        alert('Internal error: unable to generate select option text');
        return;
      }

      opt.appendChild(document.createTextNode(str));
      opt.value = sel.options[1].value;
      _AddInSelect(withKey, opt.value);
      sel.appendChild(opt);

      var form = JSON.parse(sel.options[1].value);
      var src = [];
      var kw = getMaxTextWidth(form);
      for (let key in form) {
        src.push(getElement(key, form[key], kw, key));
      }

      var divTable = <div className='div-table'>{src}</div>;
      var p = <p>{divTable}</p>;

      var div = (
        <div id={key + '_' + idx} className='tabcontent' style={{ display: 'none' }}>
          <h4>{str}</h4>
          {p}
        </div>
      );

      var mainDiv = document.getElementById(key);
      mainDiv.insertAdjacentHTML('afterend', renderToString(div));
    }
  }

  function getTextWidth(str) {
    var text = document.createElement('span');
    document.body.appendChild(text);

    text.style.font = 'times new roman';
    text.style.fontSize = 16 + 'px';
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = str;

    var width = Math.ceil(text.clientWidth);
    text.remove();
    return width + 5;
  }

  function change(obj, prop, newValue) {
    var a = prop.split('.');
  
    a = _.map(a, (e) => {
        var n_o = e.split('_');
        if(n_o.length > 1){
            var pop =  n_o.pop();
          
             return  n_o.join('_');
        }
      
      return e.split('_')[0];
    });
  

    return (function f(o, v, i) {
      if (i == a.length - 1) {
        o[a[i]] = v;
        return o;
      }
      return f(o[a[i]], v, ++i);
    })(obj, newValue, 0);
  }

  const _onchange = (key, e) => {
    var value = e.target.value;
  
    if(value == true || value == 'true'){
      value = true;
   }else if(value == false || value == 'false'){
     value = false;
   }
  
    var result = change(DB, key,value);
   console.log({DB, key,value,result})
  };


  
  function AddInSelectObject(obj, prop, newValue) {
    var a = prop.split('.');

    a = _.map(a, (e) => {
      return e.split('_')[0];
    });

    return (function f(o, v, i) {
      if (i == a.length - 1) {
        console.log(o[a[i]]);
        if (isJson(v)) {
          o[a[i]].push(JSON.parse(v));
        } else {
          o[a[i]].push(v);
        }
        return o;
      }
      return f(o[a[i]], v, ++i);
    })(obj, newValue, 0);
  }

  function isJson(str) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return false;
    }
  }

  function DeleteInSelectObject(obj, key, index) {
    var a = key.split('.');

    a = _.map(a, (e) => {
      return e.split('_')[0];
    });

    return (function f(o, index, i) {
      if (i == a.length - 1) {
        delete o[a[i]][index];
        return o;
      }
      return f(o[a[i]], index, ++i);
    })(obj, index, 0);
  }



  function getElement(key, value, keyWidth = 0, withKey = '') {
   
  
    var html = [];
    var _view = [];
    if (typeof value == 'object' && Array.isArray(value)) {
      let ks = keyWidth > 0 ? { width: `${keyWidth}px` } : {};

      var valueIsObj = typeof value[0] == 'object';
      if (!valueIsObj) {
        let opt = [];

        for (let i = 0; i < value.length; i++)
          opt.push(
            <option key={i} value={value[i]}>
              {value[i]}
            </option>
          );

        _view.push(
          <div className='div-table-col-val'>
            <select size={value.length} id={`${key}_select`} name={key} data-objectkey={objectkey}  >
              {opt}
            </select>
            &nbsp;&nbsp;&nbsp;
            <input type='button' onClick={() => deleteListEntry(key + '_select',withKey)} defaultValue={' - '} />
            &nbsp;&nbsp;&nbsp;
            <input type='button' onClick={() => addListEntry(key + '_select',withKey)} defaultValue={' + '} />
          </div>
        );
      } else {
        let opt = [];

        for (let i = 0; i < value.length; i++)
          opt.push(<option key={i} value={JSON.stringify(value[i])}>{`${filter(key)}#${i + 1}`}</option>);

        _view.push(
          <>
            <select
              id={`${key}_select`}
              name={key}
              data-objectkey={objectkey}
              onChange={() => onSelect(`${key}_select`, key)}
            >
              <option value=''>-----Select item-----</option>
              {opt}
            </select>
            &nbsp;&nbsp;&nbsp;
            <input type='button' onClick={() => deleteEntry(`${key}_select`, key,withKey)} defaultValue={' - '} />
            &nbsp;&nbsp;&nbsp;
            <input type='button' onClick={() => addEntry(`${key}_select`, key,withKey)} defaultValue={' + '} />
          </>
        );

        for (let i = 0; i < value.length; i++) {
        
          _view.push(
            <div id={`${key}_${i + 1}`} className='tabcontent' key={i}>
              <h4>{`${filter(key)}#${i + 1}`}</h4>
              {getElement(i, value[i], 0, `${withKey}.${i}`)}
            </div>
          );
        }
      }
      html.push(
        <div className='div-table-row'>
          <div className='div-table-col-key' style={ks}>
            <label>{filter(key)}:&nbsp;&nbsp;</label>
          </div>
          {_view}
        </div>
      );
    } else if (typeof value == 'object') {
      let opt = [];
      let kw = getMaxTextWidth(value);

      for (var key1 in value) {
        var value1 = value[key1];
        opt.push(getElement(key1, value1, kw, `${withKey}.${key1}`));
      }

      html.push(<div className='div-table'>{opt}</div>);
    } else {
      let ks = keyWidth > 0 ? { width: `${keyWidth}px` } : {};
      let opt = [];
      if (typeof value == 'string') {
        opt.push(
          <input
            type='text'
            id={key}
            defaultValue={value}
            key={key}
            onChange={(e) => _onchange(withKey, e)}
            data-objectkey={withKey}
          />
        );
      } else if (typeof value == 'number') {
        opt.push(
          <input
            type='number'
            id={key}
            defaultValue={value}
            key={key}
            onChange={(e) => _onchange(withKey, e)}
            data-objectkey={withKey}
          />
        );
      } else if (typeof value == 'boolean') {
      
        opt.push(
          <input
            type='checkbox'
            id={key}
            defaultChecked={value == true}
            
            key={key}
            onChange={(e) =>{ 
              e.target.value = e.target.checked;
            
              if(e.target.checke){
               
                e.target.setAttribute("checked","checked");      
              }else{
               
                e.target.removeAttribute("checked");
              }
              _onchange(withKey, e);
            }}
            data-objectkey={withKey}
          />
        );
      }

      html.push(
        <div className='div-table-row' key={key}>
          <div className='div-table-col-key' style={ks}>
            <label>{filter(key)}&nbsp;&nbsp;</label>
          </div>
          <div className='div-table-col-val'>{opt}</div>
        </div>
      );
    }

    return html;
  }

  const openTab = (tabs, evt = null) => {
  
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with className="tabcontent" and hide them
    tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }

    // Show the current tab, and add an "active" className to the button that opened the tab
    if (Array.isArray(tabs)) {
      for (let i = 0; i < tabs.length; i++) {
        var tabId = tabs[i];
      
        if (document.getElementById(tabId)) document.getElementById(tabId).style.display = 'block';
        //    document.getElementById(tabId).className += " active";
      }
    } else {
      document.getElementById(tabs).style.display = 'block';
      //    document.getElementById(tabs).className += " active";
    }
    if (evt) {
      // Get all elements with className="tablinks" and remove the className "active"
      tablinks = document.getElementsByClassName('tablinks');
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
      }
      evt.currentTarget.className += ' active';
    }
  };

  return( <Dialog
    open={open}
    className="Configdetails"
    aria-labelledby="form-config-dialog-title"
  >
    <DialogTitle id="form-config-dialog-title">
      {main_title} Configuration
    </DialogTitle>
    <DialogContent>
      {/* <form> */}
        {/* <TextareaAutosize
          autoFocus
          rows="20"
          cols="60"
          // margin="dense"
          id="config.js.data"
          // label="Size"
          type="textarea"
          defaultValue={JSON.stringify({ "config": currentSelectedComp.config, "interfaces": currentSelectedComp.interfaces }, undefined, 4)}
        //fullWidth
        ></TextareaAutosize> */}
          <div>{generate()}</div>
      {/* </form> */}
    </DialogContent>
    <DialogActions>
      <Button onClick={onConfigCancel} color="primary">
        Cancel
      </Button>
      <Button onClick={(e)=>onConfigOK(e,{ "config": DB.config, "interfaces": DB.interfaces })} color="primary">
        Ok
      </Button>
    </DialogActions>
  </Dialog>) ;
}