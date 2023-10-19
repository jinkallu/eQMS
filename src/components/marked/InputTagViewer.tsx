export default function InputTagViewer ({ element, order, state, setState }) {
    switch (order) {
        case "first":
            return element.outerHTML;

            break;

        case "middle":
            return (
                <input value={state} onChange={(e) => setState(e.target.value)}></input>
            );
            break;
        case "last":
            return <span>{state}</span>;
        default:
            return <h1>Error</h1>;
            break;
    }
}