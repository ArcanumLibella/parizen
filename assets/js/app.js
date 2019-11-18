// any CSS you require will output into a single css file (app.css in this case)
require('../css/app.scss');
require('../icons/svgxuse.js');

import React from 'react';
import ReactDOM from 'react-dom';

import Welcome from './Components/Welcome';


class App extends React.Component {
  render() {
    return (
      <Welcome></Welcome>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));