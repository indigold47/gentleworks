import { useCallback, useEffect, useState } from "react";
import { set, unset, type StringInputProps, type ArrayOfPrimitivesInputProps } from "sanity";
import { useClient } from "sanity";

type FilterOption = {
  label: string;
  value: string;
  useAsFilter: boolean | null;
};

const styles = {
  container: { display: "flex", flexDirection: "column" as const, gap: "10px" },
  row: { display: "flex", alignItems: "center" as const, gap: "8px", cursor: "pointer" },
  label: { fontSize: "13px" },
  muted: { fontSize: "12px", color: "#8a8a8a", cursor: "pointer" },
  warning: { fontSize: "13px", color: "#c57600", padding: "8px 0" },
};

/**
 * Fetch filter category options for a given project field.
 */
function useFilterOptions(projectField: string) {
  const client = useClient({ apiVersion: "2026-04-09" });
  const [options, setOptions] = useState<FilterOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    client
      .fetch<{ options: FilterOption[] | null } | null>(
        `*[_type == "filterCategory" && projectField == $field][0]{
          "options": options[]{ label, "value": coalesce(value.current, value), useAsFilter }
        }`,
        { field: projectField },
      )
      .then((result) => {
        if (cancelled) return;
        setOptions(result?.options ?? []);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [client, projectField]);

  return { options, loading };
}

/**
 * Custom string input — radio buttons pulled from Filter Category.
 */
export function FilterCategoryStringInput(props: StringInputProps) {
  const { value, onChange, schemaType } = props;
  const projectField =
    (schemaType.options as Record<string, unknown> | undefined)?.projectField as
      | string
      | undefined;

  const { options, loading } = useFilterOptions(projectField ?? schemaType.name);

  const handleChange = useCallback(
    (optionValue: string) => {
      onChange(value === optionValue ? unset() : set(optionValue));
    },
    [value, onChange],
  );

  if (loading) return <span style={styles.muted}>Loading options...</span>;

  if (options.length === 0) {
    return (
      <p style={styles.warning}>
        No Filter Category found for this field. Create one in the Filter
        Category section.
      </p>
    );
  }

  return (
    <div style={styles.container}>
      {options.map((opt) => (
        <label key={opt.value} style={styles.row}>
          <input
            type="radio"
            name={schemaType.name}
            checked={value === opt.value}
            onChange={() => handleChange(opt.value)}
          />
          <span style={styles.label}>{opt.label}</span>
        </label>
      ))}
      {value && (
        <span
          role="button"
          tabIndex={0}
          style={styles.muted}
          onClick={() => onChange(unset())}
          onKeyDown={(e) => {
            if (e.key === "Enter") onChange(unset());
          }}
        >
          Clear selection
        </span>
      )}
    </div>
  );
}

/**
 * Custom array-of-strings input — checkboxes pulled from Filter Category.
 */
export function FilterCategoryArrayInput(props: ArrayOfPrimitivesInputProps) {
  const { value, onChange, schemaType } = props;
  const projectField =
    (schemaType.options as Record<string, unknown> | undefined)?.projectField as
      | string
      | undefined;

  const { options, loading } = useFilterOptions(projectField ?? schemaType.name);
  const currentValues = (value as string[] | undefined) ?? [];

  const handleToggle = useCallback(
    (optionValue: string) => {
      const next = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];

      onChange(next.length === 0 ? unset() : set(next));
    },
    [currentValues, onChange],
  );

  if (loading) return <span style={styles.muted}>Loading options...</span>;

  if (options.length === 0) {
    return (
      <p style={styles.warning}>
        No Filter Category found for this field. Create one in the Filter
        Category section.
      </p>
    );
  }

  return (
    <div style={styles.container}>
      {options.map((opt) => (
        <label key={opt.value} style={styles.row}>
          <input
            type="checkbox"
            checked={currentValues.includes(opt.value)}
            onChange={() => handleToggle(opt.value)}
          />
          <span style={styles.label}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
