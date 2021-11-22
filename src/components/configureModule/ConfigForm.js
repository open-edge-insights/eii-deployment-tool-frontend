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

import React, { createRef, useState, useEffect } from 'react';
import './ConfigForm.css';
import _ from 'lodash';

import Button from '@material-ui/core/Button';
import Modal from 'react-awesome-modal';
import CloseIcon from '@material-ui/icons/Close';
var o_cfg = null;
var cfg = null;
var ki = 0;
var objectkey = [];

Object.size = function (obj) {
  var size = 0,
    key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
var refrence = [];
var i = 0;


export var ConfigForm = (props) => {
  const { DB, main_title, open, onConfigCancel, onConfigOK } = props;
  var [data, setData] = useState({});
  var [selectValue, setSelectedValue] = useState([]);
  var [selectTab, setSelectTab] = useState('');
  useEffect(() => {
    var NEW_DATA = _.cloneDeep(DB);
    setData({ ...NEW_DATA });
    console.log("DB value:",DB);
  }, [DB]);
  

  var processDict = (c) => {
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
  };

  var filter = (key) => {
    var key1 = typeof key === 'string' ? key.replace(/\d+$/, '').slice(0, -1) : "";
    return key1;
  };

  var onSelect = (selboxId, key) => {
    var selElem = document.getElementById(selboxId);
    var seleted_value = { ...selectValue };
    if (selElem.selectedIndex > 0) {
      var index = _.findIndex(seleted_value, (el, index) => {
            return index === removeNo(key);
      });

      if (index === -1) {
        seleted_value[removeNo(key)] = selElem.selectedIndex;

        setSelectedValue(seleted_value);
      }

      openTab([key, key + '_' + selElem.selectedIndex]);
    } else {
      delete seleted_value[removeNo(key)];
      setSelectedValue(seleted_value);
    }
  };

  var deleteEntry = (id, key, withKey) => {
    var sel = document.getElementById(id);
   
    let i = sel.selectedIndex;

    if (i > 0) {
      sel.remove(i);
      var NEW_DATA = { ...data };
      DeleteInSelectObject(NEW_DATA, withKey, i);
      setData(NEW_DATA);
      openTab([key]);
    }
  };

  var deleteListEntry = (id) => {
    var sel = document.getElementById(id);
    let i = sel.selectedIndex;
    if (i >= 0) {
      sel.remove(i);
    }
  };

  var getMaxTextWidth = (form) => {
    var kw = 0;
    for (let key in form) {
      let w = getTextWidth(key);
      if (w > kw) {
        kw = w;
      }
    }
    return kw;
  };

  var addListEntry = (id, withKey) => {
    var inp = prompt('New entry: ', '');
    if (inp === null || inp === '') {
      return;
    }
  
    _AddInSelect(withKey, inp);
  
  };

  var removeNo = (key) => {
    var a = key.split('_');
    if (a.length > 1) {
      a.pop();
      return a.join('_');
    }
    return a[0];
  };
  var addEntry = async (id, key, withKey) => {
    var sel = document.getElementById(id);
    let n = sel?.options?.length;
 

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
          if (sel.options[j].text === str) {
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

    
      var NEW_DATA = _.cloneDeep(DB);
      _AddInSelect(withKey, getValue({ ...NEW_DATA }, withKey));
  
    }
  };

  var getTextWidth = (str) => {
    var text = document.createElement('span');
    document.body.appendChild(text);

    text.style.fontSize = 12 + 'px';
    text.style.height = 'auto';
    text.style.width = 'auto';
    text.style.position = 'absolute';
    text.style.whiteSpace = 'no-wrap';
    text.innerHTML = str;

    var width = Math.ceil(text.clientWidth);
    text.remove();
    return width + 5;
  };
  // enter a value in text or check box
  var change = (obj, prop, newValue) => {
    var a = prop.split('.');

    a = _.map(a, (e) => {
      return removeNo(e);
    });

    return (function f(o, v, i) {
      if (i === a.length - 1) {
        o[a[i]] = v;
        return o;
      }
      return f(o[a[i]], v, ++i);
    })(obj, newValue, 0);
  };

 
  const _onchange = (key, e) => {
    var value = e.target.value;
    var NEW_DATA = _.cloneDeep(data);
    if (value === true || value === 'true') {
      value = true;
    } else if (value === false || value === 'false') {
      value = false;
    }

    var result = change(NEW_DATA, key, value);
    setData(NEW_DATA);
  
  };
  var AddInSelectObject = (obj, prop, newValue) => {
    var a = prop.split('.');

    a = _.map(a, (e) => {
      return e.split('_')[0];
    });

    return (function f(o, v, i) {
      if (i === a.length - 1) {
        if (isJson(v)) {
          o[a[i]].push(v);
        } else {
          o[a[i]].push(v);
        }
        return o;
      }
      return f(o[a[i]], v, ++i);
    })(obj, newValue, 0);
  };

  var isJson = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return false;
    }
  };

  var DeleteInSelectObject = (obj, key, index) => {
    var a = key.split('.');

    a = _.map(a, (e) => {
      return e.split('_')[0];
    });

    return (function f(o, index, i) {
      if (i === a.length - 1) {
        delete o[a[i]][index];
        return o;
      }
      return f(o[a[i]], index, ++i);
    })(obj, index, 0);
  };

  var getValue = (obj, prop) => {
    var a = prop.split('.');

    a = _.map(a, (e) => {
      return removeNo(e);
    });

    return (function f(o, i) {
      if (i === a.length - 1) {
        if (Array.isArray(o[a[i]])) {
          return o[a[i]][0];
        } else {
          return o[a[i]];
        }
      }
      return f(o[a[i]], ++i);
    })(obj, 0);
  };

  var _AddInSelect = (withKey, value) => {
    var NEW_DB = _.cloneDeep(data);

    var result = AddInSelectObject(NEW_DB, withKey, value);
    setData({ ...NEW_DB });
  
  };

  var getElement = (key, value, keyWidth = 0, withKey = '') => {
    var html = [];
    var _view = [];
    if (typeof value == 'object' && Array.isArray(value)) {
      let ks = keyWidth > 0 ? { width: `${keyWidth}px` } : {};

      var valueIsObj = typeof value[0] == 'object';
      if (!valueIsObj) {
        let opt = [];

        for (let i = 0; i < value.length; i++) {
          opt.push(
            <option key={i} value={value[i]}>
              {value[i]}
            </option>
          );
        }

    
        _view.push(
          <div className='div-table-col-val'>
            <select
              size={value.length}
              id={`${key}_select`}
              name={key}
              width="100"
            >
              {opt}
            </select>
            &nbsp;&nbsp;&nbsp;
            <input type='button' onClick={() => deleteListEntry(key + '_select', withKey)} defaultValue={' - '} />
            &nbsp;&nbsp;&nbsp;
            <input type='button' onClick={() => addListEntry(key + '_select', withKey)} defaultValue={' + '} />
          </div>
        );
      } else {
        let opt = [];

        for (let i = 0; i < value.length; i++) {
          opt.push(<option key={i} value={JSON.stringify(value[i])}>{`${filter(key)}#${i + 1}`}</option>);
        }

        _view.push(
          <>
            <select
               id={`${key}_select`}
              name={key}
              onChange={() => onSelect(`${key}_select`, key)}
              width="100"
            >
              <option value=''>-----Select item -----</option>
              {opt}
            </select>
            &nbsp;&nbsp;&nbsp;
            <input type='button' onClick={() => deleteEntry(`${key}_select`, key, withKey)} defaultValue={' - '} />
            &nbsp;&nbsp;&nbsp;
            <input
              type='button'
              onClick={() => {
                addEntry(`${key}_select`, key, withKey);
              }}
              defaultValue={' + '}
            />
          </>
        );

        for (let i = 0; i < value.length; i++) {
          _view.push(
            <div
              id={`${key}_${i + 1}`}
              className='tabcontent'
              key={i}
              style={{ display: isShow2(key, i + 1) ? 'block' : 'none' }}
            >
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
            onBlur={(e) => _onchange(withKey, e)}
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
            onBlur={(e) => _onchange(withKey, e)}
            data-objectkey={withKey}
          />
        );
      } else if (typeof value == 'boolean') {
        opt.push(
          <input
            type='checkbox'
            id={key}
            defaultChecked={value}
            key={key}
            onBlur={(e) => _onchange(withKey, e)}
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
  };

  var openTab = (tabs, evt = null) => {
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
      }
    } else {
      document.getElementById(tabs).style.display = 'block';
      document.getElementById(tabs).className += " active"
     
    }
    if (evt) {
   
      tablinks = document.getElementsByClassName('tablinks');
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(' active', '');
      }
      evt.currentTarget.className += ' active';
    }
  };
  const isShow = (key) => {
    var index = _.findIndex(selectValue, (el, index) => {
      return index === removeNo(key);
    });
    if (removeNo(selectTab) === removeNo(key) && index !== -1 && index != undefined) {
      return true;
    } else if (removeNo(selectTab) === removeNo(key)) {
      return true;
    }
   
    return false;
  };

  const isShow2 = (key, no) => {
    var val = _.find(selectValue, (el, index) => {
      return index === removeNo(key);
    });

    if (removeNo(selectTab) === removeNo(key) && val === no) {
      return true;
    }

    return false;
  };

  o_cfg = { ...data };
  var html = [];
  var cfg_copy = JSON.parse(JSON.stringify(o_cfg));
  var config = processDict(cfg_copy.config);

  var ifs = processDict(cfg_copy.interfaces);
  var objs = [config, ifs];

  var keys = ['config', 'interfaces'];
  for (let i = 0; i < objs.length; i++) {
    var obj = objs[i];
    let btn = [];

    for (var key in obj) {
      btn.push(
        <button
          className='tablinks'
          data-id={key}
          onClick={(e) => {
          
            setSelectTab(e.target.getAttribute('data-id'));
            
          }}
        >
          {filter(key)}
        </button>
      );
    }

    html.push(
      <div className='tab'>
        {btn}
      </div>
    );

    for (var key in obj) {
      var value = obj[key];
    
    
      html.push(
        <div
          id={key}
         
          className='tabcontent'
          style={{
            display: isShow(key) ? 'block' : 'none',
          }}
        >
          {getElement(key, value, 0, `${keys[i]}.${key}`)}
        </div>
      );
    }
   
  }

  return (
    <div
      className='sideBare'
      style={{
        width: ' 45%',
        position: 'absolute',
        top: '0',
        background: '#fff',
        right: "-385px",
        //left:"710px",
        boxShadow: 'rgb(0 0 0 / 33%) -1px 0px 0px 0px',
        height: '100%',
        overflow: 'hidden',
        border:'1px solid #707070',
        borderRadius:'5px',
        fontSize:'12px'
      }}
    >
      <div style={{ justifyContent: 'center', alignContent: 'space-around', paddingLeft:10 }}>
        <div>
          <h5>{main_title} Configuration</h5>
        </div>
       
      </div>
      <hr></hr>
    
       <div style={{height:428, overflow: 'scroll',  paddingLeft:10}}>{html}
      </div>
      <br/>
       <div style={{ width: '100%', paddingLeft:10, height: 70,  background: '#fff', float: "right" }}>
        <Button
          onClick={(e) => onConfigOK(e, { config: data.config, interfaces: data.interfaces })}
          variant='contained'
          color='successs'
        >
          Save
        </Button>
       
      </div>
      
    </div>
    
  );
};

export default ConfigForm;


