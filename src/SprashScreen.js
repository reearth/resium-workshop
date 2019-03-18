import React from "react";
import { CSSTransition } from "react-transition-group";
import { CameraFlyToBoundingSphere } from "resium";
import { BoundingSphere, Cartesian3, HeadingPitchRange, Math as CesiumMath } from "cesium";

const seriesTimeout = items => {
  const timeouts = items.map((item, i) =>
    setTimeout(item[0], item[1] + (i === 0 ? 0 : items[i - 1][1]))
  );
  return () => timeouts.forEach(t => clearTimeout(t));
};

const center = new BoundingSphere(Cartesian3.fromDegrees(140, 35.7, 0), 0);

class SplashScreen extends React.PureComponent {
  state = {
    show: false,
    camera: null,
  };

  componentDidMount() {
    this.clearTimeout = seriesTimeout([
      [() => this.setState({ show: true }), 0],
      [() => this.setState({
        show: false,
        camera: {
          boundingSphere: center,
          offset: new HeadingPitchRange(0, CesiumMath.toRadians(-90), 200000),
          duration: 2
        }
      }), 2000],
      [() => this.setState({
        camera: {
          boundingSphere: center,
          offset: new HeadingPitchRange(0, CesiumMath.toRadians(-30), 80000),
          duration: 3
        }
      }), 3500],
      [() => this.setState({ camera: null }), 3000],
    ]);
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  render() {
    return (
      <>
        {this.state.camera && (
          <CameraFlyToBoundingSphere
            boundingSphere={this.state.camera.boundingSphere}
            offset={this.state.camera.offset}
            duration={this.state.camera.duration} />
        )}
        <CSSTransition
          in={this.state.show}
          timeout={1000}
          classNames="splashscreen"
          mountOnEnter
          unmountOnExit>
          {() => (
            <div className="splashscreen">
              <h1>Hello</h1>
            </div>
          )}
        </CSSTransition>
      </>
    );
  };
}

export default SplashScreen;
