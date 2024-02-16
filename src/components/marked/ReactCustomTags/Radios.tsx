import { useExtnStore } from "../../../zustand/store";

export default function Radios({ id, options }) {
  const { setTemplateState } = useExtnStore((state) => state);
  function handleChangeFun(e) {
    setTemplateState(id, {
      value: e.target.value,
      label: e.target.dataset.label,
    });
  }

  return (
    <>
      {options &&
        options.value &&
        Array.isArray(options.value) &&
        options.value?.map((option, index) => (
          <label key={option}>
            <input
              type="radio"
              value={option.textContent.trim()}
              onChange={(e) => {
                e.nativeEvent.stopImmediatePropagation();
                handleChangeFun(e);
                // Additional logic if needed
              }}
              onInput={handleChangeFun}
              checked={index === 0}
              id={id}
              data-label={options.label?.[index].textContent.trim()}
            />
            {options.label?.[index].textContent.trim()}
          </label>
        ))}
    </>
  );
}
