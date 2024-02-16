import { useExtnStore } from "../../../../zustand/store";

export default function DisplayTable({ id, options }) {
  const { templateState, setTemplateState } = useExtnStore((state) => state);
  function handleChangeFun(e) {
    setTemplateState(id, e.target.value);
  }

  if (options) {
    if (!options.value[0]) {
      return;
    }
    templateState[id] = options.value[0].textContent.trim();
  }

  return (
    <table style={{ border: "1" }}>
      <thead>
        <tr>
          {options &&
            Object.keys(options)?.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {options?.label?.map((label, index) => (
          <tr key={index}>
            <td>{label.textContent.trim()}</td>
            <td>{options?.value[index]?.textContent.trim()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
