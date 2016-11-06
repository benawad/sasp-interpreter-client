import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import '../semantic/dist/semantic.min.css'
import fetch from 'isomorphic-fetch';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {value: '', output: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const url = "http://localhost:3000/sample/query";

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

  handleSubmit(event) {
    this.request(this.state.value).then(
      (data) => {
        console.log(data)
        this.setState({output: data.output});
      } 
    )
  }

  render() {
    return (
      <div>
        <div className="ui fluid action input">
          <input value={this.state.value} onChange={this.handleChange} type="text" placeholder="Search..."/>
          <div onClick={this.handleSubmit} className="ui button">Search</div>
        </div>  
        <div className="ui visible message">
          <p>{this.state.output}</p>
        </div>
      </div>
    );
  }
}

export default App;
