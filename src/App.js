import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../semantic/dist/semantic.min.css'
import fetch from 'isomorphic-fetch';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {value: '', output: []};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.keyPress = this.keyPress.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  checkStatus(response) {
    return new Promise((resolve, reject) => {
      if (response.status >= 200 && response.status < 300) {
        resolve(response);
      } else {
        return response.json().then((error) => {
          reject(new Error(error.message || error.name));
        });        
      }
    });
  }

  request(query) {
    const url = "http://192.168.0.109:3000/sample/query";

    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"query": query})
    }).then(this.checkStatus)
      .then((response) => {
        return response.json();
      });
  }

  handleSubmit() {
    this.request(this.state.value).then(
      (data) => {
        console.log(data)
        const outputs = this.state.output.slice();
        outputs.unshift([this.state.value, data.output, data.success]);
        this.setState({value: "", output: outputs});
      } 
    )
  }

  keyPress(e) {
    if (e.key === 'Enter') {
      this.handleSubmit();
    }
  }

  render() {
    return (
      <div>
        <div className="ui labeled input fluid">
          <div className="ui label">?-</div>
          <input onKeyPress={this.keyPress} value={this.state.value} onChange={this.handleChange} type="text" />
        </div>  
          {this.state.output.map((x, i) =>
            <div key={i} className="ui cards fluid">
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
