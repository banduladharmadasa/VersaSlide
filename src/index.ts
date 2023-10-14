import "./styles.scss";

import VersaSlide from "./lib/versaslide";

document.addEventListener('DOMContentLoaded', (event) => {
    
    
    const slider = new VersaSlide('#slider-container');

    document.getElementById('next')!.addEventListener('click', () => {
        slider.nextSlide();
    });

    document.getElementById('prev')!.addEventListener('click', () => {
        slider.prevSlide();
    });

    slider.setupEventListeners();
});
