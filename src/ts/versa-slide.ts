
import ControlPanel from "./control-panel";

interface VersaSlideOptions {
    autoPlay?: boolean;
    autoPlaySpeed?: number,//in milli  seconds
    draggable?: boolean,
    loop?: boolean,


};

export default class VersaSlide {
    private slides: HTMLElement[];
    private container: HTMLElement;
    private index: number;
    private slideWidth: number;
    private slidesContent: HTMLElement[];
    private options: VersaSlideOptions = {};
    private autoPlayTimerId: NodeJS.Timeout | undefined;
    private autoPlaySpeed: number;
    private callback: ((data: any) => void) | undefined;

    constructor(private containerSelector: string, options: VersaSlideOptions = {}) {
        this.initOptions(options);
        this.container = document.querySelector(this.containerSelector)!;
        this.slidesContent = Array.from(this.container.children) as HTMLElement[];
        this.slides = [];
        // When the loop option is enabled, we begin at 1 since 0 represents the clone
        // of the first slide
        this.index = this.options.loop ? 1 : 0;
        this.slideWidth = this.container.getBoundingClientRect().width;

        // Initialize slider
        this.initSlides();


        const controlPanel = new ControlPanel(this);
        controlPanel.createControls();

        //Finally show slide
        this.showSlide(this.index);

        if (this.options.autoPlay) {
            this.startAutoPlay();
        }
    }

    registerShowSlideCallback(callback: (index: number) => void) {
        this.callback = callback;
    }

    invokeShowSlideCallback(index: number) {
        if (this.callback) {
            this.callback(index);
        } else {
            console.log("Callback is not registered.");
        }
    }

    public setAutoPlaySpeed(speed: number) {
        this.options.autoPlaySpeed = speed;
    }

    public startAutoPlay() {
        this.autoPlayTimerId = setInterval(() => {
            this.nextSlide();
        }, this.options.autoPlaySpeed);
    }

    public stopAutoPlay() {
        if (this.autoPlayTimerId) {
            clearTimeout(this.autoPlayTimerId);
        }
    }

    /**
     * Initialize option values with user-provided values
     * @param options 
     */
    private initOptions(options: VersaSlideOptions) {
        this.options.loop = options.loop || false;
        this.options.draggable = options.draggable || false;
        this.options.autoPlay = options.autoPlay || false;
        this.options.autoPlaySpeed = options.autoPlaySpeed || 250;
    }

    /**
     * 
     */
    private initSlides() {
        if (this.options.loop) {
            this.prepareForInfiniteLoop();
        }


        (Array.from(this.container.children) as HTMLElement[]).forEach((slide) => {
            slide.classList.add('slide');
            slide.style.width = `${this.slideWidth}px`;
            this.slides.push(slide);
        });

    }

    private prepareForInfiniteLoop() {
        // Clone and append the last slide to the start for infinite loop
        let lastClone = this.slidesContent[this.slidesContent.length - 1].cloneNode(true) as HTMLElement;
        lastClone.style.left = `-${this.slideWidth}px`;
        this.container.insertBefore(lastClone, this.container.firstChild);
        // Clone and append the first slide to the end for infinite loop
        let firstClone = this.slidesContent[0].cloneNode(true) as HTMLElement;
        this.container.appendChild(firstClone);
        firstClone.classList.add("cloned-first");
        lastClone.classList.add("cloned-last");

        this.setupEventListeners();

        // Set initial position
        this.container.style.transform = `translateX(-${this.slideWidth}px)`;
    }

    private showSlide(index: number) {
        let offset = -this.slideWidth * index;
        this.container.style.transform = `translateX(${offset}px)`;
        this.invokeShowSlideCallback(this.index);
    }

    private adjustInfiniteLoop() {
        if (this.index === this.slides.length - 1) {
            // Jump to the first (clone) slide
            this.index = 1;
            this.container.style.transition = 'none';
            this.showSlide(this.index);
            // Trigger reflow to apply the transition
            void this.container.offsetHeight;
            this.container.style.transition = '';
        } else if (this.index === 0) {
            // Jump to the last (clone) slide
            this.index = this.slides.length - 2;
            this.container.style.transition = 'none';
            this.showSlide(this.index);
            // Trigger reflow to apply the transition
            void this.container.offsetHeight;
            this.container.style.transition = '';
        }
    }

    /**
     * Move to the nex slide
     */
    public nextSlide() {
        if (this.index < this.slides.length - 1) {
            this.index++;
            this.showSlide(this.index);
        }
    }

    /**
     * Move to the previous slide
     */
    public prevSlide() {
        if (this.index > 0) {
            this.index--;
            this.showSlide(this.index);
        }
    }


    /**
     * Move to a specified slide
     * @param index : the slide index
     */
    moveTo(index: number) {
        this.index = index;
        if (this.options.loop) {
            this.index++;
        }
        this.showSlide(this.index);
    }

    public setupEventListeners(): void {
        this.container.addEventListener('transitionend', () => {
            this.adjustInfiniteLoop();
        });
    }

    public getContainer(): HTMLElement {
        return this.container;
    }

    public getActualSlidesCount(): number {
        return this.slides.filter((slide) => !(slide.classList.contains('cloned-last') || slide.classList.contains('cloned-first'))).length;
    }

    public getCurrentIndex(): number {
        let index = this.index;

        if (this.options.loop) {
            if (this.index < this.slides.length - 1) {
                index--;
            } else if (this.index > 0) {
                index++;
            }
        }


        return index;
    }

    public getSlideWidth() {
        return this.slideWidth;
    }

    public isDraggable() {
        return this.options.draggable;
    }
}