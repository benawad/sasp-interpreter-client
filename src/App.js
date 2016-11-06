import React, { Component } from 'react';
import logo from './logo.svg';
import '../semantic/dist/semantic.min.css'
import fetch from 'isomorphic-fetch';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import './App.css';

class MyDropZone extends Component {


    constructor(props) {
      super(props);
      this.onDrop = this.onDrop.bind(this);
    }

    onDrop (acceptedFiles, rejectedFiles) {
      const url = acceptedFiles[0].preview;
      request.get(url).end((err, res) => {
        request
          .post("http://localhost:3000/"+this.props.pname+"/upload")
          .send({text: res.text})
          .end((err, res) => {
            this.props.upsucc(acceptedFiles[0].name);
            console.log(res);
            console.log(err);
          })
      });
    }

    render () {
      return (
          <div className="fileupload" >
            <Dropzone multiple={false} onDrop={this.onDrop}>
              <div>Upload your Sasp file here</div>
            </Dropzone>
          </div>
      );
    }
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {value: '', output: [], fileupload: false, fname: "", pname: ""};
    this.handleChange = this.handleChange.bind(this);
    this.handlePName = this.handlePName.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.uploadSuccess = this.uploadSuccess.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit() {
    const url = "http://localhost:3000/"+this.state.pname+"/query";

    request
      .post(url)
      .send({"query": this.state.value})
      .end((err, resp) => {
        const data = JSON.parse(resp.text);
        const outputs = this.state.output.slice();
        outputs.unshift([this.state.value, data.output, data.success]);
        this.setState({value: "", output: outputs});
      })
  }

  keyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  handlePName(e) {
    this.setState({pname: e.target.value});
  }

  uploadSuccess(name) {
    this.setState({fileupload: true, fname: name});
  }

  render() {
    return (
      <div>

        <h1>Project:</h1>
        <div>
          <div className="ui input">
            <input onChange={this.handlePName} type="text" />
          </div>  
        </div>
        
        <MyDropZone upsucc={this.uploadSuccess} pname={this.state.pname} />

        <div className={(this.state.fileupload ? "" : "hidden") + " ui inverted progress success"}>
          <div className="label">{this.state.fname} uploaded successfully!</div>
        </div>

        <div className="ui labeled input fluid">
          <div className="ui label">?-</div>
          <input onKeyPress={this.keyPress} value={this.state.value} onChange={this.handleChange} type="text" />
        </div>  
          {this.state.output.map((x, i) =>
            <div key={i} className="ui cards">
              <div className={(x[2] ? 'green' : 'red') + " card fluid"}>
                <div className="content">
                    <div className="header">{x[0]}</div>
                    <div className="description"><p>{x[1]}</p></div>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
}

export default App;
