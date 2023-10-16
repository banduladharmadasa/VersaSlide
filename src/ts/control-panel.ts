import VersaSlide from "./VersaSlide";

/**
 * Add the controls dynamically
 */
export default class Controls {
    private sliderContainer: HTMLElement
    previousWrapper: HTMLDivElement;
    nextWrapper: HTMLDivElement;
    bulletWrapper: HTMLDivElement;
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

        // Create child wrappers to serve as placeholders for the actual buttons.
        this.previousWrapper = this.createControlWrapper(controlsDiv, 'versaslider-controls-previous-wrapper');
        this.nextWrapper = this.createControlWrapper(controlsDiv, 'versaslider-controls-next-wrapper');
        this.bulletWrapper = this.createControlWrapper(controlsDiv, 'versaslider-controls-bullet-wrapper');

        // Append the main wrapper to the container
        container.appendChild(controlsDiv);
        this.createButtons();

    }

    createControlWrapper(parent: HTMLElement, className: string) {
        const div = document.createElement('div');
        div.className = className;
        parent.appendChild(div);
        return div;
    }

    createButton(className: string, id: string): HTMLElement {
        const btn = document.createElement('a');
        btn.classList.add(className);
        btn.setAttribute("id", id);
        return btn;
    }

    createButtons() {
        //create previous button
        const prevBtn = this.createButton("versaslider-controls-previous-button", "versaslider-prev-btn");
        this.previousWrapper.appendChild(prevBtn);
        prevBtn.addEventListener("click", (evt) => {
            this.slider.prevSlide();
            this.activateBullet();
            evt.preventDefault();
        });

        //create next button
        const nextBtn = this.createButton("versaslider-controls-next-button", "versaslider-next-btn");
        this.nextWrapper.appendChild(nextBtn);
        nextBtn.addEventListener("click", (evt) => {
            this.slider.nextSlide();
            this.activateBullet();
            evt.preventDefault();
        });

        //create bullet buttons (dots)
        const count = this.slider.getActualSlidesCount();
        for (let i = 0; i < count; i++) {
            const dot = this.createButton("versaslider-controls-bullet", "versaslider-bullet-" + i);
            this.bulletWrapper.appendChild(dot);
            dot.addEventListener("click", (evt) => {
                this.slider.moveTo(i);
                evt.preventDefault();
            });

        }


    }

    activateBullet(){
        const index = this.slider.getCurrentIndex();

        (Array.from(this.bulletWrapper.childNodes) as HTMLElement[]).forEach((node, i) => {
            if(index !== i){
                node.classList.remove("active");
            } else{
                node.classList.add("active");
            }
            
        });

    }

}

