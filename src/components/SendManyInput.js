import React, {useState} from 'react';

 
export function SendManyInput({ onKeyUp, key }) {
  
  
  return (
    
    <div key={key}>
      <div className="row">
        <div className="col-md-12 col-xs-12 col-lg-12 text-right pb-2">
          <input onClick={ () => this.appendInput() }type="button" value="Add New Field" class="btn btn-primary" id="addNewField"/>
          <br/>
        </div>
      </div>
      <div  className="row">
        <div className="col-md-5 col-xs-5 col-lg-5">
          <div className="form-label-group">
            <input onKeyUp={onKeyUp} type="text" className="form-control" placeholder="ST00..." required="" autofocus=""/>
            <label for="inputEmail">Wallet Address #1</label>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 col-lg-3">
          <div className="form-label-group">
            <input onKeyUp={onKeyUp} type="text" className="form-control" placeholder="ST00..." required="" autofocus=""/>
            <label for="inputEmail">Memo Tag #1</label>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 col-lg-3">
          <div className="form-label-group">
            <input onKeyUp={onKeyUp} type="text" maxlength="10" className="form-control" placeholder="ST00..." required="" autofocus=""/>
            <label for="inputEmail">Amount #1</label>
          </div>
        </div> 
        <div className="col-md-1 col-xs-1 col-lg-1">
          <div className="form-label-group">
          <input type="button" class="removeField btn btn-danger btn-sm" value="X"/>
          </div>
        </div>
      </div>

      <div  className="row">
        <div className="col-md-5 col-xs-5 col-lg-5">
          <div className="form-label-group">
            <input onKeyUp={onKeyUp} type="text" className="form-control" placeholder="ST00..." required="" autofocus=""/>
            <label for="inputEmail">Wallet Address #2</label>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 col-lg-3">
          <div className="form-label-group">
            <input onKeyUp={onKeyUp} type="text" className="form-control" placeholder="ST00..." required="" autofocus=""/>
            <label for="inputEmail">Memo Tag #2</label>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 col-lg-3">
          <div className="form-label-group">
            <input onKeyUp={onKeyUp} type="text" maxlength="10" className="form-control" placeholder="ST00..." required="" autofocus=""/>
            <label for="inputEmail">Amount #2</label>
          </div>
        </div> 
        <div className="col-md-1 col-xs-1 col-lg-1">
          <div className="form-label-group">
          <input type="button" class="removeField btn btn-danger btn-sm" value="X"/>
          </div>
        </div>
      </div>
      <div  className="row">
        <div className="col-md-5 col-xs-5 col-lg-5">
          <div className="form-label-group">
            <input onKeyUp={onKeyUp} type="text" className="form-control" placeholder="ST00..." required="" autofocus=""/>
            <label for="inputEmail">Wallet Address #3</label>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 col-lg-3">
          <div className="form-label-group">
            <input onKeyUp={onKeyUp} type="text" className="form-control" placeholder="ST00..." required="" autofocus=""/>
            <label for="inputEmail">Memo Tag #3</label>
          </div>
        </div>
        <div className="col-md-3 col-xs-3 col-lg-3">
          <div className="form-label-group">
            <input onKeyUp={onKeyUp} type="text" maxlength="10" className="form-control" placeholder="ST00..." required="" autofocus=""/>
            <label for="inputEmail">Amount #3</label>
          </div>
        </div> 
        <div className="col-md-1 col-xs-1 col-lg-1">
          <div className="form-label-group">
          <input type="button" class="removeField btn btn-danger btn-sm" value="X"/>
          </div>
        </div>
      </div>
      </div> 
    
    
  );
  const [Rows, SetRows] = useState(Array())

}
