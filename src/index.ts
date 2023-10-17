import "./styles.scss";

import Slider from "./ts/VersaSlide";
import ControlPanel from "./ts/control-panel";

document.addEventListener('DOMContentLoaded', (event) => {
    const slider = new Slider('#slider-container', {
        loop: false,
        draggable: true
    });

});


