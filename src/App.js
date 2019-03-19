import React from 'react';
import { hot } from 'react-hot-loader';
import {
  Cartesian3,
  createOpenStreetMapImageryProvider,
  createWorldImagery,
  BoundingSphere
} from 'cesium';
import { Viewer, ImageryLayerCollection, ImageryLayer, KmlDataSource, Entity, EntityDescription } from 'resium';
import SplashScreen from './SprashScreen';

const imageryProvider = createOpenStreetMapImageryProvider({
  url: 'http://www.finds.jp/ws/tmc/1.0.0/Kanto_Rapid-900913-L/',
  ext: "jpg",
  zmin: 0,
  zmax: 18,
  credit: 'CC BY 国立研究開発法人農業環境技術研究所 歴史的農業環境閲覧システム',
});

const defaultImageryProvider = createWorldImagery();

class App extends React.PureComponent {
  viewerRef = React.createRef();

  state = {
    tileAlpha: 100
  };

  handleSelectedEntityChanged = () => {
    if (!this.viewerRef.current || !this.viewerRef.current.cesiumElement) {
      return;
    }
    const viewer = this.viewerRef.current.cesiumElement;
    const selectedEntity = viewer.selectedEntity;
    if (selectedEntity) {
      viewer.camera.flyToBoundingSphere(
        new BoundingSphere(selectedEntity.position.getValue(viewer.clock.currentTime), 1000),
        { duration: 1 }
      );
    }
  };

  handleKmlLoad = (dataSource) => {
    dataSource.entities.values.forEach(e => {
      e.label = undefined;
    });
  };

  render() {
    return (
      <Viewer
        full
        animation={false}
        timeline={false}
        baseLayerPicker={false}
        ref={this.viewerRef}
        onSelectedEntityChange={this.handleSelectedEntityChanged}>
        <ImageryLayerCollection>
          <ImageryLayer imageryProvider={defaultImageryProvider} />
          <ImageryLayer imageryProvider={imageryProvider} alpha={this.state.tileAlpha / 100} />
        </ImageryLayerCollection>
        <KmlDataSource
          data={process.env.PUBLIC_URL + "/doc.kml"}
          onLoad={this.handleKmlLoad} />
        <Entity
          name="Hello"
          position={Cartesian3.fromDegrees(140, 35.7, 0)}
          point={{ pixelSize: 20 }} >
          <EntityDescription>
            <h1>hello world</h1>
            <p>test</p>
          </EntityDescription>
        </Entity>
        <div className="tile-alpha-slider">
          <input
            type="range"
            min="0"
            max="100"
            value={this.state.tileAlpha}
            onChange={e => this.setState({ tileAlpha: parseInt(e.currentTarget.value, 10) })} />
        </div>
        <SplashScreen />
      </Viewer>
    );
  }
}

export default hot(module)(App);
