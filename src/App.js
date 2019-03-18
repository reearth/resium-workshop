import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import { Cartesian3 } from 'cesium';
import { Viewer, Entity } from 'resium';

class App extends Component {
  render() {
    return (
      <Viewer full>
        <Entity position={Cartesian3.fromDegrees(61, 130, 100)} point={{ pixelSize: 10 }} />
      </Viewer>
    );
  }
}

export default hot(module)(App);
