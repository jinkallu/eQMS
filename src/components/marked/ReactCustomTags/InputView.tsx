
import React, { useEffect, useRef } from 'react';

function InputView({ node, view, getPos }) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.addEventListener('input', handleInput);
        }

        return () => {
            if (inputRef.current) {
                inputRef.current.removeEventListener('input', handleInput);
            }
        };
    }, []);

    function handleInput() {
        const pos = getPos();
        const tr = view.state.tr.setNodeMarkup(pos, null, { id: node.attrs.id, value: inputRef.current.value });
        view.dispatch(tr);
    }

    return (
        <input
            ref={inputRef}
            type="text"
            defaultValue={node.attrs.value}
            id={node.attrs.id}
        />
    );
}

export default InputView;
