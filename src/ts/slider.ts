

export default class VersaSlide {
    private slides: HTMLElement[];
    private container: HTMLElement;
    private index: number;
    private slideWidth: number;
    private slidesContent: HTMLElement[];

    constructor(private containerId: string) {
        this.container = document.querySelector(this.containerId)!;
        this.slidesContent = Array.from(this.container.children) as HTMLElement[];
        this.slides = [];
        this.index = 1; // We start at 1 because 0 is the clone of the last slide
        this.slideWidth = this.container.getBoundingClientRect().width;

        // Initialize slider
        this.initSlides();
        this.showSlide(this.index);
        this.setupEventListeners();
    }
    

    private initSlides() {
        // Clone and append the last slide to the start for infinite loop
        let lastClone = this.slidesContent[this.slidesContent.length - 1].cloneNode(true) as HTMLElement;
        lastClone.style.left = `-${this.slideWidth}px`;
        this.container.insertBefore(lastClone, this.container.firstChild);
        // Clone and append the first slide to the end for infinite loop
        let firstClone = this.slidesContent[0].cloneNode(true) as HTMLElement;
        this.container.appendChild(firstClone);

        (Array.from(this.container.children) as HTMLElement[]).forEach((slide) => {
            slide.classList.add('slide');
            slide.style.width = `${this.slideWidth}px`;
            this.slides.push(slide);
        });

        // Set initial position
        this.container.style.transform = `translateX(-${this.slideWidth}px)`;
    }    

    private showSlide(index: number) {
        let offset = -this.slideWidth * index;
        this.container.style.transform = `translateX(${offset}px)`;
        console.log(offset)
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

    public nextSlide() {
        if (this.index < this.slides.length - 1) {
            this.index++;
            this.showSlide(this.index);
        }
    }

    public prevSlide() {
        if (this.index > 0) {
            this.index--;
            this.showSlide(this.index);
        }
    }

    public setupEventListeners() {
        this.container.addEventListener('transitionend', () => {
            this.adjustInfiniteLoop();
        });
    }

    public getContainer(){
        return this.container;
    }
}