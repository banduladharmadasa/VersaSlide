import VersaSlide from "./slider";

/**
 * Add the controls dynamically
 */
export default class Controls {
    private sliderContainer: HTMLElement
    previousWrapper: HTMLDivElement;
    nextWrapper: HTMLDivElement;
    indexWrapper: HTMLDivElement;
    constructor(private slider: VersaSlide) {


    }

    public createControls(): void {
        // Check if container exists in the DOM
        const container = this.slider.getContainer().parentElement;
        if (!container) {
            console.error('The container does not exist in the DOM');
            return;
        }

        // Create the main wrapper div with its class
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'controls';


        this.previousWrapper = this.createControlWrapper(controlsDiv, 'versaslider-controls-previous-wrapper', "<");
        this.nextWrapper = this.createControlWrapper(controlsDiv, 'versaslider-controls-next-wrapper', ">");
        this.indexWrapper = this.createControlWrapper(controlsDiv, 'versaslider-controls-index-wrapper', "...");



        // Append the main wrapper to the container
        container.appendChild(controlsDiv);

        this.setupEventListners();
    }

    createControlWrapper(parent: HTMLElement, className: string, icon: string) {
        const div = document.createElement('div');
        div.className = className;
        div.textContent = icon;
        parent.appendChild(div);
        return div;
    }



    setupEventListners() {
        document.getElementById('next')!.addEventListener('click', () => {
            this.slider.nextSlide();
        });

        document.getElementById('prev')!.addEventListener('click', () => {
            this.slider.prevSlide();
        });

    }
}

