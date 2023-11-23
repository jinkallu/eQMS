import { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import useProgramEvaluator from "./useProgramEvaluator";

export default function SliderTagView({
    element,
    order,
    state,
    id,
    handleChange,
}) {

    const [dependStates, setDependStates] = useState({});
    const { dependStateIds, options, evaluate } = useProgramEvaluator();

    function handleChangeFun(e) {
        if (handleChange) {
            handleChange(id, e.target.value);
        }
    }

    useEffect(() => {
        switch (order) {
            case "middle":
                try {
                    let programAttribute = element.getAttribute('program');
                    evaluate(programAttribute);
                }
                catch (error) {
                    console.log(error);
                }
                break;
        }
    }, [])

    // The following code must be executed dynamically, 
    // especially to identify the independant elements.

    useEffect(() => {
        let trigger = false;
        for (let i = 0; i < dependStateIds.length; i++) {
            const key = dependStateIds[i];
            const newValue = state[key];
            const oldValue = dependStates[key];
            if (newValue !== oldValue) {
                trigger = true;
                setDependStates(prevState => ({
                    ...prevState,
                    [key]: newValue,
                }));
            }

        }
        if (trigger) {
            let programAttribute = element.getAttribute('program');
            evaluate(programAttribute);
        }

    }, [state])

    useEffect(() => {
        if (!dependStateIds) {
            return;
        }

        const newDpdStates = {};
        for (let i = 0; i < dependStateIds.length; i++) {
            newDpdStates[dependStateIds[i]] = null;
        }
        console.log(dependStateIds);
        setDependStates(newDpdStates);
    }, [dependStateIds])

    const Separator = styled('div')(
        ({ theme }) => `
    height: ${theme.spacing(3)};
  `,
    );
    /*
        const marks = [
            {
                value: 0,
                label: '0°C',
            },
            {
                value: 1,
                label: '20°C',
            },
            {
                value: 2,
                label: '37°C',
            },
            {
                value: 3,
                label: '100°C',
            },
        ];*/

    function valuetext(value: number) {
        return `${value}°C`;
    }



    let component;
    const val = element.getAttribute("value");
    switch (order) {
        case "first":
            component = (
                <input value={state[id] || val} onChange={handleChangeFun}></input>
            );

            break;
        case "middle":
            const marks = [];
            let min;
            let max;
            let step;


            if (options) {
                const scale = element.getAttribute('scale');
                for (let i = 0; i < options.value?.length; i++) {
                    switch (scale) {
                        case "log":
                            marks.push({ value: Math.log10(options.value[i]), label: options.label?.[i] });
                            break;
                        default:
                            marks.push({ value: options.value[i], label: options.label?.[i] });
                    }
                }

                min = marks.reduce((min, mark) => (mark.value < min ? mark.value : min), marks[0].value);

                max = marks.reduce((max, mark) => (mark.value > max ? mark.value : max), marks[0].value);

                step = Math.abs(max - min) / (marks.length * 10); // needs to be adjusted

            }
            component = (
                <>
                    {options && <Box sx={{ width: 400 }}>
                        <Slider
                            track={false}
                            aria-labelledby="track-false-slider"
                            getAriaValueText={valuetext}
                            defaultValue={min}
                            marks={marks}
                            max={max}
                            min={min}
                            step={step}
                        />
                    </Box>}
                </>
            );
            break;
        case "last":
            console.log(state[id]);

            if (state) {
                if (state[id]) {
                    component = <span>{state[id]}</span>
                }
                else {
                    component = <span>{val}</span>;
                }
            }
            else {
                component = <span>{val}</span>;
            }

            //component = <input value={state[id]} onChange={handleChangeFun}></input>;

            break;
        default:
            component = <span>"Error";</span>;
            break;
    }
    return component;
}
