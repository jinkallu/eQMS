export abstract class AbstractCustomTag {
    // An abstract method that must be overridden
    abstract registerCondition(): void;
    abstract parse(element: Element, container_id: string): Promise<HTMLElement | null>;
    
}

export default AbstractCustomTag;