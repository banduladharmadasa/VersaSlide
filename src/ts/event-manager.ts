export default class EventManager {
    private events: Record<string, Function[]> = {};

    /**
     * This method allows to add an event listner
     * @param eventName 
     * @param callback 
     */
    public register(eventName: string, callback: Function) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    /**
     * This method allows to trigger an event
     * @param eventName 
     * @param args 
     */
    public emit(eventName: string, ...args: any[]) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(callback => {
                callback(...args);
            });
        }
    }

    /**
     * This method allows to remove an event
     * @param eventName 
     * @param callback 
     */
    public unregister(eventName: string, callback: Function) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(fn => fn !== callback);
        }
    }
}