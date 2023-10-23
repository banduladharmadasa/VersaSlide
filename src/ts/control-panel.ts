import VersaSlide from "./versa-slide";

/**
 * Add the controls dynamically
 */
export default class Controls {
    previousWrapper: HTMLDivElement;
    nextWrapper: HTMLDivElement;
    bulletWrapper: HTMLDivElement;
    isDragging: boolean;
    posXBeforeDrag: number;

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

        if (this.slider.isDraggable()) {
            this.enableDragging();
        }

        this.addEventHandlers();
    }

    addEventHandlers() {
        if (this.slider.getOptions().showBullets) {
            this.slider.eventManager.register("activatebullet", (index: number) => {
                const bullets = this.bulletWrapper.childNodes;
                for (let i = 0; i < bullets.length; i++) {
                    if (i === index) {
                        (bullets[i] as HTMLElement).classList.add("active");
                    } else {
                        (bullets[i] as HTMLElement).classList.remove("active");
                    }
                }
            });
        }


    }

    enableDragging() {
        const container = this.slider.getContainer();
        this.isDragging = false;
        let offsetX: number;

        container.addEventListener("mousedown", (e) => {
            this.isDragging = true;
            this.posXBeforeDrag = container.getBoundingClientRect().left;
            offsetX = e.clientX - this.posXBeforeDrag;            
        });

        container.addEventListener("mousemove", (e) => {
            container.style.cursor = this.slider.getOptions().mouseOverCursor;
            if (!this.isDragging) return;
            container.style.cursor = this.slider.getOptions().draggingCursor;
            const newX = e.clientX - offsetX;
            container.style.transform = `translateX(${newX}px)`;
        });

        container.addEventListener("mouseup", (evt) => {
            this.completeDragging();
        });

        container.addEventListener("dragstart", (e) => {
            e.preventDefault();
        })
    }

    completeDragging() {
        const container = this.slider.getContainer();
        this.isDragging = false;
        const posXAfterDrag = container.getBoundingClientRect().left;
        if ( posXAfterDrag < this.posXBeforeDrag) {
            this.slider.nextSlide();
        } else {
            this.slider.prevSlide();
        }

        container.style.cursor = 'default';
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

        prevBtn.addEventListener('mouseup', (e) => {     
            if(this.isDragging){
                this.completeDragging();                
            }  
            e.preventDefault();
        })

        //create next button
        const nextBtn = this.createButton("versaslider-controls-next-button", "versaslider-next-btn");
        this.nextWrapper.appendChild(nextBtn);
        nextBtn.addEventListener("click", (evt) => {
            this.slider.nextSlide();
            this.activateBullet();
            evt.preventDefault();
        });

        nextBtn.addEventListener('mouseup', (e) => {
            if(this.isDragging){
                this.completeDragging();                
            } 
            e.preventDefault();      
        })

        //create bullet buttons (dots)
        if (this.slider.getOptions().showBullets) {
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


    }

    activateBullet() {
        const index = this.slider.getCurrentIndex();

        (Array.from(this.bulletWrapper.childNodes) as HTMLElement[]).forEach((node, i) => {
            if (index !== i) {
                node.classList.remove("active");
            } else {
                node.classList.add("active");
            }

        });

    }

}

