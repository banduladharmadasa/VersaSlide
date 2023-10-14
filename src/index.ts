import "./styles.scss";

import Slider from "./ts/slider";
import ControlPanel from "./ts/control-panel";

document.addEventListener('DOMContentLoaded', (event) => {
    const slider = new Slider('#slider-container');
    const controlPanel = new ControlPanel(slider);
    controlPanel.createControls();
});


